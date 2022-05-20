import {
  inject,
  getCurrentInstance,
  InjectionKey,
  WritableComputedRef,
} from 'vue';
import {
  FieldValidator,
  FieldArrayValidator,
  FieldMeta,
  FieldAttrs,
  SetFieldArrayValue,
  FormTouched,
  FormErrors,
} from '../types';

function injectMaybeSelf<T>(
  key: InjectionKey<T>,
  def: T | undefined = undefined,
): T | undefined {
  const vm = getCurrentInstance() as any;
  return vm?.provides[key as any] || inject(key, def);
}

export interface FormInternalContextValuse {
  registerField: (
    name: string,
    options: { validate?: FieldValidator<any> },
  ) => void;

  registerFieldArray: (
    name: string,
    options: {
      validate?: FieldArrayValidator<any>;
      reset: () => void;
    },
  ) => void;

  getFieldValue: <Value>(name: string) => WritableComputedRef<Value>;
  getFieldMeta: (name: string) => FieldMeta;
  setFieldValue: (name: string, value: any) => void;

  getFieldError: (name: string) => FormErrors<any>;
  getFieldTouched: (name: string) => FormTouched<any>;
  getFieldDirty: (name: string) => boolean;
  getFieldAttrs: (name: string) => FieldAttrs;

  setFieldArrayValue: SetFieldArrayValue;
}

export const FormInternalContextKey: InjectionKey<FormInternalContextValuse> =
  Symbol('vue composition form internal context key');

export function useFormInternalContext() {
  const context = injectMaybeSelf(
    FormInternalContextKey,
  ) as FormInternalContextValuse;
  return context;
}