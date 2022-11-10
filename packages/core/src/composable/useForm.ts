import { computed, reactive, ref, unref, onMounted, provide } from 'vue';
import isEqual from 'fast-deep-equal/es6';
import { klona as deepClone } from 'klona/full';
import deepmerge from 'deepmerge';

import { FormContextKey } from './useFormContext';
import { InternalContextKey } from './useInternalContext';
import useFormStore from './useFormStore';

import isPromise from '../utils/isPromise';
import isString from '../utils/isString';
import isFunction from '../utils/isFunction';
import keysOf from '../utils/keysOf';
import get from '../utils/get';
import set from '../utils/set';

import type { Reducer } from './useFormStore';
import type {
  MaybeRef,
  FormValues,
  FormState,
  FormErrors,
  FormEventHandler,
  FieldMeta,
  FieldAttrs,
  UseFormRegister,
  UseFormReturn,
  ValidateField,
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
  initialErrors?: FormErrors<Values>;
  initialTouched?: FormTouched<Values>;
  validateMode?: ValidateMode;
  reValidateMode?: ValidateMode;
  validateOnMounted?: boolean;
  onSubmit: (values: Values, helper: FormSubmitHelper) => void | Promise<any>;
  /**
   * @deprecated Will be removed in a major release. Please use `watch(errors, callback)` instead.
   */
  onError?: (errors: FormErrors<Values>) => void;
  validate?: (values: Values) => void | object | Promise<FormErrors<Values>>;
}

const enum ACTION_TYPE {
  SUBMIT_ATTEMPT,
  SUBMIT_SUCCESS,
  SUBMIT_FAILURE,
  SET_VALUES,
  SET_FIELD_VALUE,
  SET_TOUCHED,
  SET_ERRORS,
  SET_FIELD_ERROR,
  SET_ISSUBMITTING,
  SET_ISVALIDATING,
  RESET_FORM,
}

type FormMessage<Values extends FormValues> =
  | { type: ACTION_TYPE.SUBMIT_ATTEMPT }
  | { type: ACTION_TYPE.SUBMIT_SUCCESS }
  | { type: ACTION_TYPE.SUBMIT_FAILURE }
  | { type: ACTION_TYPE.SET_VALUES; payload: Values }
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
  | { type: ACTION_TYPE.SET_ISVALIDATING; payload: boolean }
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
    case ACTION_TYPE.SET_VALUES:
      keysOf(state.values).forEach((key) => {
        delete state.values[key];
      });

      keysOf(message.payload).forEach((path) => {
        (state.values as Values)[path] = message.payload[path];
      });
      return;
    case ACTION_TYPE.SET_FIELD_VALUE:
      set(state.values, message.payload.path, deepClone(message.payload.value));
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
    case ACTION_TYPE.SET_ISVALIDATING:
      state.isValidating.value = message.payload;
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
      state.submitCount.value = message.payload.submitCount;
  }
}

const emptyErrors: FormErrors<unknown> = {};
const emptyTouched: FormTouched<unknown> = {};

