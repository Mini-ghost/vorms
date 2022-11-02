# useField

`useField()` is a custom Vue composition api that will return specific field value, meta (state) and attributes, you can also add validation for that field.

`useField()` is equal to `register()` that return by `useForm()`.

## Usage

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

## Options

### name (Required)

Name of the field.

### options.validate

This function allows you to write your logic to validate your field, this is optional.

## Returns

### value

Current field value.

### errors

Field error message.

### touched

Return `true` after input first blur.

### dirty

Return `true` if current field value are not equal initial value.

### attrs.name

Input's name that we pass by.

### attrs.onBlur

onBlur prop to subscribe the input blur event.

### attrs.onChange

onChange prop to subscribe the input change event.
