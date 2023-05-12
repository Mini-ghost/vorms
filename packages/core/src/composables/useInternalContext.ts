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
  MaybeRef,
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
    name: MaybeRef<string>,
    options: {
      validate?: FieldArrayValidator<any>;
      reset: () => void;
    },
  ) => void;

  getFieldValue: <Value>(name: MaybeRef<string>) => WritableComputedRef<Value>;
  setFieldValue: UseFormSetFieldValue<FormValues>;

  getFieldError: (name: string) => FormErrors<any>;
  getFieldTouched: (name: string) => FormTouched<boolean>;
  getFieldDirty: (name: string) => boolean;
  getFieldAttrs: (name: MaybeRef<string>) => ComputedRef<FieldAttrs>;

  setFieldArrayValue: SetFieldArrayValue;

  register: UseFormRegister<FormValues>;
}

export const InternalContextKey: InjectionKey<InternalContextValues> = Symbol(
  __DEV__ ? 'vorms internal context' : '',
);

export function useInternalContext() {
  const context = injectMaybeSelf(InternalContextKey) as InternalContextValues;
  return context;
}
