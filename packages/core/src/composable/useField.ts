import { useFormContext } from './useFormContext';
import type { FieldValidator } from '../types';

type UseFieldOptions<Value> = {
  validate?: FieldValidator<Value>;
};

export function useField<Value>(
  name: string,
  options: UseFieldOptions<Value> = {},
) {
  const { registerField, getFieldProps, getFieldValue } = useFormContext();
  registerField(name, options);

  return {
    value: getFieldValue<Value>(name),
    ...getFieldProps(name),
  };
}
