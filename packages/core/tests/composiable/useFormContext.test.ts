import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, inject, provide } from 'vue';

import { useForm, useFormContext } from '../../src';

const setup = (setup: () => unknown) => {
  const Comp = defineComponent({
    setup,
    template: `<div />`,
  });

  const Root = defineComponent({
    components: {
      Comp,
    },
    setup() {
      const context = useForm({
        initialValues: {},
        onSubmit() {},
      });

      provide('context', context);
    },
    template: `<div><Comp /></div>`,
  });

  return mount(Root);
};

describe('useFormContext', () => {
  it('when useFormContext basic usage', () => {
    setup(() => {
      const context = useFormContext();
      const original = inject('context');

      expect(context).toEqual(original);
    });
  });
});
