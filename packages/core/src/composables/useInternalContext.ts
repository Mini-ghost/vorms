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
  FormErrors,
  FormTouched,
  FormValues,
  MaybeRefOrGetter,
  SetFieldArrayValue,
  UseFormRegister,
  UseFormSetFieldValue,
} from '../types';

function injectMaybeSelf<T>(
  key: InjectionKey<T>,
  defaultValue: T | undefined = undefined,
): T | undefined {
  const vm = getCurrentInstance() as any;
  return vm?.provides[key as any] || inject(key, defaultValue);
}

export interface InternalContextValues {
  registerFieldArray: (
    name: MaybeRefOrGetter<string>,
    options: {
      validate?: FieldArrayValidator<any>;
      reset: () => void;
    },
  ) => void;

  getFieldValue: <Value>(
    name: MaybeRefOrGetter<string>,
  ) => WritableComputedRef<Value>;
  setFieldValue: UseFormSetFieldValue<FormValues>;

  getFieldError: (name: MaybeRefOrGetter<string>) => FormErrors<any>;
  getFieldTouched: (name: MaybeRefOrGetter<string>) => FormTouched<boolean>;
  getFieldDirty: (name: MaybeRefOrGetter<string>) => boolean;
  getFieldAttrs: (name: MaybeRefOrGetter<string>) => ComputedRef<FieldAttrs>;

  setFieldArrayValue: SetFieldArrayValue<FormValues>;

  register: UseFormRegister<FormValues>;
}

export const InternalContextKey: InjectionKey<InternalContextValues> = Symbol(
  __DEV__ ? 'vorms internal context' : '',
);

export function useInternalContext() {
  const context = injectMaybeSelf(InternalContextKey) as InternalContextValues;
  return context;
}
