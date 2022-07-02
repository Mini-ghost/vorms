# Get Started

Vue Composition Form is a form validate library based on [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html).

## Installation

```bash
npm install @vue-composition-form/core
```

## CDN

```html
<script src="https://unpkg.com/@vue-composition-form/core"></script>
```

It will be exposed to global as `window.VueCompositionForm`

## Usage Example

```vue
<script setup lang="ts">
import { useForm } from '@vue-composition-form/core'

interface InitialValues {
  drink: string,
  sugar: number
  ice: string
  bag: boolean
}

const { register, handleSubmit, handleReset } = useForm<InitialValues>({
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

  onSubmit(data, { setSubmitting }) {
    console.log(data)

    // If `onSubmit()` function is synchronous, 
    // you need to call `setSubmitting(false)` yourself.
    setSubmitting(false)
  }
})

// The `attrs` need to be bind on <input /> to support `validateMode` 
// and `reValidateMode`
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
    <label>Drink</label>
    <input v-model="drink" type="text" v-bind="drinkFieldAttrs">

    <label>Sugar level</label>
    <input v-model="sugar" type="number" v-bind="sugarFieldAttrs">

    <label>Ice level</label>
    <input v-model="ice" type="text" v-bind="iceFieldAttrs">

    <label>Need a bag</label>
    <input v-model="bag" type="checkbox" v-bind="bagFieldAttrs">

    <button type="reset">Reset</button>
    <button type="submit">Submit</button>
  </form>
</template>
```

More example please read the next section: [Examples](./examples)
