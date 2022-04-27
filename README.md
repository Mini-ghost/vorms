### Quickstart

```vue
<script setup lang="ts">
import { useForm } from '@vue-composable-form/core'

const {
  values,
  handleSubmit
} = useForm({
  initialValues: {
    firstName: '',
    lastName: ''
  }
  onSubmit(data) {
    console.log(data)
  }
})
</script>

<template>
  <form @submit="handleSubmit">
    <input type="text" v-model="values.firstName">
    <input type="text" v-model="values.lastName">
    <button type="submit">
      submit
    </button>
  </form>
</template>
```