export type FormValues = Record<string, any>;

export type FieldValidator<Value> = (
  value: Value,
) => string | void | Promise<string | void>;
