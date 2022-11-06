# useForm

`useForm()` is a custom Vue composition api that makes form value and state management easiest.

## Usage

The following code excerpt demonstrates a basic usage example:

```vue
<script setup lang="ts">
import { useForm } from '@vorms/core'

const { errors, dirty, register, handleSubmit, handleReset } = useForm({
  initialValues: {
    drink: '',
    sugar: 30,
  },
  validate (values) {
    const errors: Record<string, any> = {}

    if (!values.drink) {
      errors.drink = 'This is required!!'
    }

    return errors
  },

  onSubmit(data, { setSubmitting }) {
    // If `onSubmit()` function is synchronous, you need to call 
    // `setSubmitting(false)` yourself.
    setSubmitting(false)
  }
})

// Basic usage
// The `attrs` need to be bind on <input> to support `validateMode`
// and `reValidateMode`.
const { value: drink, attrs: drinkFieldAttrs } = register('drink')

// Add field level validation.
const { value: sugar, attrs: sugarFieldAttrs } = register('sugar', {
  validate(value) {
    return value > 100 ? 'This max number is 100' : undefined
  }
})
</script>

<template>
  <form @submit="handleSubmit" @reset="handleReset">
    <div>
      <input v-model="drink" type="text" v-bind="drinkFieldAttrs">
      <div>{{ errors.drink }}</div>
    </div>
    
    <div>
      <input v-model.number="sugar" type="number" v-bind="sugarFieldAttrs">
      <div>{{ errors.sugar }}</div>
    </div>

    <button type="reset">Reset</button>
    <button type="submit">Submit</button>
  </form>
</template>
```

## Params

### initialValues (Required)

This is the form initial value and is used as the basis for `dirty` comparison.

- Type

  ```ts
  type Values = Record<string, any>
  ```

### initialErrors

This is the form initial error.

- Type `FormErrors<Values>`
- Default: `undefined`

### initialTouched

This is the form initial touched.

- Type `FormTouched<Values>`
- Default: `undefined`

### validateMode

This option allows you to configure the validation strategy **before** first submit.

- Type `'blur' | 'input' | 'change' | 'submit'`
- Default `'submit'`

### reValidateMode

This option allows you to configure the validation strategy **after** first submit.

- Type `'blur' | 'input' | 'change' | 'submit'`
- Default `'change'`

### validateOnMounted

This option allows you to configure the validation run when the component is mounted.

- Type `boolean`
- Default `false`

### validate

The `validate` is a **form level** validation, This property accepts the form's `values` as an argument. You can return an `errors` object or an undefined value to determine whether or not this is a valid values.

- Type

  ```ts
  function validate(values: Values): void | object | Promise<FormErrors<Values>>
  ```

This validate value can either be:

1. Synchronous function and return an `errors` object.

    ```ts
    import { useForm } from '@vorms/core'

    const { values } = useForm({
      initialValues: {
        name: '',
        age: 10
      },
      validate(values) {
        const errors = {}

        if(!values.name) {
          errors.name = 'name is required.'
        }

        if(typeof values.age !== 'number') {
          errors.age = 'age should be a number.'
        }

        return errors
      },
      onSubmit(values) {
        console.log(values)
      }
    }) 
    ```

2. Asynchronous function and return a Promise that is resolve to an object containing `errors`.

    ```ts
    import { useForm } from '@vorms/core'

    const { values } = useForm({
      initialValues: {
        name: '',
        age: 10
      },
      validate() {
        return new Promise((resolve) => {
          setTimeout(() => {
            const errors = {}

            if(!values.name) {
              errors.name = 'name is required.'
            }

            if(typeof values.age !== 'number') {
              errors.age = 'age should be a number.'
            }

            resolve(errors)
          }, 300)
        })
      },
      onSubmit(values) {
        console.log(values)
      }
    }) 
    ```

