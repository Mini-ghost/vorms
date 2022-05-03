import {
  ComputedRef,
  DeepReadonly,
  WritableComputedRef,
  UnwrapNestedRefs,
  Ref,
} from 'vue';

export type FormValues = Record<string, any>;

export type FieldValidator<Value> = (
  value: Value,
) => string | void | Promise<string | void>;

export type FormikTouched<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? FormikTouched<Values[K][number]>[]
      : boolean
    : Values[K] extends object
    ? FormikTouched<Values[K]>
    : boolean;
};

export type FormErrors<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? FormErrors<Values[K][number]>[] | string | string[]
      : string | string[]
    : Values[K] extends object
    ? FormErrors<Values[K]>
    : string;
};

export interface FormEventHandler {
  handleBlur: {
    (event: Event, name?: string): void;
    <T = string | Event>(name: T): T extends string ? () => void : void;
  };

  handleChange: () => void;
}

export interface FieldRegisterOptions<Values> {
  validate?: FieldValidator<Values>;
}

export interface UseFormRegisterReturn<Value> {
  value: WritableComputedRef<Value>;
  dirty: ComputedRef<boolean>;
  error: ComputedRef<string>;
  touched: ComputedRef<boolean>;
  onBlur: () => void;
  onChange: () => void;
}

export type UseFormRegister<Values extends FormValues> = <
  Name extends Path<Values>,
  Value = PathValue<Values, Name>,
>(
  name: Name,
  options?: FieldRegisterOptions<Value>,
) => UseFormRegisterReturn<Value>;

export interface UseFormReturn<Values extends FormValues> {
  values: DeepReadonly<UnwrapNestedRefs<Values>>;
  touched: ComputedRef<FormikTouched<Values>>;
  errors: ComputedRef<FormErrors<Values>>;
  submitCount: ComputedRef<number>;
  isSubmitting: Ref<boolean>;
  dirty: ComputedRef<boolean>;
  register: UseFormRegister<Values>;
  handleBlur: FormEventHandler['handleBlur'];
  handleChange: () => void;
  handleSubmit: (event?: Event) => void;
  handleReset: (event?: Event) => void;
}

export interface FieldProps {
  dirty: ComputedRef<boolean>;
  error: ComputedRef<string>;
  touched: ComputedRef<boolean>;
  onBlur: () => void;
  onChange: () => void;
}

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type IsTuple<T extends ReadonlyArray<any>> = number extends T['length']
  ? false
  : true;

type PathImpl<K extends string | number, V> = V extends Primitive
  ? `${K}`
  : `${K}` | `${K}.${Path<V>}`;

export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<
  keyof T,
  keyof any[]
>;

export type Path<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>;
      }[TupleKeys<T>]
    : PathImpl<number, V>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K]>;
    }[keyof T];

type ArrayPathImpl<K extends string | number, V> = V extends Primitive
  ? never
  : V extends ReadonlyArray<infer U>
  ? U extends Primitive
    ? never
    : `${K}` | `${K}.${ArrayPath<V>}`
  : `${K}.${ArrayPath<V>}`;

export type ArrayPath<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: ArrayPathImpl<K & string, T[K]>;
      }[TupleKeys<T>]
    : ArrayPathImpl<number, V>
  : {
      [K in keyof T]-?: ArrayPathImpl<K & string, T[K]>;
    }[keyof T];

export type PathValue<T, P extends Path<T> | ArrayPath<T>> = T extends any
  ? P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? Rest extends Path<T[Key]>
        ? PathValue<T[Key], Rest>
        : never
      : Key extends `${number}`
      ? T extends ReadonlyArray<infer V>
        ? PathValue<V, Rest & Path<V>>
        : never
      : never
    : P extends keyof T
    ? T[P]
    : P extends `${number}`
    ? T extends ReadonlyArray<infer V>
      ? V
      : never
    : never
  : never;
