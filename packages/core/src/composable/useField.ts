import { useFormContext } from './useFormContext';
import type { FieldValidator, UseFormRegisterReturn } from '../types';

type UseFieldOptions<Value> = {
  validate?: FieldValidator<Value>;
};

export function useField<Value>(
  name: string,
  options: UseFieldOptions<Value> = {},
): UseFormRegisterReturn<Value> {
  const { registerField, getFieldMeta, getFieldValue } = useFormContext();
  registerField(name, options);

  return {
    value: getFieldValue<Value>(name),
    ...getFieldMeta(name),
  };
}