3. Use `@vorms/resolvers` to integrate external validation libraries such as [Yup](https://github.com/jquense/yup), [Zod](https://github.com/vriad/zod).

    ```bash
    npm install @vorms/resolvers
    ```

    ```ts
    import { useForm } from '@vorms/core'
    import { yupResolver } from '@vorms/resolvers/yup';
    import * as yup from 'yup';

    const schema = yup.object().shape({
      name: yup.string().required('Name is required!!'),
      age: yup.number().required('Age is required!!')
    })

    const { values } = useForm({
      initialValues: {
        name: '',
        age: 10
      },
      validate: yupResolver(schema),
      onSubmit(values) {
        console.log(values)
      }
    }) 
    ```

### onSubmit (Required)

This is your form submission handler, witch will pass your form's `values`. But this will not be called if there are validation errors.

- Type

  ```ts
  function onSubmit (values: Values, helper: FormSubmitHelper): void | Promise<any>
  ```

::: warning Note
If `onSubmit()` function is synchronous, you need to call `setSubmitting(false)` yourself.
:::

## Returns

### values

Current form values.

- Type `Values`

:::warning Note
If you use `values` with v-model directly, validation will only be called before submit.
:::

### errors

An object containing all the current validation errors. The shape will match the shape of the form's values.

- Type `ComputedRef<FormErrors<Values>>`

### touched

Map of field name to specific error for that field.

An object containing all fields that have ever been touched. The shape will match the shape of the form's values.

- Type `ComputedRef<FormTouched<Values>>`

### dirty

Return `true` if current values are not deeply equal `initialValues`.

- Type `ComputedRef<boolean>`

### setValues

This function allows you to dynamically update form values.

- Type `(values: Values, shouldValidate?: boolean)`

### setFieldValue

This function allows you to dynamically set the value of field.  

- Type `(name: string, value: unknown, shouldValidate?: boolean)`

### submitCount

The number of times user attempted to submit.

- Type `ComputedRef<number>`

### isSubmitting

Return `true` when form is submitting, If `onSubmit()` is a synchronous function, then you need to call setSubmitting(false) on your own.

- Type `Ref<boolean>`

### isValidating

Return `true` when running validation.

- Type `ComputedRef<boolean>`

### resetForm

Reset the entire form state. There are optional arguments and allow set state what you want.

- Type

  ```ts
  function resetForm(nextState?: Partial<FormResetState<Values>>): void

  interface FormResetState<Values> {
    //Form values.
    values: Values;
    // Map of field name to specific error for that field.
    touched: FormTouched<Values>;
    // Map of field name to the field has been touched.
    errors: FormErrors<Values>;
    // The number of times user attempted to submit.
    submitCount: number;
  }
  ```

### register

This method allows you to get specific field values, meta (state) and attributes, you can also add validation for that field.

- Type

  ```ts
  function register<Value>(name: MaybeRef<string>,  options?: FieldRegisterOptions<Value>): UseFormRegisterReturn<Value>
  ```

  <details>
    <summary>
      Show Type Detail
    </summary>

    ```ts
    interface FieldRegisterOptions<Value> {
      validate?: FieldValidator<Value>;
    }

    type FieldValidator<Value> = (value: Value) => string | void | Promise<string | void>

    type UseFormRegisterReturn<Value> =  {
      value: WritableComputedRef<Value>;
      dirty: ComputedRef<boolean>;
      error: ComputedRef<string | undefined>;
      touched: ComputedRef<boolean | undefined>;
      attrs: ComputedRef<FieldAttrs>;
    }

    interface FieldAttrs {
      name: string;
      onBlur: (event: Event) => void;
      onChange: () => void;
    }

    ```

  </details>

- Example
  
  ```vue
  <script setup lang="ts">
  const { register } = useForm({
    initialValues: {
      drink: 'Bubble Tea'
    }
  })

  const { value, attrs } = register('drink', {
    // Field level validation
    validate(value) {
      return !value ? 'What do you want to drink ?' : undefined
    }
  })
  </script>

  <template>
    <input v-model="value" type="text" v-bind="attrs" />
  </template>
  ```

### handleSubmit

Submit handler. It will call `event.preventDefault()` in internally, If `event` is passed.

- Type

  ```ts
  function handleSubmit(event?: Event): void
  ```

### handleReset

Reset handler. It will call `event.preventDefault()` in internally, If `event` is passed.

- Type

  ```ts
  function handleReset(event?: Event): void
  ```

### validateForm

Validate form values.

- Type

  ```ts
  function validateForm(values?: Values): Promise<FormErrors<Values>>
  ```

### validateField

Validate form specific field, if this field validation is register.

- Type

  ```ts
  function validateField(name: string): Promise<void>
  ```
