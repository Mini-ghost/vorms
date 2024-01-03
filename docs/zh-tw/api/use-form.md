# useForm

`useForm()` 是一個自訂的 Vue Composition API，讓您輕鬆管理表單的值和狀態。

## 用法

以下程式碼展示了一個基本的使用範例：

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
    // 如果 `onSubmit()` 方法是同步的
    // 您需要自己調用 `setSubmitting(false)`。
    setSubmitting(false)
  }
})


// 基本用法
// 需要在 <input> 上綁定 `attrs`，
// 以支援 `validateMode` 和 `reValidateMode`。

const { value: drink, attrs: drinkFieldAttrs } = register('drink')

// 新增欄位級別的驗證。
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

## 參數

### initialValues (必填)

這是表單的初始值，將用 dirty comparison（骯髒比較）為基礎。

- Type

  ```ts
  type Values = Record<string, any>
  ```

### initialErrors

這是表單的初始錯誤訊息。

- Type `FormErrors<Values>`
- Default: `undefined`

### initialTouched

這是表單的初始觸摸（touched）狀態。

- Type `FormTouched<Values>`
- Default: `undefined`

### validateMode

這個選項允許您在首次提交**之前**，配置驗證模式。

- Type `'blur' | 'input' | 'change' | 'submit'`
- Default `'submit'`

### reValidateMode

這個選項允許您在首次提交**之後**配置驗證模式。

默認情況下，驗證是在輸入事件變更（input change event）時觸發的。

:::info
即使您的 `reValidationMode` 沒有設置為 `submit`，Vorms 仍然會在提交之前重新驗證。
:::

- Type `'blur' | 'input' | 'change' | 'submit'`
- Default `'change'`

### validateOnMounted

這個選項允許您配置當元件被掛載（mounted）時，是否應該進行驗證。

- Type `boolean`
- Default `false`

### validate

`validate` 是一個**表單級別**的驗證方法。此屬性接受表單的 `values` 作為參數。

您可以返回 `error` 物件（errors object）或 undefined 來確定這些值是否有效。

- Type

  ```ts
  function validate(values: Values): void | object | Promise<FormErrors<Values>>
  ```

validate 可以是以下其中一種：

1. 同步方法，返回 `errors` 物件。

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

2. 非同步方法，返回一個 Promise，該 Promise 解析為包含 `errors` 的物件。

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

3. 您可以使用 `@vorms/resolvers` 來整合其他外部驗證庫，如 [Yup](https://github.com/jquense/yup) 或 [Zod](https://github.com/vriad/zod)。

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

### onSubmit (必填)

這是您的表單提交處理程序，它將傳遞您表單的值（`values`）。但如果驗證失敗，則不會調用此處理程序。

- Type

  ```ts
  function onSubmit (values: Values, helper: FormSubmitHelper): void | Promise<any>
  ```

  ```ts
  interface FormSubmitHelper {
    setSubmitting: (isSubmitting: boolean) => void;
    initialValues: Values;
  }
  ```

#### 參數

- `values`: 需驗證的值（`values`）。
- `helper`: 一些在提交表單時可能有幫助的狀態或方法。

  | Name          | Description                   |
  |---------------|-------------------------------|
  |`setSubmitting`| 強制設定 isSubmitting          |
  |`initialValues`| 表單的初始值                    |

::: warning Important
當 `onSubmit()` 方法是非同步的時候，`isSubmitting` 變數會在完成之後自動設置為 `false`。

相反地，如果 `onSubmit()` 是同步的，你必須手動呼叫 `setSubmitting(false)` 來重置 `isSubmitting`。
:::

### onInvalid

這是您的無效處理程序，當使用無效值提交表單時會被呼叫。

## 回傳

### values

目前表單的值。

- Type `Values`

:::warning Note

如果您直接使用 v-model 來綁定表單的值（`values`），驗證將只在提交之前被調用。

:::

### errors

這是一個包含所有當前驗證錯誤的物件。其形狀會與表單值的形狀匹配。

- Type `ComputedRef<FormErrors<Values>>`

### touched

這是一個包含所有曾經被觸摸（touched）過的欄位對象。其形狀將與表單的值的形狀相匹配

- Type `ComputedRef<FormTouched<Values>>`

### dirty

如果現在的值沒有 `initialValues` 與深度相等（deeply equal），回傳 `true` 。

- Type `ComputedRef<boolean>`

### setValues

這個方法允許你手動更新表單的值。

- Type `(values: Values, shouldValidate?: boolean)`

### setFieldValue

這個方法允許你手動設置欄位的值

- Type `(name: string, value: unknown, shouldValidate?: boolean)`

### setErrors

這個方法允許您手動設置表單的錯誤訊息。

- Type `(errors: FormErrors<Values>)`

### setFieldError

這個方法允許您手動設置欄位的錯誤訊息。

- Type `(name: string, error: string | string[] | Record<string, any> | undefined)`

### submitCount

用戶嘗試提交表單的次數。

- Type `ComputedRef<number>`

### isSubmitting

當表單正在提交時（submitting），這個方法將回傳 `true`。  
如果 `onSubmit()` 是一個同步方法，那麼您需要手動呼叫 `setSubmitting(false)` 來將狀態設置為 `false`。

- Type `Ref<boolean>`

### isValidating

當正在進行驗證時，這個方法將回傳 `true`。

- Type `ComputedRef<boolean>`

### resetForm

重置整個表單的狀態。您可以選擇性地傳遞參數來設置表單的狀態為您想要的值。

- Type

  ```ts
  function resetForm(nextState?: Partial<FormResetState<Values>>): void

  interface FormResetState<Values> {
    // 表單的值。
    values: Values;
    // 一個包含已觸摸（touched）過的欄位名稱的物件
    touched: FormTouched<Values>;
    // 一個包含有錯誤的欄位名稱的物件。
    errors: FormErrors<Values>;
    // 用戶嘗試提交的次數
    submitCount: number;
  }
  ```

### register

此方法可讓您取得特定欄位值（value）、狀態（state）和屬性（attribute），您也可以為該欄位新增驗證。

- Type

  ```ts
  function register<Value>(name: MaybeRefOrGetter<string>,  options?: FieldRegisterOptions<Value>): UseFormRegisterReturn<Value>
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

提交處理程序。如果事件（`event`）被傳遞，它將在內部呼叫 `event.preventDefault()`。

- Type

  ```ts
  function handleSubmit(event?: Event): void
  ```

### handleReset

重置處理程序。如果事件（`event`）被傳遞，它將在內部呼叫 `event.preventDefault()`。

- Type

  ```ts
  function handleReset(event?: Event): void
  ```

### validateForm

表單的驗證器。 它將運行 **表單級別（form level）** 驗證。

- Type

  ```ts
  function validateForm(values?: Values): Promise<FormErrors<Values>>
  ```

### validateField

特定欄位的驗證器，如果該欄位的驗證已註冊。

- Type

  ```ts
  function validateField(name: string): Promise<void>
  ```
