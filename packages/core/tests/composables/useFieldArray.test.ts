import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, ref } from 'vue';

import { useFieldArray, useForm } from '../../src';

const noop = () => {};

const setup = (setup: () => unknown) => {
  const Comp = defineComponent({
    setup,
    template: `<div />`,
  });

  return mount(Comp);
};

const useBasicTestFieldArray = (
  options: Omit<Parameters<typeof useForm>[0], 'onSubmit'>,
) => {
  useForm({
    ...options,
    onSubmit: noop,
  });

  const {
    fields,
    append,
    prepend,
    swap,
    remove,
    replace,
    move,
    insert,
    update,
  } = useFieldArray<number>('list');

  return {
    fields,
    append,
    prepend,
    swap,
    remove,
    replace,
    move,
    insert,
    update,
  };
};

describe('useFieldArray', () => {
  it('when not using it in the correct structure', () => {
    setup(() => {
      expect(() => useFieldArray('name')).toThrowError();
    });
  });

  it('when useFieldArray initialization fields', () => {
    setup(() => {
      const { fields } = useBasicTestFieldArray({
        initialValues: {
          list: [0, 1, 2],
        },
      });

      expect(fields.value[0].value).toEqual(0);
      expect(fields.value[0].dirty).toEqual(false);
      expect(fields.value[0].error).toEqual(undefined);
      expect(fields.value[0].touched).toEqual(false);
      expect(fields.value[0].name).toEqual('list.0');

      expect(fields.value[1].value).toEqual(1);
      expect(fields.value[1].dirty).toEqual(false);
      expect(fields.value[1].error).toEqual(undefined);
      expect(fields.value[1].touched).toEqual(false);
      expect(fields.value[1].name).toEqual('list.1');

      expect(fields.value[2].value).toEqual(2);
      expect(fields.value[2].dirty).toEqual(false);
      expect(fields.value[2].error).toEqual(undefined);
      expect(fields.value[2].touched).toEqual(false);
      expect(fields.value[2].name).toEqual('list.2');
    });
  });

  it('when invoke method that append()', () => {
    setup(() => {
      const { fields, append } = useBasicTestFieldArray({
        initialValues: {
          list: [0],
        },
        initialErrors: {
          list: ['error 0'],
        },
        initialTouched: {
          list: [true],
        },
      });

      append(1);
      expect(fields.value[1].value).toEqual(1);
      expect(fields.value[1].dirty).toEqual(true);
      expect(fields.value[1].error).toEqual(undefined);
      expect(fields.value[1].touched).toEqual(false);
      expect(fields.value[1].name).toEqual('list.1');

      expect(fields.value[0].value).toEqual(0);
      expect(fields.value[0].dirty).toEqual(false);
      expect(fields.value[0].error).toEqual('error 0');
      expect(fields.value[0].touched).toEqual(true);
      expect(fields.value[0].name).toEqual('list.0');
    });
  });

  it('when invoke method that prepend()', () => {
    setup(() => {
      const { fields, prepend } = useBasicTestFieldArray({
        initialValues: {
          list: [1],
        },
        initialErrors: {
          list: ['error 1'],
        },
        initialTouched: {
          list: [true],
        },
      });

      prepend(2);
      expect(fields.value[0].value).toEqual(2);
      expect(fields.value[0].dirty).toEqual(true);
      expect(fields.value[0].error).toEqual(undefined);
      expect(fields.value[0].touched).toEqual(false);
      expect(fields.value[0].name).toEqual('list.0');

      expect(fields.value[1].value).toEqual(1);
      expect(fields.value[1].dirty).toEqual(true);
      expect(fields.value[1].error).toEqual('error 1');
      expect(fields.value[1].touched).toEqual(true);
      expect(fields.value[1].name).toEqual('list.1');
    });
  });

  it('when invoke method that swap()', () => {
    setup(() => {
      const { fields, swap } = useBasicTestFieldArray({
        initialValues: {
          list: [1, 2],
        },
        initialErrors: {
          list: ['error 1', 'error 2'],
        },
        initialTouched: {
          list: [true, true],
        },
      });

      swap(0, 1);
      expect(fields.value[0].value).toEqual(2);
      expect(fields.value[0].dirty).toEqual(true);
      expect(fields.value[0].error).toEqual('error 2');
      expect(fields.value[0].touched).toEqual(true);
      expect(fields.value[0].name).toEqual('list.0');

      expect(fields.value[1].value).toEqual(1);
      expect(fields.value[1].dirty).toEqual(true);
      expect(fields.value[1].error).toEqual('error 1');
      expect(fields.value[1].touched).toEqual(true);
      expect(fields.value[1].name).toEqual('list.1');
    });
  });

  it('when invoke method that remove()', () => {
    setup(() => {
      const { fields, remove } = useBasicTestFieldArray({
        initialValues: {
          list: [1, 2, 3],
        },
        initialErrors: {
          list: ['error 1', 'error 2', 'error 3'],
        },
        initialTouched: {
          list: [true, true, true],
        },
      });

      remove(0);
      expect(fields.value[0].value).toEqual(2);
      expect(fields.value[0].dirty).toEqual(true);
      expect(fields.value[0].error).toEqual('error 2');
      expect(fields.value[0].touched).toEqual(true);
      expect(fields.value[0].name).toEqual('list.0');

      expect(fields.value.length).toEqual(2);

      remove();
      expect(fields.value.length).toEqual(0);
    });
  });

  it('when invoke method that move()', () => {
    setup(() => {
      const { fields, move } = useBasicTestFieldArray({
        initialValues: {
          list: [1, 2, 3],
        },
        initialErrors: {
          list: ['error 1', 'error 2', 'error 3'],
        },
        initialTouched: {
          list: [true, true, true],
        },
      });

      move(0, 2);
      expect(fields.value[0].value).toEqual(2);
      expect(fields.value[0].dirty).toEqual(true);
      expect(fields.value[0].error).toEqual('error 2');
      expect(fields.value[0].touched).toEqual(true);
      expect(fields.value[0].name).toEqual('list.0');

      expect(fields.value[1].value).toEqual(3);
      expect(fields.value[1].dirty).toEqual(true);
      expect(fields.value[1].error).toEqual('error 3');
      expect(fields.value[1].touched).toEqual(true);
      expect(fields.value[1].name).toEqual('list.1');

      expect(fields.value[2].value).toEqual(1);
      expect(fields.value[2].dirty).toEqual(true);
      expect(fields.value[2].error).toEqual('error 1');
      expect(fields.value[2].touched).toEqual(true);
      expect(fields.value[2].name).toEqual('list.2');
    });
  });

  it('when invoke method that insert()', () => {
    setup(() => {
      const { fields, insert } = useBasicTestFieldArray({
        initialValues: {
          list: [1, 3],
        },
        initialErrors: {
          list: ['error 1', 'error 3'],
        },
        initialTouched: {
          list: [true, true],
        },
      });

      insert(1, 2);

      expect(fields.value[0].value).toEqual(1);
      expect(fields.value[0].dirty).toEqual(false);
      expect(fields.value[0].error).toEqual('error 1');
      expect(fields.value[0].touched).toEqual(true);
      expect(fields.value[0].name).toEqual('list.0');

      expect(fields.value[1].value).toEqual(2);
      expect(fields.value[1].dirty).toEqual(true);
      expect(fields.value[1].error).toEqual(undefined);
      expect(fields.value[1].touched).toEqual(false);
      expect(fields.value[1].name).toEqual('list.1');

      expect(fields.value[2].value).toEqual(3);
      expect(fields.value[2].dirty).toEqual(true);
      expect(fields.value[2].error).toEqual('error 3');
      expect(fields.value[2].touched).toEqual(true);
      expect(fields.value[2].name).toEqual('list.2');
    });
  });

  it('when invoke method that update()', () => {
    setup(() => {
      const { fields, update } = useBasicTestFieldArray({
        initialValues: {
          list: [1, 3],
        },
        initialErrors: {
          list: ['error 1', 'error 3'],
        },
        initialTouched: {
          list: [true, true],
        },
      });

      update(1, 2);

      expect(fields.value[0].value).toEqual(1);
      expect(fields.value[0].dirty).toEqual(false);
      expect(fields.value[0].error).toEqual('error 1');
      expect(fields.value[0].touched).toEqual(true);
      expect(fields.value[0].name).toEqual('list.0');

      expect(fields.value[1].value).toEqual(2);
      expect(fields.value[1].dirty).toEqual(true);
      expect(fields.value[1].error).toEqual(undefined);
      expect(fields.value[1].touched).toEqual(false);
      expect(fields.value[1].name).toEqual('list.1');
    });
  });

  it('when invoke method that replace()', () => {
    setup(() => {
      const { fields, replace } = useBasicTestFieldArray({
        initialValues: {
          list: [1, 2],
        },
        initialErrors: {
          list: ['error 1', 'error 2'],
        },
        initialTouched: {
          list: [true, true],
        },
      });

      replace([3, 4]);

      expect(fields.value[0].value).toEqual(3);
      expect(fields.value[0].dirty).toEqual(true);
      expect(fields.value[0].error).toEqual('error 1');
      expect(fields.value[0].touched).toEqual(true);
      expect(fields.value[0].name).toEqual('list.0');

      expect(fields.value[1].value).toEqual(4);
      expect(fields.value[1].dirty).toEqual(true);
      expect(fields.value[1].error).toEqual('error 2');
      expect(fields.value[1].touched).toEqual(true);
      expect(fields.value[1].name).toEqual('list.1');
    });
  });

  it('when update the value of fields directly', () => {
    setup(() => {
      const { fields } = useBasicTestFieldArray({
        initialValues: {
          list: [1],
        },
      });

      expect(fields.value[0].value).toEqual(1);
      expect(fields.value[0].dirty).toEqual(false);

      fields.value[0].value = 2;

      expect(fields.value[0].value).toEqual(2);
      expect(fields.value[0].dirty).toEqual(true);
    });
  });

  it('when use ref for field name', () => {
    setup(() => {
      useForm({
        initialValues: {
          list1: [0, 1, 2],
          list2: [3, 4, 5],
        },
        initialErrors: {
          list1: ['error 0', 'error 1', 'error 2'],
          list2: ['error 3', 'error 4', 'error 5'],
        },
        initialTouched: {
          list1: [true, true, true],
          list2: [false, false, false],
        },
        onSubmit: noop,
      });

      const name = ref<'list1' | 'list2'>('list1');
      const { fields, prepend } = useFieldArray(name);

      expect(fields.value[0].value).toEqual(0);
      expect(fields.value[0].error).toEqual('error 0');
      expect(fields.value[0].touched).toEqual(true);

      name.value = 'list2';
      expect(fields.value[0].value).toEqual(3);
      expect(fields.value[0].error).toEqual('error 3');
      expect(fields.value[0].touched).toEqual(false);

      prepend(6);
      expect(fields.value[0].value).toEqual(6);

      name.value = 'list1';
      expect(fields.value[0].value).toEqual(0);
    });
  });

  it('when use getter for field name', () => {
    setup(() => {
      useForm({
        initialValues: {
          list1: [0, 1, 2],
          list2: [3, 4, 5],
        },
        initialErrors: {
          list1: ['error 0', 'error 1', 'error 2'],
          list2: ['error 3', 'error 4', 'error 5'],
        },
        initialTouched: {
          list1: [true, true, true],
          list2: [false, false, false],
        },
        onSubmit: noop,
      });

      const name = ref<'list1' | 'list2'>('list1');
      const { fields, prepend } = useFieldArray(() => name.value);

      expect(fields.value[0].value).toEqual(0);
      expect(fields.value[0].error).toEqual('error 0');
      expect(fields.value[0].touched).toEqual(true);

      name.value = 'list2';
      expect(fields.value[0].value).toEqual(3);
      expect(fields.value[0].error).toEqual('error 3');
      expect(fields.value[0].touched).toEqual(false);

      prepend(6);
      expect(fields.value[0].value).toEqual(6);

      name.value = 'list1';
      expect(fields.value[0].value).toEqual(0);
    });
  });
});
