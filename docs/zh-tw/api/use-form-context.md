# useFormContext

`useFormContext()` 是一個自訂的 Vue Composition API，可讓您存取表單上下文。這對於深層結構中的嵌套元件很有用。

## Usage

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
    </button>
  </form>
</template>
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useField, useFormContext } from '@vorms/core'

const { validateField } = useFormContext()

// 您也可以使用 `useFormContext() 傳回的 `register`
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
