import {
  ComputedRef,
  getCurrentInstance,
  inject,
  InjectionKey,
  WritableComputedRef,
} from 'vue';

import {
  FieldArrayValidator,
  FieldAttrs,
  FieldError,
  FormTouched,
  FormValues,
  MaybeRefOrGetter,
  Path,
  PathValue,
  SetFieldArrayValue,
  UseFormRegister,
  UseFormSetFieldTouched,
  UseFormSetFieldValue,
} from '../types';

function injectMaybeSelf<T>(
  key: InjectionKey<T>,
  defaultValue: T | undefined = undefined,
): T | undefined {
  const vm = getCurrentInstance() as any;
  return vm?.provides[key as any] || inject(key, defaultValue);
}

export interface InternalContextValues<Values extends FormValues> {
  registerFieldArray: (
    name: MaybeRefOrGetter<Path<Values>>,
    options: {
      validate?: FieldArrayValidator<PathValue<Values, Path<Values>>>;
      reset: () => void;
    },
  ) => void;

  getFieldValue: (
    name: MaybeRefOrGetter<Path<Values>>,
  ) => WritableComputedRef<PathValue<Values, Path<Values>>>;

  setFieldValue: UseFormSetFieldValue<FormValues>;

  getFieldError: (
    name: MaybeRefOrGetter<Path<Values>>,
  ) => FieldError<PathValue<Values, Path<Values>>>;

  getFieldTouched: (name: MaybeRefOrGetter<string>) => FormTouched<boolean>;
  getFieldDirty: (name: MaybeRefOrGetter<string>) => boolean;
  getFieldAttrs: (name: MaybeRefOrGetter<string>) => ComputedRef<FieldAttrs>;

  setFieldArrayValue: SetFieldArrayValue<FormValues>;
  setFieldTouched: UseFormSetFieldTouched<FormValues>;

  register: UseFormRegister<FormValues>;
}

export const InternalContextKey: InjectionKey<
  InternalContextValues<FormValues>
> = Symbol(__DEV__ ? 'vorms internal context' : '');

export function useInternalContext() {
  const context = injectMaybeSelf(
    InternalContextKey,
  ) as InternalContextValues<FormValues>;
  return context;
}
