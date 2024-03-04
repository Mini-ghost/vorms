import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref, Suspense } from 'vue';

import { useForm } from '../../src';

const noop = () => {};

const setup = (setup: () => unknown) => {
  const Comp = defineComponent({
    setup,
    template: `<div />`,
  });

  return mount(Comp);
};

const setupSuspense = async (setup: () => unknown) => {
  const Comp = defineComponent({
    setup,
    template: `<div />`,
  });

  const Root = defineComponent({
    render() {
      return h(Suspense, null, {
        default: h(Comp),
      });
    },
  });

  await flushPromises();
  return mount(Root);
};

const sleep = (ms?: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe('useForm', () => {
  it('when initialize form state', () => {
    setup(() => {
      const { values, errors, touched, dirty, submitCount } = useForm({
        initialValues: {
          name: 'Alex',
          age: 10,
        },
        onSubmit: noop,
      });

      expect(values).toEqual({ name: 'Alex', age: 10 });
      expect(errors.value).toEqual({});
      expect(touched.value).toEqual({});
      expect(dirty.value).toEqual(false);
      expect(submitCount.value).toEqual(0);
    });
  });

  it('when initialize form state with initialError', () => {
    setup(() => {
      const { errors } = useForm({
        initialValues: {
          name: '',
        },
        initialErrors: {
          name: 'This is required',
        },
        onSubmit: noop,
      });

      expect(errors.value).toEqual({ name: 'This is required' });
    });
  });

  it('when initialize form state with initialTouched', () => {
    setup(() => {
      const { touched } = useForm({
        initialValues: {
          name: '',
        },
        initialTouched: {
          name: true,
        },
        onSubmit: noop,
      });

      expect(touched.value).toEqual({ name: true });
    });
  });

  it('when invoke setValues', () => {
    setup(() => {
      const { values, dirty, setValues } = useForm({
        initialValues: {
          name: 'Alex',
        },
        onSubmit: noop,
      });

      setValues({
        name: 'Hunter',
      });

      expect(values.name).toEqual('Hunter');
      expect(dirty.value).toEqual(true);
    });
  });

  it('when invoke setValues with shouldValidate is true', () => {
    const validate = vi.fn();

    setup(() => {
      const { setValues } = useForm({
        initialValues: {
          name: '',
        },
        validate,
        onSubmit: noop,
      });

      setValues(
        {
          name: 'Hunter',
        },
        true,
      );
    });

    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('when invoke setFieldValue', () => {
    setup(() => {
      const { values, dirty, setFieldValue } = useForm({
        initialValues: {
          name: 'Alex',
        },
        onSubmit: noop,
      });

      setFieldValue('name', 'Hunter');

      expect(values.name).toEqual('Hunter');
      expect(dirty.value).toEqual(true);
    });
  });

  it('when invoke setFieldValue with shouldValidate is true', () => {
    const validate = vi.fn();

    setup(() => {
      const { setFieldValue } = useForm({
        initialValues: {
          name: '',
        },
        validate,
        onSubmit: noop,
      });

      setFieldValue('name', 'Hunter', true);
    });

    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('when invoke resetForm', () => {
    setup(() => {
      const { values, dirty, resetForm } = useForm({
        initialValues: {
          name: 'Alex',
        },
        onSubmit: noop,
      });

      values.name = 'Hunter';
      expect(values.name).toEqual('Hunter');

      resetForm();

      expect(values.name).toEqual('Alex');
      expect(dirty.value).toEqual(false);
    });
  });

  it('when invoke resetForm with new values', () => {
    setup(() => {
      const { values, dirty, resetForm } = useForm({
        initialValues: {
          name: 'Alex',
        },
        onSubmit: noop,
      });

      resetForm({
        values: {
          name: 'Hunter',
        },
      });

      expect(values.name).toEqual('Hunter');
      expect(dirty.value).toEqual(false);
    });
  });

  it('when validateMode is default', async () => {
    const validate = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { isValidating, handleSubmit } = useForm({
          initialValues: {},
          validate,
          onSubmit: noop,
        });

        return { isValidating, handleSubmit };
      },
      template: `
        <form @submit="handleSubmit">
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></app>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="submit"]').trigger('click');
    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('when validateMode is blur', async () => {
    const validate = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { register } = useForm({
          initialValues: {
            name: '',
          },
          validateMode: 'blur',
          validate,
          onSubmit: noop,
        });

        const { value, attrs } = register('name');

        return { value, attrs };
      },
      template: `
        <input v-model="value" v-bind="attrs">
      `,
    });

    const wrapper = mount(Comp);
    await wrapper.find('input').trigger('blur');
    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('when validateMode is change', async () => {
    const validate = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { register } = useForm({
          initialValues: {
            name: '',
          },
          validateMode: 'change',
          validate,
          onSubmit: noop,
        });

        const { value, attrs } = register('name');

        return { value, attrs };
      },
      template: `
        <input v-model="value" v-bind="attrs">
      `,
    });

    const wrapper = mount(Comp);
    await wrapper.find('input').trigger('change');
    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('when validateMode is input', async () => {
    const validate = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { register } = useForm({
          initialValues: {
            name: '',
          },
          validateMode: 'input',
          validate,
          onSubmit: noop,
        });

        const { value, attrs } = register('name');

        return { value, attrs };
      },
      template: `
        <input v-model="value" v-bind="attrs">
      `,
    });

    const wrapper = mount(Comp);
    await wrapper.find('input').trigger('input');
    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('when reValidateMode is default', async () => {
    const validate = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { register, handleSubmit } = useForm({
          initialValues: {
            name: '',
          },
          validate,
          onSubmit: noop,
        });

        const { value, attrs } = register('name');

        return { value, attrs, handleSubmit };
      },
      template: `
        <form @submit="handleSubmit">
          <input v-model="value" v-bind="attrs">
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="submit"]').trigger('click');
    await wrapper.find('input').trigger('change');
    expect(validate).toHaveBeenCalledTimes(2);
  });

  it('when reValidateMode is blur', async () => {
    const validate = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { register, handleSubmit } = useForm({
          initialValues: {
            name: '',
          },
          validate,
          reValidateMode: 'blur',
          onSubmit: noop,
        });

        const { value, attrs } = register('name');

        return { value, attrs, handleSubmit };
      },
      template: `
        <form @submit="handleSubmit">
          <input v-model="value" v-bind="attrs">
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="submit"]').trigger('click');
    await wrapper.find('input').trigger('blur');
    expect(validate).toHaveBeenCalledTimes(2);
  });

  it('when reValidateMode is input', async () => {
    const validate = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { register, handleSubmit } = useForm({
          initialValues: {
            name: '',
          },
          validate,
          reValidateMode: 'input',
          onSubmit: noop,
        });

        const { value, attrs } = register('name');

        return { value, attrs, handleSubmit };
      },
      template: `
        <form @submit="handleSubmit">
          <input v-model="value" v-bind="attrs">
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="submit"]').trigger('click');
    await wrapper.find('input').trigger('input');
    expect(validate).toHaveBeenCalledTimes(2);
  });

  it('when reValidateMode is submit', async () => {
    const validate = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { register, handleSubmit } = useForm({
          initialValues: {
            name: '',
          },
          validate,
          reValidateMode: 'submit',
          onSubmit: noop,
        });

        const { value, attrs } = register('name');

        return { value, attrs, handleSubmit };
      },
      template: `
        <form @submit="handleSubmit">
          <input v-model="value" v-bind="attrs">
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="submit"]').trigger('click');
    await wrapper.find('button[type="submit"]').trigger('click');
    expect(validate).toHaveBeenCalledTimes(2);
  });

  it('when validateOnMounted is true', async () => {
    const validate = vi.fn();
    const Comp = defineComponent({
      setup() {
        useForm({
          initialValues: {},
          validate,
          validateOnMounted: true,
          onSubmit: noop,
        });
      },
      template: `<div></div>`,
    });

    mount(Comp);
    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('when validate is a synchronize function and success', async () => {
    const Comp = defineComponent({
      setup() {
        const { errors, isValidating, validateForm } = useForm({
          initialValues: {
            name: '',
          },
          validate: () => {
            return {};
          },
          onSubmit: noop,
        });

        return {
          errors,
          isValidating,
          validateForm,
        };
      },
      template: `
        <span>{{ isValidating }}</span>
        <span>{{ errors.name }}</span>
        <button type="button" @click="() => validateForm()" />
      `,
    });

    const wrapper = mount(Comp);

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('span').text()).toBe('true');

    await sleep();
    expect(wrapper.find('span').text()).toBe('false');
  });

  it('when validate is a synchronize function and failure', async () => {
    const ERROR_MESSAGE = 'name is request';
    const Comp = defineComponent({
      setup() {
        const { errors, isValidating, validateForm } = useForm({
          initialValues: {
            name: '',
          },
          validate: () => {
            return {
              name: ERROR_MESSAGE,
            };
          },
          onSubmit: noop,
        });

        return {
          errors,
          isValidating,
          validateForm,
        };
      },
      template: `
        <span>{{ isValidating }}</span>
        <span>{{ errors.name }}</span>
        <button type="button" @click="() => validateForm()" />
      `,
    });

    const wrapper = mount(Comp);
    wrapper.find('button').trigger('click');

    await nextTick();
    expect(wrapper.findAll('span')[0].text()).toBe('true');

    await sleep();
    expect(wrapper.findAll('span')[0].text()).toBe('false');
    expect(wrapper.findAll('span')[1].text()).toBe(ERROR_MESSAGE);
  });

  it('when validate is an asynchronous function and success', async () => {
    const Comp = defineComponent({
      setup() {
        const { isValidating, validateForm } = useForm({
          initialValues: {
            name: '',
          },
          validate: async () => {
            await sleep();
            return {};
          },
          onSubmit: noop,
        });

        return { isValidating, validateForm };
      },

      template: `
        <span>{{ isValidating }}</span>
        <button type="button" @click="() => validateForm()" />
      `,
    });

    const wrapper = mount(Comp);
    await wrapper.find('button').trigger('click');

    expect(wrapper.find('span').text()).toBe('true');

    await sleep();
    expect(wrapper.find('span').text()).toBe('false');
  });

  it('when validate is an asynchronous function and failure', async () => {
    const ERROR_MESSAGE = 'name is request';
    const Comp = defineComponent({
      setup() {
        const { errors, isValidating, validateForm } = useForm({
          initialValues: {
            name: '',
          },
          async validate() {
            await sleep();
            return {
              name: ERROR_MESSAGE,
            };
          },
          onSubmit: noop,
        });

        return {
          errors,
          isValidating,
          validateForm,
        };
      },
      template: `
        <span>{{ isValidating }}</span>
        <span>{{ errors.name }}</span>
        <button type="button" @click="() => validateForm()" />
      `,
    });

    const wrapper = mount(Comp);
    await wrapper.find('button').trigger('click');

    expect(wrapper.findAll('span')[0].text()).toBe('true');

    await sleep();
    expect(wrapper.findAll('span')[0].text()).toBe('false');
    expect(wrapper.findAll('span')[1].text()).toBe(ERROR_MESSAGE);
  });

  it('when invoke register to initialize field value and state', () => {
    setup(() => {
      const { register } = useForm({
        initialValues: {
          name: 'Alex',
        },
        onSubmit: noop,
      });

      const nameField = register('name');
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

  it('when invoke register and set validate', async () => {
    const ERROR_MESSAGE = 'Name is required';
    const Comp = defineComponent({
      setup() {
        const { errors, register, validateField } = useForm({
          initialValues: {
            name: '',
          },
          onSubmit: noop,
        });

        const { value, error } = register('name', {
          validate(value) {
            if (!value) return ERROR_MESSAGE;
            return;
          },
        });

        return {
          error,
          errors,
          value,
          validateField,
        };
      },
      template: `
        <input v-model="value" />
        <span>{{ error }}</span>
        <span>{{ errors.name }}</span>
        <button type="button" @click="() => validateField('name')" />
      `,
    });

    const wrapper = mount(Comp);

    await wrapper.find('button').trigger('click');
    await sleep();

    expect(wrapper.findAll('span')[0].text()).toBe(ERROR_MESSAGE);
    expect(wrapper.findAll('span')[1].text()).toBe(ERROR_MESSAGE);

    await wrapper.find('input').setValue('Alex');
    await wrapper.find('button').trigger('click');
    await sleep();

    expect(wrapper.findAll('span')[0].text()).toBe('');
    expect(wrapper.findAll('span')[1].text()).toBe('');
  });

  it('when invoke register and set asynchronous validate', async () => {
    const ERROR_MESSAGE = 'Name is required';
    const Comp = defineComponent({
      setup() {
        const { errors, register, validateField } = useForm({
          initialValues: {
            name: '',
          },
          onSubmit: noop,
        });

        const { value, error } = register('name', {
          async validate(value) {
            await sleep();
            if (!value) return ERROR_MESSAGE;
            return;
          },
        });

        return {
          error,
          errors,
          value,
          validateField,
        };
      },
      template: `
        <input v-model="value" />
        <span>{{ error }}</span>
        <span>{{ errors.name }}</span>
        <button type="button" @click="() => validateField('name')" />
      `,
    });

    const wrapper = mount(Comp);

    await wrapper.find('button').trigger('click');
    await sleep();

    expect(wrapper.findAll('span')[0].text()).toBe(ERROR_MESSAGE);
    expect(wrapper.findAll('span')[1].text()).toBe(ERROR_MESSAGE);

    await wrapper.find('input').setValue('Alex');
    await wrapper.find('button').trigger('click');
    await sleep();

    expect(wrapper.findAll('span')[0].text()).toBe('');
    expect(wrapper.findAll('span')[1].text()).toBe('');
  });

  it('when use ref for register name', () => {
    setup(() => {
      const { register } = useForm({
        initialValues: {
          name: 'Alex',
          city: 'Taichung',
        },
        onSubmit: noop,
      });

      const name = ref<'name' | 'city'>('name');
      const { value, attrs } = register(name);

      expect(value.value).toEqual('Alex');
      expect(attrs.value.name).toEqual('name');

      name.value = 'city';

      expect(value.value).toEqual('Taichung');
      expect(attrs.value.name).toEqual('city');
    });
  });

  it('when use getter for register name', () => {
    setup(() => {
      const { register } = useForm({
        initialValues: {
          name: 'Alex',
          city: 'Taichung',
        },
        onSubmit: noop,
      });

      const name = ref<'name' | 'city'>('name');
      const { value, attrs } = register(() => name.value);

      expect(value.value).toEqual('Alex');
      expect(attrs.value.name).toEqual('name');

      name.value = 'city';

      expect(value.value).toEqual('Taichung');
      expect(attrs.value.name).toEqual('city');
    });
  });

  it('when onSubmit with validation error', async () => {
    const onSubmit = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { handleSubmit } = useForm({
          initialValues: {
            name: '',
          },
          validate() {
            return {
              name: 'name is required',
            };
          },
          onSubmit,
        });

        return {
          handleSubmit,
        };
      },

      template: `
        <form @submit="handleSubmit">
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="submit"]').trigger('click');
    await sleep();

    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it('when onSubmit is a synchronize function', async () => {
    const onSubmit = vi.fn();
    const Comp = defineComponent({
      setup() {
        const { submitCount, isSubmitting, handleSubmit } = useForm({
          initialValues: {},
          onSubmit,
        });

        return {
          submitCount,
          isSubmitting,
          handleSubmit,
        };
      },
      template: `
        <form @submit="handleSubmit">
          <span>{{ submitCount }}</span>
          <span>{{ isSubmitting }}</span>
          <button type="submit">Submit</button>
        </form>
      `,
    });

    // Native form submission
    // @see https://test-utils.vuejs.org/guide/essentials/forms.html#triggering-complex-event-listeners
    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button').trigger('click');

    expect(wrapper.findAll('span')[0].text()).toBe('1');
    expect(wrapper.findAll('span')[1].text()).toBe('true');

    await sleep();
    expect(wrapper.findAll('span')[0].text()).toBe('1');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('when onSubmit is a synchronize function and cell setSubmitting', async () => {
    const Comp = defineComponent({
      setup() {
        const { isSubmitting, handleSubmit } = useForm({
          initialValues: {},
          onSubmit(_, { setSubmitting }) {
            setSubmitting(false);
          },
        });

        return {
          isSubmitting,
          handleSubmit,
        };
      },

      template: `
        <form @submit="handleSubmit">
          <span>{{ isSubmitting }}</span>
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    expect(wrapper.find('span').text()).toBe('false');

    await wrapper.find('button[type="submit"]').trigger('click');

    expect(wrapper.find('span').text()).toBe('true');

    await sleep();

    expect(wrapper.find('span').text()).toBe('false');
  });

  it('when onSubmit is a asynchronous function and success', async () => {
    const Comp = defineComponent({
      setup() {
        const { submitCount, isSubmitting, handleSubmit } = useForm({
          initialValues: {},
          onSubmit() {
            return Promise.resolve();
          },
        });

        return {
          submitCount,
          isSubmitting,
          handleSubmit,
        };
      },

      template: `
        <form @submit="handleSubmit">
          <span>{{ isSubmitting }}</span>
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    expect(wrapper.find('span').text()).toBe('false');

    await wrapper.find('button[type="submit"]').trigger('click');

    expect(wrapper.find('span').text()).toBe('true');

    await sleep();

    expect(wrapper.find('span').text()).toBe('false');
  });

  it('when onSubmit is a asynchronous function and failure', async () => {
    const Comp = defineComponent({
      setup() {
        const { submitCount, isSubmitting, handleSubmit } = useForm({
          initialValues: {},
          onSubmit() {
            return Promise.reject();
          },
        });

        return {
          submitCount,
          isSubmitting,
          handleSubmit,
        };
      },

      template: `
        <form @submit="handleSubmit">
          <span id="is-submitting">{{ isSubmitting }}</span>
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="submit"]').trigger('click');

    expect(wrapper.find('span#is-submitting').text()).toBe('true');

    await sleep();

    expect(wrapper.find('span').text()).toBe('false');
  });

  it('when onInvalid with validation pass', async () => {
    const onInvalid = vi.fn();

    const Comp = defineComponent({
      setup() {
        const { handleSubmit } = useForm({
          initialValues: {
            name: '',
          },
          validate() {
            return undefined;
          },
          onSubmit: noop,
          onInvalid,
        });

        return {
          handleSubmit,
        };
      },

      template: `
        <form @submit="handleSubmit">
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="submit"]').trigger('click');
    await sleep();

    expect(onInvalid).toHaveBeenCalledTimes(0);
  });

  it('when onInvalid with validation error', async () => {
    const onInvalid = vi.fn();
    const errors = {
      name: 'name is required',
    };

    const Comp = defineComponent({
      setup() {
        const { handleSubmit } = useForm({
          initialValues: {
            name: '',
          },
          validate() {
            return errors;
          },
          onSubmit: noop,
          onInvalid,
        });

        return {
          handleSubmit,
        };
      },

      template: `
        <form @submit="handleSubmit">
          <button type="submit">Submit</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="submit"]').trigger('click');
    await sleep();

    expect(onInvalid).toHaveBeenCalledTimes(1);
    expect(onInvalid).toHaveBeenCalledWith(errors);
  });

  it('when invoke handleReset', async () => {
    const Comp = defineComponent({
      setup() {
        const { values, handleReset } = useForm({
          initialValues: {
            name: '',
          },
          onSubmit: noop,
        });

        values.name = 'Alex';

        return {
          values,
          handleReset,
        };
      },
      template: `
        <form @reset="handleReset">
          <span id="values">{{values.name}}</span>
          <button type="reset">Reset</button>
        </form>
      `,
    });

    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button[type="reset"]').trigger('click');
    expect(wrapper.find('span#values').text()).toEqual('');
  });

  it('Get the initial values parameter in the callback of the onSubmit function', async () => {
    const Comp = defineComponent({
      setup() {
        const defaultValues = {
          name: 'Alex',
          age: 10,
          habit: ['basketball', 'football'],
          family: [
            {
              name: 'Tom',
              age: 12,
              habit: ['TV', 'PhotoGraphy'],
            },
          ],
        };

        const { handleSubmit } = useForm({
          initialValues: defaultValues,
          onSubmit(_, { initialValues }) {
            expect(initialValues).toEqual(defaultValues);
          },
        });

        return {
          handleSubmit,
        };
      },
      template: `
        <form @submit="handleSubmit">
          <button type="submit">Submit</button>
        </form>
      `,
    });
    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button').trigger('click');
  });

  it('Get the initial values parameter in the callback of the onSubmit function after resetFrom execute', async () => {
    const Comp = defineComponent({
      setup() {
        const defaultValues = {
          name: 'Alex',
          age: 10,
        };

        const resetValues = {
          name: 'Alex',
          age: 10,
          habit: ['basketball', 'football'],
          family: [
            {
              name: 'Tom',
              age: 12,
              habit: ['TV', 'PhotoGraphy'],
            },
          ],
        };

        const { handleSubmit, resetForm } = useForm({
          initialValues: defaultValues,
          onSubmit(_, { initialValues }) {
            expect(initialValues).toEqual(resetValues);
          },
        });

        resetForm({ values: resetValues });

        return {
          handleSubmit,
        };
      },
      template: `
        <form @submit="handleSubmit">
          <button type="submit">Submit</button>
        </form>
      `,
    });
    document.body.innerHTML = `<div id="app"></div>`;
    const wrapper = mount(Comp, {
      attachTo: '#app',
    });

    await wrapper.find('button').trigger('click');
  });

  it('when errors changes via setErrors', () => {
    setup(() => {
      const { errors, setErrors, handleSubmit } = useForm({
        initialValues: {
          name: '',
        },
        onSubmit: noop,
      });

      expect(errors.value).toEqual({});

      setErrors({ name: 'name is required' });
      expect(errors.value).toEqual({
        name: 'name is required',
      });

      handleSubmit();
    });
  });

  it('when errors changes via setErrors', () => {
    setup(() => {
      const { errors, setFieldError } = useForm({
        initialValues: {
          name: '',
        },
        onSubmit: noop,
      });

      expect(errors.value).toEqual({});

      setFieldError('name', 'name is required');
      expect(errors.value).toEqual({
        name: 'name is required',
      });
    });
  });

  it('Should return an error if the validateField function fails', async () => {
    await setupSuspense(async () => {
      const ERROR_MESSAGE = 'name is required';
      const { register, validateField } = useForm({
        initialValues: {
          name: '',
        },
        onSubmit: noop,
      });

      register('name', {
        validate() {
          return ERROR_MESSAGE;
        },
      });

      const error = await validateField('name');

      expect(error).toEqual(ERROR_MESSAGE);
    });
  });
});
