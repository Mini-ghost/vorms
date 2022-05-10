import {
  inject,
  getCurrentInstance,
  InjectionKey,
  WritableComputedRef,
} from 'vue';
import {
  FieldValidator,
  FieldArrayValidator,
  FieldProps,
  FieldAttrs,
  SetFieldArrayValue,
  FormTouched,
} from '../types';

function injectMaybeSelf<T>(
  key: InjectionKey<T>,
  def: T | undefined = undefined,
): T | undefined {
  const vm = getCurrentInstance() as any;
  return vm?.provides[key as any] || inject(key, def);
}

export interface FormContextValuse {
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
  getFieldProps: (name: string) => FieldProps;
  setFieldValue: (name: string, value: any) => void;

  getFieldError: (name: string) => string | undefined;
  getFieldTouched: (name: string) => FormTouched<any>;
  getFieldDirty: (name: string) => boolean;
  getFieldAttrs: (name: string) => FieldAttrs;

  setFieldArrayValue: SetFieldArrayValue;
}

export const FormContextKey: InjectionKey<FormContextValuse> = Symbol(
  'vue-composition-form',
);

export function useFormContext() {
  const context = injectMaybeSelf(FormContextKey) as FormContextValuse;
  return context;
}
