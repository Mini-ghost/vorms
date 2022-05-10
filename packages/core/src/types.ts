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

export type FieldArrayValidator<Value extends Array<any>> = (
  value: Value,
) => FormErrors<Value> | void | Promise<FormErrors<Value> | void>;

export type FormTouched<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? FormTouched<Values[K][number]>[]
      : boolean
    : Values[K] extends object
    ? FormTouched<Values[K]>
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

export interface FormState<Values extends FormValues> {
  values: UnwrapNestedRefs<Values>;
  touched: Ref<FormTouched<Values>>;
  errors: Ref<FormErrors<Values>>;
  submitCount: Ref<number>;
  isSubmitting: Ref<boolean>;
}

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

export type UseFormRegisterReturn<Value> = FieldMeta & {
  value: WritableComputedRef<Value>;
};

export type SetFieldArrayValue = <T extends (...args: any) => any>(
  name: string,
  value: any[],
  method?: T,
  args?: Partial<{
    argA: Parameters<T>[1];
    argB: Parameters<T>[2];
  }>,
  shouldSetValue?: boolean,
) => void;

export type UseFormRegister<Values extends FormValues> = <
  Name extends Path<Values>,
  Value = PathValue<Values, Name>,
>(
  name: Name,
  options?: FieldRegisterOptions<Value>,
) => UseFormRegisterReturn<Value>;

export type UseFormValidateField<Values extends FormValues> = <
  Name extends Path<Values>,
>(
  name: Name,
) => Promise<void>;

export interface FormResetState<Values extends FormValues = FormValues> {
  values: Values;
  touched: FormTouched<Values>;
  errors: FormErrors<Values>;
}

export type ResetForm<Values extends FormValues> = (
  nextState?: Partial<FormResetState<Values>>,
) => void;

export interface UseFormReturn<Values extends FormValues> {
  values: DeepReadonly<UnwrapNestedRefs<Values>>;
  touched: ComputedRef<FormTouched<Values>>;
  errors: ComputedRef<FormErrors<Values>>;
  submitCount: ComputedRef<number>;
  isSubmitting: Ref<boolean>;
  dirty: ComputedRef<boolean>;
  register: UseFormRegister<Values>;
  handleSubmit: (event?: Event) => void;
  handleReset: (event?: Event) => void;
  resetForm: ResetForm<Values>;
  validateField: UseFormValidateField<Values>;
}

export interface FieldAttrs {
  onBlur: () => void;
  onChange: () => void;
}

export interface FieldMeta {
  dirty: ComputedRef<boolean>;
  error: ComputedRef<string | undefined>;
  events: FieldAttrs;
  touched: ComputedRef<FormTouched<any>>;
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
