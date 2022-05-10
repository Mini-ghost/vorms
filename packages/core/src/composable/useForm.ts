import {
  computed,
  reactive,
  ref,
  onMounted,
  provide,
  readonly,
  Ref,
} from 'vue';
import isEqual from 'fast-deep-equal/es6';
import { klona as deepClone } from 'klona/full';
import deepmerge from 'deepmerge';

import { FormContextKey } from './useFormContext';
import isPromise from '../utils/isPromise';
import keysOf from '../utils/keysOf';
import isFunction from '../utils/isFunction';
import get from '../utils/get';
import set from '../utils/set';

import useFormStore from './useFormStore';
import isString from '../utils/isString';

import type { Reducer } from './useFormStore';
import type {
  FormValues,
  FormState,
  FormErrors,
  FormEventHandler,
  FieldProps,
  FieldAttrs,
  UseFormRegister,
  UseFormReturn,
  UseFormValidateField,
  SetFieldArrayValue,
  FormResetState,
  ResetForm,
  FormTouched,
} from '../types';

interface FieldRegistry {
  [field: string]: {
    validate: (value: any) => string | Promise<string> | boolean | undefined;
  };
}

interface FieldArrayRegistry {
  [field: string]: {
    reset: () => void;
  };
}

export interface FormSubmitHelper {
  setSubmitting: (isSubmitting: boolean) => void;
}

export type ValidateMode = 'blur' | 'input' | 'change' | 'submit';

export interface UseFormOptions<Values extends FormValues> {
  initialValues: Values;
  validateMode?: ValidateMode;
  reValidateMode?: ValidateMode;
  validateOnMounted?: boolean;
  onSubmit: (values: Values, helper: FormSubmitHelper) => void | Promise<any>;
  onError?: (errors: FormErrors<Values>) => void;
  validate?: (values: Values) => void | object | Promise<FormErrors<Values>>;
}

const enum ACTION_TYPE {
  SUBMIT_ATTEMPT,
  SUBMIT_SUCCESS,
  SUBMIT_FAILURE,
  SET_FIELD_VALUE,
  SET_TOUCHED,
  SET_ERRORS,
  SET_FIELD_ERROR,
  SET_ISSUBMITTING,
  RESET_FORM,
}

type FormMessage<Values extends FormValues> =
  | { type: ACTION_TYPE.SUBMIT_ATTEMPT }
  | { type: ACTION_TYPE.SUBMIT_SUCCESS }
  | { type: ACTION_TYPE.SUBMIT_FAILURE }
  | { type: ACTION_TYPE.SET_FIELD_VALUE; payload: { path: string; value: any } }
  | {
      type: ACTION_TYPE.SET_TOUCHED;
      payload: { path: string; touched?: boolean };
    }
  | { type: ACTION_TYPE.SET_ERRORS; payload: FormErrors<Values> }
  | {
      type: ACTION_TYPE.SET_FIELD_ERROR;
      payload: { path: string; error: string };
    }
  | { type: ACTION_TYPE.SET_ISSUBMITTING; payload: boolean }
  | { type: ACTION_TYPE.RESET_FORM; payload: FormResetState<Values> };

function reducer<Values extends FormValues>(
  state: FormState<Values>,
  message: FormMessage<Values>,
) {
  switch (message.type) {
    case ACTION_TYPE.SUBMIT_ATTEMPT:
      state.isSubmitting.value = true;
      state.submitCount.value = state.submitCount.value + 1;
      return;
    case ACTION_TYPE.SUBMIT_SUCCESS:
      state.isSubmitting.value = false;
      return;
    case ACTION_TYPE.SUBMIT_FAILURE:
      state.isSubmitting.value = false;
      return;
    case ACTION_TYPE.SET_FIELD_VALUE:
      set(state.values, message.payload.path, message.payload.value);
      return;
    case ACTION_TYPE.SET_TOUCHED:
      set(state.touched.value, message.payload.path, message.payload.touched);
      return;
    case ACTION_TYPE.SET_ERRORS:
      state.errors.value = message.payload;
      return;
    case ACTION_TYPE.SET_FIELD_ERROR:
      set(state.errors.value, message.payload.path, message.payload.error);
      return;
    case ACTION_TYPE.SET_ISSUBMITTING:
      state.isSubmitting.value = message.payload;
      return;
    case ACTION_TYPE.RESET_FORM:
      keysOf(state.values).forEach((key) => {
        delete state.values[key];
      });

      keysOf(message.payload.values).forEach((path) => {
        (state.values as Values)[path] = message.payload.values[path];
      });

      state.touched.value = message.payload.touched;
      state.errors.value = message.payload.errors;
  }
}

