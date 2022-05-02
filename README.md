### Quickstart

**useForm**

```vue
<script setup lang="ts">
import { useForm } from '@vue-composition-form/core'

interface InitialValues {
  firstName: string,
  lastName: string
}

const { register, handleSubmit } = useForm<InitialValues>({
  initialValues: {
    firstName: '',
    lastName: ''
  },
  onSubmit(data) {
    console.log(data)
  }
})

const { value: firstName } = register('firstName')
const { value: lastName } = register('lastName', {
  validate(value) {
    let error: string | undefined
    if(!value.length) {
      error = 'lastName is required'
    }

    return error
  }
})
</script>

<template>
  <form @submit="handleSubmit">
    <input v-model="firstName" type="text">
    <input v-model="lastName" type="text">
    <button type="submit">
      submit
    </button>
  </form>
</template>
```

**useField**

`useField` API is equal to `register` that return by `useForm`.

```vue
<script setup lang="ts">
import { useField } from '@vue-composition-form/core'

const { value: lastName } = useField<string>('lastName', {
  validate(value) {
    let error: string | undefined
    if(!value.length) {
      error = 'lastName is required'
    }

    return error
  }
})
</script>
```

**useFieldArray**

```vue
<script setup lang="ts">
import { useForm, useFieldArray } from '@vue-composition-form/core'

const { handleSubmit } = useForm({
  initialValues: {
    foods: ['Bubble Tea', 'Stinky Tofu', 'Scallion Pancake']
  },
  onSubmit(data) {
    console.log(data)
  }
})

const { fields, append } = useFieldArray<string[]>('foods')

const onAppend = () => {
  append('Taiwanese Fried Chicken')
}
</script>

<template>
  <form @submit="handleSubmit">
    <div :key="filed.key" v-for="filed in fields">
      <input v-model="filed.value">
    </div>
    <button type="button" @click="onAppend">
      Append
    </button>
    <button type="submit">
      Order
    </button>
  </form>
</template>
```

### Credits

API inspired by [Formik](https://github.com/jaredpalmer/formik), [react-hook-form](https://github.com/react-hook-form/react-hook-form), [VeeValidate](https://github.com/logaretm/vee-validate)