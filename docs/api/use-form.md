# useForm

`useForm()` is a custom Vue composition api that makes you to easily manage form values and state.

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

This is initial values of the form and will be used as the basis for the `dirty` comparison.

- Type

  ```ts
  type Values = Record<string, any>
  ```

### initialErrors

This is initial errors of the form.

- Type `FormErrors<Values>`
- Default: `undefined`

### initialTouched

This is initial touched status of the form.

- Type `FormTouched<Values>`
- Default: `undefined`

### validateMode

This option allows you to configure the validation strategy **before** first submit.

- Type `'blur' | 'input' | 'change' | 'submit'`
- Default `'submit'`

### reValidateMode

This option allows you to configure the validation strategy **after** first submit. By default, validation is triggered during the input change event.

:::info
Even if your `reValidationMode` is not set to `submit`, Vorms will revalidate before submitting.
:::

- Type `'blur' | 'input' | 'change' | 'submit'`
- Default `'change'`

### validateOnMounted

This option allows you to configure that whether the validation should run or not when component is mounted.

- Type `boolean`
- Default `false`

### validate

The `validate` is a **form level** validation. This property accepts the form's `values` as the argument. You could return the `errors` object or undefined to determine whether those values are valid or not.

- Type

  ```ts
  function validate(values: Values): void | object | Promise<FormErrors<Values>>
  ```

This validate value could either be:

1. Synchronous function and return the `errors` object.

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

2. Asynchronous function and return a Promise that is resolve an object containing `errors`.

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

3. Use `@vorms/resolvers` to integrate external validation libraries such as [Yup](https://github.com/jquense/yup) or [Zod](https://github.com/vriad/zod).

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

This is your form submission handler, witch will pass your form's `values`. But this will not be called if the validation failed.

- Type

  ```ts
  function onSubmit (values: Values, helper: FormSubmitHelper): void | Promise<any>
  ```

  ```ts
  interface FormSubmitHelper {
    setSubmitting: (isSubmitting: boolean) => void;
  }
  ```

#### Parameters

- `values`: the validated `values`.
- `helper`: some states or methods that can be helpful when submitting the form.

  | Name          | Description                   |
  |---------------|-------------------------------|
  |`setSubmitting`| Set isSubmitting imperatively.|

::: warning Important
When the `onSubmit()` function is asynchronous, the `isSubmitting` variable is automatically reset to `false` upon completion. Conversely, if `onSubmit()` is synchronous, you must manually call `setSubmitting(false)` to reset `isSubmitting`.
:::

### onInvalid

This is your invalid handler, called when the form is submitted with invalid values.

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

An object containing all fields that have ever been touched. The shape will match the shape of the form's values.

- Type `ComputedRef<FormTouched<Values>>`

### dirty

Return `true` if current values are not deeply equal to `initialValues`.

- Type `ComputedRef<boolean>`

### setValues

This function allows you to manually update form values.

- Type `(values: Values, shouldValidate?: boolean)`

### setFieldValue

This function allows you to manually set the specific value of field.  

- Type `(name: string, value: unknown, shouldValidate?: boolean)`

### submitCount

The number of times user attempted to submit.

- Type `ComputedRef<number>`

### isSubmitting

Return `true` when form is submitting, If `onSubmit()` is a synchronous function, then you need to call setSubmitting(false) yourself.

- Type `Ref<boolean>`

### isValidating

Return `true` when running validation.

- Type `ComputedRef<boolean>`

### resetForm

Reset the entire form state. There are optional arguments that allow you to set the state to what you want.

- Type

  ```ts
  function resetForm(nextState?: Partial<FormResetState<Values>>): void

  interface FormResetState<Values> {
    //Form values.
    values: Values;
    // An object containing the name of the field that has been touched.
    touched: FormTouched<Values>;
    // An object containing the name of the field that has error.
    errors: FormErrors<Values>;
    // The number of times user attempted to submit.
    submitCount: number;
  }
  ```

### register

This method allows you to get the specific field value, meta (state) and attribute, you can also add validation for that field.

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
      onBlur(event: Event): void;
      onChange(): void;
      onInput(): void
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

Submission handler. It will call `event.preventDefault()` internally, If `event` is passed.

- Type

  ```ts
  function handleSubmit(event?: Event): void
  ```

### handleReset

Reset handler. It will call `event.preventDefault()` internally, If `event` is passed.

- Type

  ```ts
  function handleReset(event?: Event): void
  ```

### validateForm

Validator of the form. It will run the **form level** validation.

- Type

  ```ts
  function validateForm(values?: Values): Promise<FormErrors<Values>>
  ```

### validateField

Validator for specific field, if this field's validation has been registered.

- Type

  ```ts
  function validateField(name: string): Promise<void>
  ```
