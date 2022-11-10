import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

import { useForm, useField } from '../../src';

const noop = () => {};

const setup = (setup: () => unknown) => {
  const Comp = defineComponent({
    setup,
    template: `<div />`,
  });

  return mount(Comp);
};

describe('useField', () => {
  it('when not using it in the correct structure', () => {
    setup(() => {
      expect(() => useField('name')).toThrowError();
    });
  });

  it('when useField initialize field value and state', () => {
    setup(() => {
      useForm({
        initialValues: {
          name: 'Alex',
        },
        onSubmit: noop,
      });

      const nameField = useField('name');
      expect(nameField.value.value).toEqual('Alex');
      expect(nameField.dirty.value).toEqual(false);
      expect(nameField.error.value).toEqual(undefined);
      expect(nameField.touched.value).toEqual(false);
      expect(nameField.attrs.value.name).toEqual('name');

      nameField.value.value = 'Hunter';
      expect(nameField.value.value).toEqual('Hunter');
      expect(nameField.dirty.value).toEqual(true);

      const mockEvent = {
        target: {
          name: 'name',
          id: 'name',
        },
      } as unknown as Event;

      nameField.attrs.value.onBlur(mockEvent);
      expect(nameField.touched.value).toEqual(true);
    });
  });
});
