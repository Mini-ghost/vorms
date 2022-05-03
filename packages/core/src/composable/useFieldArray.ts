import { ref, computed, ComputedRef, Ref, WritableComputedRef } from 'vue';
import { useFormContext } from './useFormContext';

import type { FieldValidator } from '../types';

interface FieldEntry<Value> {
  key: number;
  value: WritableComputedRef<Value>;
}

export interface UseFieldArrayOptions<Value> {
  validate?: FieldValidator<Value[]>;
}

interface UseFieldArrayReturn<Value> {
  fields: Ref<FieldEntry<Value>[]>;
  dirty: ComputedRef<boolean>;
  error: ComputedRef<string>;
  touched: ComputedRef<boolean>;

  append: (value: Value) => void;
  prepend: (value: Value) => void;
  swap: (indexA: number, indexB: number) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, value: Value) => void;

  onBlur: () => void;
  onChange: () => void;
}

const swapAt = (data: any[], indexA: number, indexB: number): void => {
  data[indexA] = [data[indexB], (data[indexB] = data[indexA])][0];
};

const removeAt = <T>(data: T[], index: number): T[] => {
  const clone = [...data];
  clone.splice(index, 1);
  return clone;
};

const moveAt = (data: any[], from: number, to: number) => {
  data.splice(to, 0, data.splice(from, 1)[0]);
};

const insertAt = <T>(data: T[], index: number, value: T): T[] => {
  return [...data.slice(0, index), value, ...data.slice(index)];
};

export function useFieldArray<Value>(
  name: string,
  options?: UseFieldArrayOptions<Value>,
): UseFieldArrayReturn<Value> {
  const { getFieldValue, getFieldProps, setFieldValue, registerFieldArray } =
    useFormContext();

  const fields: Ref<FieldEntry<Value>[]> = ref([]);
  const values = computed(() => getFieldValue<Value[]>(name).value);

  let seed = 0;
  const reset = () => {
    fields.value = values.value.map(createEntry);
  };

  const createEntry = (value: Value) => {
    const key = seed++;

    return {
      key,
      value: computed<Value>({
        get() {
          const index = fields.value.findIndex((field) => field.key === key);
          return index === -1 ? value : values.value[index];
        },
        set(value) {
          const index = fields.value.findIndex((field) => field.key === key);
          setFieldValue(`${name}.${index}`, value);
        },
      }),
    };
  };

  const append = (value: Value) => {
    setFieldValue(name, [...values.value, value]);
    fields.value.push(createEntry(value));
  };

  const prepend = (value: Value) => {
    setFieldValue(name, [value, ...values.value]);
    fields.value.unshift(createEntry(value));
  };

  const remove = (index: number) => {
    const cloneValues = removeAt(values.value, index);
    const cloneField = removeAt(fields.value, index);

    setFieldValue(name, cloneValues);
    fields.value = cloneField;
  };

  const swap = (indexA: number, indexB: number) => {
    const cloneValues = [...values.value];
    const cloneField = [...fields.value];

    swapAt(cloneValues, indexA, indexB);
    swapAt(cloneField, indexA, indexB);

    setFieldValue(name, cloneValues);
    fields.value = cloneField;
  };

  const move = (from: number, to: number) => {
    const cloneValues = [...values.value];
    const cloneField = [...fields.value];

    moveAt(cloneValues, from, to);
    moveAt(cloneField, from, to);

    setFieldValue(name, cloneValues);
    fields.value = cloneField;
  };

  const insert = (index: number, value: Value) => {
    const cloneValues = insertAt(values.value, index, value);
    const cloneField = insertAt(fields.value, index, createEntry(value));

    setFieldValue(name, cloneValues);
    fields.value = cloneField;
  };

  registerFieldArray(name, {
    ...options,
    reset,
  });

  reset();

  return {
    ...getFieldProps(name),
    fields,
    append,
    prepend,
    swap,
    remove,
    move,
    insert,
  };
}
