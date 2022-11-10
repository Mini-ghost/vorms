# Get Started

Vorms is a type strong, lightweight, easy and flexible form validation and state management library based on [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html).

## Installation

```bash
npm install @vorms/core
```

## CDN

```html
<script src="https://unpkg.com/@vorms/core"></script>
```

It will be exposed to global as `window.Vorms`

## Usage Example

```vue
<script setup lang="ts">
import { useForm } from '@vorms/core'

const sugarOptions = ['no', 'light', 'half', 'half', 'standard']

const { register, handleSubmit, handleReset } = useForm({
  initialValues: {
    drink: '',
    sugar: 'light',
  },
  onSubmit(data) {
    console.log(data)
  }
})

const { value: drink, attrs: drinkFieldAttrs } = register('drink')
const { value: sugar, attrs: sugarFieldAttrs } = register('sugar')
</script>

<template>
  <form @submit="handleSubmit" @reset="handleReset">
    <label>Drink</label>
    <input v-model="drink" type="text" v-bind="drinkFieldAttrs">

    <label>Sugar level</label>
    <select v-model="sugar" v-bind="sugarFieldAttrs">
      <option v-for="item in sugarOptions" :key="item" :value="item">
        {{ item }}
      </option>
    </select>

    <button type="reset">Reset</button>
    <button type="submit">Submit</button>
  </form>
</template>
```

More example please read the next section: [Examples](./examples)
