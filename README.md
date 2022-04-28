### Quickstart

```vue
<script setup lang="ts">
import { useForm } from '@vue-composable-form/core'

interface InitialValues {
  firstName: string,
  lastName: string
}

const { register, handleSubmit } = useForm<InitialValues>({
  initialValues: {
    firstName: '',
    lastName: ''
  }
  onSubmit(data) {
    console.log(data)
  }
})

const { value: firstName } = register('firstName')
const { value: lastName } = register('lastName')
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