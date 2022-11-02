## Install

```bash
npm install @vorms/core@beta
```

## Feature

- Type Strong (Written in TypeScript, with TSDoc)
- [Small Size](https://bundlephobia.com/package/@vorms/core@0.0.1-beta.10) (~11kb, gzip: ~4kb)
- Pure Composition API
- Support [Yup](https://github.com/jquense/yup), [Zod](https://github.com/colinhacks/zod) and custom build

## Examples

- [Login](https://stackblitz.com/edit/vorms-login?file=src%2FApp.vue)
- [Field Array](https://stackblitz.com/edit/vorms-field-array?file=src%2FApp.vue)
- [Cross Field Validate](https://stackblitz.com/edit/vorms-corss-field-validate?file=src%2FApp.vue)
- [Wizard Form](https://stackblitz.com/edit/vorms-wizard-form?file=src%2FApp.vue)
- [Custom Components](https://stackblitz.com/edit/vorms-custom-components?file=src%2FApp.vue)
- [UI Library - Vuetify](https://stackblitz.com/edit/vorms-vuetify?file=src%2FApp.vue)
- [UI Library - Element Plus](https://stackblitz.com/edit/vorms-with-element-plus?file=src%2FApp.vue)
- [Validate With Yup](https://stackblitz.com/edit/vorms-validate-with-yup?file=src%2FApp.vue)
- [Validate With Zod](https://stackblitz.com/edit/vorms-validate-with-zod?file=src%2FApp.vue)

## API

### useForm

`useForm()` is a custom Vue composition api that will return all Vorms state and helpers directly.

**Options**

| Name              | Type                                                                 | Required | Description                                                                                                                |
| ----------------- | -------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| initialValues     | `Values`                                                             | ✓        | This is the form initial value, is required.                                                                               |
| initialErrors     | `FormErrors<Values>`                                                 |          | This is the form initial error.                                                                                            |
| initialTouched    | `FormTouched<Values>`                                                |          | This is the form initial touched.                                                                                          |
| validate          | `(values: Values) => void \| object \| Promise<FormErrors<Values>>`  |          | This function allows you to write your logic to validate your form, this is optional.                                      |
| validateMode      | `ValidateMode` = 'submit'                                            |          | This option allows you to configure the validation strategy **before** first submit.                                       |
| reValidateMode    | `ValidateMode` = 'change'                                            |          | This option allows you to configure the validation strategy **after** first submit.                                        |
| validateOnMounted | `boolean` = `false`                                                  |          | This option allows you to configure the validation run when the component is mounted.                                      |
| onSubmit          | `(values: Values, helper: FormSubmitHelper) => void \| Promise<any>` | ✓        | This is your form submission handler. It is passed your forms `values`. If has validation error, this will not be invoked. |
| onError           | `(errors: FormErrors<Values>) => void`                               |          | This is error callback, this be called when you submit form but validation error. This is optional.

<br>

```ts
type Values = Record<string, any>
type ValidateMode = 'blur' | 'input' | 'change' | 'submit'
```

**Return**

| Name          | Type                                                                                             | Description                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| values        | `Values`                                                                                         | Current form values.                                                                                                                       |
| errors        | `ComputedRef<FormErrors<Values>>`                                                                | Map of field name to the field has been touched                                                                                            |
| touched       | `ComputedRef<FormTouched<Values>>`                                                               | Map of field name to specific error for that field                                                                                         |
| dirty         | `ComputedRef<boolean>`                                                                           | Return `true` if current values are not deeply equal `initialValues`.                                                                      |
| setValues     | `(values: Values, shouldValidate?: boolean)`                                                     | This function allows you to dynamically update form values.                                                                                |
| setFieldValue | `(name: string, value: unknown, shouldValidate?: boolean)`                                       | This function allows you to dynamically set the value of field.                                                                            |
| submitCount   | `ComputedRef<number>`                                                                            | The number of times user attempted to submit.                                                                                              |
| isSubmitting  | `Ref<boolean>`                                                                                   | Return `true` when form is submitting, If `onSubmit()` is a synchronous function, then you need to call setSubmitting(false) on your own.  |
| isValidating  | `ComputedRef<boolean>`                                                                           | Return `true` when running validation.                                                                                                     |
| register      | `(name: string \| Ref<string>, options?: FieldRegisterOptions<Values>) => UseFormRegisterReturn` | This method allows you to get specific field values, meta (state) and attributes, you can also add validation for that field.              |
| handleSubmit  | `(event?: Event) => void`                                                                        | Submit handler.                                                                                                                            |
| handleReset   | `(event?: Event) => void`                                                                        | Reset handler.                                                                                                                             |
| validateForm  | `(values?: Values) => Promise<FormErrors<Values>>`                                               | Validate form values.                                                                                                                      |
| validateField | `(name: string) => Promise<void>`                                                                | Validate form specific field, if this field validation is register.                                                                        |

<br>

```ts
interface FieldRegisterOptions<Values> {
  validate?: FieldValidator<Values>;
}

type FieldValidator<Value> = (
  value: Value,
) => string | void | Promise<string | void>

type UseFormRegisterReturn<Value> =  {
  value: WritableComputedRef<Value>;
  dirty: ComputedRef<boolean>;
  error: ComputedRef<string>;
  touched: ComputedRef<boolean>;
  attrs: {
    name: string
    onBlur: () => void;
    onChange: () => void;
  };
}

```

**Example**

```vue
<script setup lang="ts">
import { useForm } from '@vorms/core'

interface InitialValues {
  drink: string,
  sugar: number
  ice: string
  bag: boolean
}

const { errors, dirty, register, handleSubmit, handleReset } = useForm<InitialValues>({
  initialValues: {
    drink: '',
    sugar: 30,
    ice: 'light',
    bag: false
  },
  validate (values) {
    const errors: Record<string, any> = {}

    if (!values.drink) {
      errors.drink = 'This is required!!'
    }

    return errors
  },

  validateMode: 'submit',
  reValidateMode: 'change',
  validateOnMounted: false,

  onSubmit(data, { setSubmitting }) {
    console.log(data)

    // If `onSubmit()` function is synchronous, you need to call `setSubmitting(false)` yourself.
    setSubmitting(false)
  }
})

// Basic usage
// The `attrs` need to be bind on <input> to support `validateMode` and `reValidateMode`
const { value: drink, attrs: drinkFieldAttrs } = register('drink')

// Add validation for field
const { value: sugar, attrs: sugarFieldAttrs } = register('sugar', {
  validate(value) {
    let error: string | undefined

    if(value > 100) {
      error = 'This max number is 100'
    }

    return error
  }
})

const { value: ice, attrs: iceFieldAttrs } = register('ice')
const { value: bag, attrs: bagFieldAttrs } = register('bag')

</script>

<template>
  <form @submit="handleSubmit" @reset="handleReset">
    <div>
      Is current values not equal `initialValues`: {{ dirty }}
    </div>

    <div>
      <label>Drink</label>
      <input v-model="drink" type="text" v-bind="drinkFieldAttrs">
      <div v-if="errors.drink">
        {{ errors.drink }}
      </div>
    </div>
    
    <div>
      <label>Sugar level</label>
      <input v-model="sugar" type="number" v-bind="sugarFieldAttrs">
      <div v-if="errors.sugar">
        {{ errors.sugar }}
      </div>
    </div>

    <div>
      <label>Ice level</label>
      <input v-model="ice" type="text" v-bind="iceFieldAttrs">
      <div v-if="errors.ice">
        {{ errors.ice }}
      </div>
    </div>

    <div>
      <label>Need a bag</label>
      <input v-model="bag" type="checkbox" v-bind="bagFieldAttrs">
      <div v-if="errors.bag">
        {{ errors.bag }}
      </div>
    </div>

    <button type="reset">
      Reset
    </button>
    <button type="submit">
      Submit
    </button>
  </form>
</template>
```

### useField

`useForm()` is a custom Vue composition api that will return specific field value, meta (state) and attributes, you can also add validation for that field.

`useField()` API is equal to `register()` that return by `useForm()`.

**Options**

| Name             | Type                                                          | Required | Description                                                                            |
| ---------------- | ------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| name             | `string \| Ref<string>`                                       | ✓        | Name of the field.                                                                     |
| options.validate | `(value: Value) => void \| string \| Promise<string \| void>` |          | This function allows you to write your logic to validate your field, this is optional. |

**Return**

| Name           | Type                                | Description                                                          |
| -------------- | ----------------------------------- | -------------------------------------------------------------------- |
| value          | `WritableComputedRef<Value>`        | Current field value.                                                 |
| errors         | `ComputedRef<string \| undefined>`  | Field error message.                                                 |
| touched        | `ComputedRef<boolean \| undefined>` | Return `true` after input first blur.                                |
| dirty          | `ComputedRef<boolean>`              | Return `true` if current field value are not equal initial value.    |
| attrs.name     | `string`                            | Input's name that we pass by.                                        |
| attrs.onBlur   | `(event: Event) => void`            | onBlur prop to subscribe the input blur event.                       |
| attrs.onChange | `() => void`                        | onChange prop to subscribe the input change event.                   |

**Example**

```vue
<script setup lang="ts">
import { useField } from '@vorms/core'

const { value, attrs } = useField<string>('ice', {
  validate(value) {
    let error: string | undefined

    if(!value.length) {
      error = 'This is required!!'
    }

    return error
  }
})
</script>

<template>
  <div>
    <input v-model="value" type="text" v-bind="attrs" >
  </div>
</template>
```

### useFieldArray

`useFieldArray()` is a custom Vue composition api that will return specific fields values, meta (state), attributes and provides common operation helpers, you can also add validation for those fields.

**Options**

| Name             | Type                                                                                  | Required | Description                                                                            |
| ---------------- | ------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| name             | `string \| Ref<string>`                                                               | ✓        | Name of the field array.                                                               |
| options.validate | `(value: Value) => void \| FormErrors<Values> \| Promise<FormErrors<Values> \| void>` |          | This function allows you to write your logic to validate your field, this is optional. |

**Return**

| Name    | Type                                       | Description                                                                  |
| ------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| fields  | `Ref<FieldEntry<Value>[]>`                 | This array contains every entry of field's key, value, meta and attrs.       |
| append  | `(value: Value) => void`                   | Append an item to the field array.                                           |
| prepend | `(value: Value) => void`                   | Prepend an item to the field array.                                          |
| swap    | `(indexA: number, indexB: number) => void` | Swap items position.                                                         |
| remove  | `(index?: number) => void`                 | Remove item at the specified position, or remove all when no index provided. |
| move    | `(from: number, to: number) => void`       | Move item to another position.                                               |
| insert  | `(index: number, value: Value) => void`    | Insert item at the specified position.                                       |
| update  | `(index: number, value: Value) => void`    | Update int at the specified position                                         |
| replace | `(values: Value[]) => void`                | Replace the entire field array values.                                       |

<br>

```ts
interface FieldEntry {
  key: number;
  value: Value;
  name: string;
  error: FormErrors<Value>;
  touched: Value extends Primitive ? boolean : FormTouched<Value> | undefined;
  dirty: boolean;
  attrs: {
    onBlur: (event: Event) => void;
    onChange: () => void;
  };
}
```

**Example**

```vue
<script setup lang="ts">
import { useForm, useFieldArray } from '@vorms/core'

const { handleSubmit } = useForm({
  initialValues: {
    foods: ['Bubble Tea', 'Stinky Tofu', 'Scallion Pancake']
  },
  onSubmit(data) {
    console.log(data)
  }
})

const { fields, append } = useFieldArray<string>('foods')

const onAppend = () => {
  append('Taiwanese Fried Chicken')
}
</script>

<template>
  <form @submit="handleSubmit">
    <div :key="field.key" v-for="field in fields">
      <input v-model="field.value" type="text" :name="field.name" v-bind="field.attrs">
    </div>
    <button type="button" @click="onAppend">
      Append
    </button>
    <button type="submit">
      Order
    </button>
    <input type="submit" />
  </form>
</template>
```

### useFormContext

`useFormContext()` is a custom Vue composition api that allow you access the form context. This is useful with deeply nested component structures

**Example**

```vue
<script setup lang="ts">
import { useForm } from '@vorms/core'
import NestedTextField from './components/NestedTextField.vue'

const { handleSubmit } = useForm({
  initialValues: {
    drink: '',
  }
})
</script>

<template>
  <form @submit="handleSubmit">
    <NestedTextField />
    <button type="submit">
      Submit
    <button>
  </form>
</template>
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useField, useFormContext } from '@vorms/core'

const { validateField } = useFormContext()

// You can also use `register` return from `useFormContext()`
const { value, attrs, error } = useField('drink', {
  validate(value) {
    // Check stock
  }
})

const isValidating = ref(false)

const onCheckStock = async () => {
  isValidating.value = true
  await validateField('drink')
  isValidating.value = false
}
</script>

<template>
  <div>
    <label>Drink</label>
    <input v-model="value" type="text" :readonly="isValidating" v-bind="attrs">
    <button type="button" @click="onCheckStock" :disabled="isValidating">
      Check stock
    </button>
    <div v-if="error">
      {{ error }}
    </div>
  </div>
</template>
```

## Credits

API inspired by [Formik](https://github.com/jaredpalmer/formik), [React Hook Form](https://github.com/react-hook-form/react-hook-form), [VeeValidate](https://github.com/logaretm/vee-validate)

## License

[MIT License](https://github.com/Mini-ghost/vorms/blob/main/LICENSE) © 2022-PRESENT [Alex Liu](https://github.com/Mini-ghost)