export function useForm<Values extends FormValues = FormValues>(
  options: UseFormOptions<Values>,
): UseFormReturn<Values> {
  const {
    validateOnMounted = false,
    validateMode = 'submit',
    reValidateMode = 'change',
    onSubmit,
    onError,
  } = options;

  const [state, dispatch] = useFormStore<
    Reducer<FormState<Values>, FormMessage<Values>>
  >(reducer, {
    values: reactive(deepClone(options.initialValues)),
    errors: ref({}) as Ref<FormErrors<Values>>,
    touched: ref({}),
    submitCount: ref(0),
    isSubmitting: ref(false),
  });

  let initalValues = deepClone(options.initialValues);
  const fieldRegistry: FieldRegistry = {};
  const fieldArrayRegistry: FieldArrayRegistry = {};

  const dirty = computed(() => !isEqual(state.values, initalValues));
  const validateTiming = computed(() =>
    state.submitCount.value === 0 ? validateMode : reValidateMode,
  );

  const registerField = (name: string, { validate }: any = {}) => {
    fieldRegistry[name] = {
      validate,
    };
  };

  const registerFieldArray = (name: string, { reset, validate }: any) => {
    fieldRegistry[name] = {
      validate,
    };

    fieldArrayRegistry[name] = {
      reset,
    };
  };

  const setFieldTouched = (name: string, touched = true) => {
    dispatch({
      type: ACTION_TYPE.SET_TOUCHED,
      payload: {
        path: name,
        touched,
      },
    });

    return validateTiming.value === 'blur'
      ? runAllValidateHandler(state.values)
      : Promise.resolve();
  };

  const setFieldValue = (name: string, value: any) => {
    dispatch({
      type: ACTION_TYPE.SET_FIELD_VALUE,
      payload: {
        path: name,
        value,
      },
    });

    return validateTiming.value === 'input'
      ? runAllValidateHandler(state.values)
      : Promise.resolve();
  };

  const setFieldArrayValue: SetFieldArrayValue = (
    name,
    value,
    method,
    args,
    shouldSetValue = true,
  ) => {
    if (method && args) {
      if (
        keysOf(state.errors.value).length &&
        Array.isArray(get(state.errors.value, name))
      ) {
        const error = method(
          get(state.errors.value, name),
          args.argA,
          args.argB,
        );

        if (shouldSetValue) {
          dispatch({
            type: ACTION_TYPE.SET_FIELD_ERROR,
            payload: {
              path: name,
              error,
            },
          });
        }
      }

      if (
        keysOf(state.touched.value).length &&
        Array.isArray(get(state.touched.value, name))
      ) {
        const touched = method(
          get(state.touched.value, name),
          args.argA,
          args.argB,
        );

        if (shouldSetValue) {
          dispatch({
            type: ACTION_TYPE.SET_TOUCHED,
            payload: {
              path: name,
              touched,
            },
          });
        }
      }
    }

    return setFieldValue(name, value);
  };

  const handleBlur: FormEventHandler['handleBlur'] = (
    eventOrName: Event | string,
    path?: string,
  ): void | (() => void) => {
    if (isString(eventOrName)) {
      return () => setFieldTouched(eventOrName, true);
    }

    const { name, id } = eventOrName.target as HTMLInputElement;
    const field = path ?? (name || id);

    if (field) {
      setFieldTouched(field, true);
    }
  };

  const handleChange: FormEventHandler['handleChange'] = () => {
    if (validateTiming.value === 'change') {
      runAllValidateHandler(state.values);
    }
  };

  const setSubmitting = (isSubmitting: boolean) => {
    dispatch({ type: ACTION_TYPE.SET_ISSUBMITTING, payload: isSubmitting });
  };

  const getFieldValue = <Value>(name: string) => {
    return computed<Value>({
      get() {
        return get(state.values, name);
      },
      set(value) {
        setFieldValue(name, value);
      },
    });
  };

  const getFieldProps = (name: string): FieldProps => {
    const error = computed(() => getFieldError(name));
    const touched = computed(() => getFieldTouched(name));
    const dirty = computed(() => getFieldDirty(name));
    const events = getFieldAttrs(name);

    return {
      dirty,
      error,
      touched,
      events,
    };
  };

  const getFieldAttrs = (name: string): FieldAttrs => {
    return {
      onBlur: handleBlur(name),
      onChange: handleChange,
    };
  };

  const getFieldError = (name: string): string | undefined => {
    return get(state.errors.value, name);
  };

  const getFieldTouched = (name: string): FormTouched<any> => {
    return get(state.touched.value, name);
  };

  const getFieldDirty = (name: string): boolean => {
    return !isEqual(get(initalValues, name), get(state.values, name));
  };

  const submitHelper: FormSubmitHelper = {
    setSubmitting,
  };

  const runSingleFieldValidateHandler = (name: string, value: unknown) => {
    return new Promise<string>((resolve) =>
      resolve(fieldRegistry[name].validate(value) as string),
    );
  };

  const runFieldValidateHandler = (values: Values) => {
    const fieldKeysWithValidation = keysOf(fieldRegistry).filter((field) =>
      isFunction(fieldRegistry[field].validate),
    ) as string[];

    const fieldValidatePromisea = fieldKeysWithValidation.map((field) =>
      runSingleFieldValidateHandler(field, get(values, field)),
    );

    return Promise.all(fieldValidatePromisea).then((errors) =>
      errors.reduce((prev, curr, index) => {
        if (curr) {
          set(prev, fieldKeysWithValidation[index], curr);
        }
        return prev;
      }, {} as FormErrors<Values>),
    );
  };

  const runValidateHandler = (values: Values) => {
    return new Promise<FormErrors<Values>>((resolve) => {
      const maybePromise = options.validate?.(values);
      if (maybePromise == null) {
        resolve({});
      } else if (isPromise(maybePromise)) {
        maybePromise.then((error) => {
          resolve(error);
        });
      } else {
        resolve(maybePromise);
      }
    });
  };

  const runAllValidateHandler = (values: Values) => {
    return Promise.all([
      runFieldValidateHandler(values),
      options.validate ? runValidateHandler(values) : {},
    ]).then(([fieldErrors, validateErrors]) => {
      const errors = deepmerge.all<FormErrors<Values>>([
        fieldErrors,
        validateErrors,
      ]);

      dispatch({ type: ACTION_TYPE.SET_ERRORS, payload: errors });

      return errors;
    });
  };

  const handleSubmit = (event?: Event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    dispatch({ type: ACTION_TYPE.SUBMIT_ATTEMPT });

    const values = deepClone(state.values);

    runAllValidateHandler(values).then((errors) => {
      const isValid = keysOf(errors).length === 0;

      if (isValid) {
        const maybePromise = onSubmit(values, submitHelper);
        if (maybePromise == null) {
          return;
        }

        maybePromise
          .then((result) => {
            dispatch({ type: ACTION_TYPE.SUBMIT_SUCCESS });
            return result;
          })
          .catch((error) => {
            dispatch({ type: ACTION_TYPE.SUBMIT_FAILURE });
            throw error;
          });
      } else {
        dispatch({ type: ACTION_TYPE.SUBMIT_FAILURE });
        onError?.(errors);
      }
    });
  };

  const resetForm: ResetForm<Values> = (nextState) => {
    const values =
      nextState && nextState.values ? nextState.values : initalValues;

    const touched = nextState && nextState.touched ? nextState.touched : {};
    const errors = nextState && nextState.errors ? nextState.errors : {};

    initalValues = deepClone(values);

    dispatch({
      type: ACTION_TYPE.RESET_FORM,
      payload: {
        values,
        touched,
        errors,
      },
    });

    // reset `fields` of `useFieldArray`
    Object.values(fieldArrayRegistry).forEach((field) => {
      field.reset();
    });
  };

  const handleReset = (event?: Event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    resetForm();
  };

  const register: UseFormRegister<Values> = (name, options) => {
    registerField(name, options);

    return {
      value: getFieldValue(name),
      ...getFieldProps(name),
    };
  };

  const validateField: UseFormValidateField<Values> = (name) => {
    return runSingleFieldValidateHandler(name, get(state.values, name)).then(
      (error) => {
        dispatch({
          type: ACTION_TYPE.SET_FIELD_ERROR,
          payload: { path: name, error },
        });
      },
    );
  };

  provide(FormContextKey, {
    getFieldProps,
    getFieldValue,
    setFieldValue,
    getFieldError,
    getFieldTouched,
    getFieldDirty,
    getFieldAttrs,
    registerField,
    registerFieldArray,
    setFieldArrayValue,
  });

  onMounted(() => {
    if (!validateOnMounted) return;
    runAllValidateHandler(initalValues);
  });

  const context = {
    values: readonly(state.values),
    touched: computed(() => state.touched.value),
    errors: computed(() => state.errors.value),
    submitCount: computed(() => state.submitCount.value),
    isSubmitting: state.isSubmitting,
    dirty,
    register,
    handleSubmit,
    handleReset,
    resetForm,
    validateField,
  };

  return context;
}
