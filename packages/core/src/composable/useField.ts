import { useFormContext } from './useFormContext';

export type FieldValidator<Value> = (
  value: Value,
) => string | void | Promise<string | void>;

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
    value: getFieldValue(name),
    ...getFieldProps(name),
  };
}