/**
 * Custom composition API to mange the entire form.
 *
 * @param options - form configuration and validation parameters. {@link UseFormOptions}
 *
 * @returns methods and state of this form. {@link UseFormReturn}
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { register, handleSubmit } = useForm({
 *   initialValues: {
 *     name: 'Alex',
 *     age: 18,
 *   },
 *   onSubmit (values) {
 *     console.log({ values })
 *   },
 * });
 *
 * const { value: name, attrs: nameAttrs } = register('name')
 * const { value: age, attrs: ageAttrs } = register('name')
 * </script>
 *
 * <template>
 *   <form v-on:submit="handleSubmit">
 *     <input v-model="name" type="text" v-bind="nameAttrs" />
 *     <input v-model.number="age" type="text" v-bind="ageAttrs" />
 *     <input type="submit" />
 *   </form>
 * </template>
 * ```
 */
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

  let initialValues = deepClone(options.initialValues);
  let initialErrors = deepClone(options.initialErrors || emptyErrors);
  let initialTouched = deepClone(options.initialTouched || emptyTouched);

  const [state, dispatch] = useFormStore<
    Reducer<FormState<Values>, FormMessage<Values>>
  >(reducer, {
    values: reactive(deepClone(initialValues)),
    errors: ref(deepClone(initialErrors)),
    touched: ref(deepClone(initialTouched)),
    submitCount: ref(0),
    isSubmitting: ref(false),
    isValidating: ref(false),
  });

  const fieldRegistry: FieldRegistry = {};
  const fieldArrayRegistry: FieldArrayRegistry = {};

  const dirty = computed(() => !isEqual(state.values, initialValues));
  const validateTiming = computed(() =>
    state.submitCount.value === 0 ? validateMode : reValidateMode,
  );

  const registerField = (name: MaybeRef<string>, { validate }: any = {}) => {
    fieldRegistry[unref(name)] = {
      validate,
    };
  };

  const registerFieldArray = (name: MaybeRef<string>, options: any) => {
    const { validate, reset } = options;

    fieldRegistry[unref(name)] = {
      validate,
    };

    fieldArrayRegistry[unref(name)] = {
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

  const setValues = (values: Values, shouldValidate?: boolean) => {
    dispatch({
      type: ACTION_TYPE.SET_VALUES,
      payload: values,
    });

    const willValidate =
      shouldValidate == null
        ? validateTiming.value === 'change'
        : shouldValidate;

    return willValidate
      ? runAllValidateHandler(state.values)
      : Promise.resolve();
  };

  const setFieldValue = (
    name: string,
    value: any,
    shouldValidate?: boolean,
  ) => {
    dispatch({
      type: ACTION_TYPE.SET_FIELD_VALUE,
      payload: {
        path: name,
        value,
      },
    });

    const willValidate =
      shouldValidate == null
        ? validateTiming.value === 'input'
        : shouldValidate;

    return willValidate
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

  const getFieldValue = (name: MaybeRef<string>) => {
    return computed<any>({
      get() {
        return get(state.values, unref(name));
      },
      set(value) {
        setFieldValue(unref(name), value);
      },
    });
  };

  const getFieldMeta = (name: MaybeRef<string>): FieldMeta => {
    const error = computed(() => getFieldError(unref(name)) as any as string);
    const touched = computed(() => getFieldTouched(unref(name)));
    const dirty = computed(() => getFieldDirty(unref(name)));

    return {
      dirty,
      error,
      touched,
    };
  };

  const getFieldAttrs = (name: MaybeRef<string>) => {
    return computed<FieldAttrs>(() => ({
      name: unref(name),
      onBlur: handleBlur,
      onChange: handleChange,
    }));
  };

  const getFieldError = (name: string): FormErrors<any> => {
    return get(state.errors.value, name);
  };

  const getFieldTouched = (name: string): FormTouched<boolean> => {
    return get(state.touched.value, name, false);
  };

  const getFieldDirty = (name: string): boolean => {
    return !isEqual(get(initialValues, name), get(state.values, name));
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

    const fieldValidatePromise = fieldKeysWithValidation.map((field) =>
      runSingleFieldValidateHandler(field, get(values, field)),
    );

    return Promise.all(fieldValidatePromise).then((errors) =>
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
          resolve(error || {});
        });
      } else {
        resolve(maybePromise);
      }
    });
  };

  const runAllValidateHandler = (values: Values = state.values) => {
    dispatch({ type: ACTION_TYPE.SET_ISVALIDATING, payload: true });
    return Promise.all([
      runFieldValidateHandler(values),
      options.validate ? runValidateHandler(values) : {},
    ])
      .then(([fieldErrors, validateErrors]) => {
        const errors = deepmerge.all<FormErrors<Values>>(
          [fieldErrors, validateErrors],
          {
            arrayMerge,
          },
        );

        dispatch({ type: ACTION_TYPE.SET_ERRORS, payload: errors });

        return errors;
      })
      .finally(() => {
        dispatch({ type: ACTION_TYPE.SET_ISVALIDATING, payload: false });
      });
  };

  const handleSubmit = (event?: Event) => {
    event?.preventDefault();

    dispatch({ type: ACTION_TYPE.SUBMIT_ATTEMPT });

    runAllValidateHandler().then((errors) => {
      const isValid = keysOf(errors).length === 0;

      if (isValid) {
        const maybePromise = onSubmit(deepClone(state.values), submitHelper);
        if (maybePromise == null) {
          return;
        }

        maybePromise
          .then((result) => {
            dispatch({ type: ACTION_TYPE.SUBMIT_SUCCESS });
            return result;
          })
          .catch(() => {
            dispatch({ type: ACTION_TYPE.SUBMIT_FAILURE });
          });
      } else {
        dispatch({ type: ACTION_TYPE.SUBMIT_FAILURE });
        onError?.(errors);
      }
    });
  };

  const resetForm: ResetForm<Values> = (nextState) => {
    const values = deepClone(nextState?.values || initialValues);
    const errors = deepClone(nextState?.errors || initialErrors);
    const touched = deepClone(nextState?.touched || initialTouched);

    initialValues = deepClone(values);
    initialErrors = deepClone(errors);
    initialTouched = deepClone(touched);

    dispatch({
      type: ACTION_TYPE.RESET_FORM,
      payload: {
        values,
        touched,
        errors,
        submitCount:
          typeof nextState?.submitCount === 'number'
            ? nextState.submitCount
            : 0,
      },
    });

    // reset `fields` of `useFieldArray`
    Object.values(fieldArrayRegistry).forEach((field) => {
      field.reset();
    });
  };

  const handleReset = (event?: Event) => {
    event?.preventDefault();

    resetForm();
  };

  const register: UseFormRegister<Values> = (name, options) => {
    registerField(name, options);

    return {
      value: getFieldValue(name),
      attrs: getFieldAttrs(name),
      ...getFieldMeta(name),
    };
  };

  const validateField: ValidateField<Values> = (name) => {
    if (fieldRegistry[name] && isFunction(fieldRegistry[name].validate)) {
      dispatch({ type: ACTION_TYPE.SET_ISVALIDATING, payload: true });
      return runSingleFieldValidateHandler(name, get(state.values, name))
        .then((error) => {
          dispatch({
            type: ACTION_TYPE.SET_FIELD_ERROR,
            payload: { path: name, error },
          });
        })
        .finally(() => {
          dispatch({ type: ACTION_TYPE.SET_ISVALIDATING, payload: false });
        });
    }
    return Promise.resolve();
  };

  const context = {
    values: state.values,
    touched: computed(() => state.touched.value),
    errors: computed(() => state.errors.value),
    submitCount: computed(() => state.submitCount.value),
    isSubmitting: state.isSubmitting,
    isValidating: computed(() => state.isValidating.value),
    dirty,
    register,
    setValues,
    setFieldValue,
    handleSubmit,
    handleReset,
    resetForm,
    validateForm: runAllValidateHandler,
    validateField,
  };

  provide(InternalContextKey, {
    getFieldMeta,
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

  provide<UseFormReturn<Values>>(FormContextKey, context);

  onMounted(() => {
    if (!validateOnMounted) return;
    runAllValidateHandler(initialValues);
  });

  return context;
}

/**
 * deepmerge array merging algorithm
 * https://github.com/TehShrike/deepmerge#arraymerge-example-combine-arrays
 */
function arrayMerge<T extends any[]>(target: T, source: T, options: any) {
  const destination = [...target];

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
}
