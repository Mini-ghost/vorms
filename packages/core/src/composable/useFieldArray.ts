import { ref, computed, Ref } from 'vue';
import { useFormContext } from './useFormContext';

interface FieldEntry<Values extends any[]> {
  key: any;
  value: Values[number];
}

type FieldValidator<Value> = (
  value: Value,
) => string | void | Promise<string | void>;

type UseFieldArrayOptions<Value> = {
  validate?: FieldValidator<Value>;
};

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

export function useFieldArray<Values extends Array<any> = any[]>(
  name: string,
  options?: UseFieldArrayOptions<Values>,
) {
  const { getFieldValue, getFieldProps, setFieldValue, registerFieldArray } =
    useFormContext();

  const fields: Ref<FieldEntry<Values>[]> = ref([]);
  const values = computed(() => getFieldValue<Values>(name).value);

  let seed = 0;
  const reset = () => {
    fields.value = values.value.map(createEntry);
  };

  const createEntry = (value: Values[number]) => {
    const key = seed++;

    return {
      key,
      value: computed({
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

  const append = (value: Values[number]) => {
    setFieldValue(name, [...values.value, value]);
    fields.value.push(createEntry(value));
  };

  const prepend = (value: Values[number]) => {
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

  const insert = (index: number, value: Values[number]) => {
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
