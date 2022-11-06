# useField

`useField()` is a custom Vue composition api that will return specific field value, meta (state) and attributes, you can also add validation for that field.

## Usage

```vue
<script setup lang="ts">
import { useField } from '@vorms/core'

const { value, error, attrs } = useField<string>('drink', {
  validate(value) {
    return value ? 'This is required!!' : undefined
  }
})
</script>

<template>
  <div>
    <input v-model="value" type="text" v-bind="attrs" >
    <span>{{ error }}</span>
  </div>
</template>
```

## Params

### name (Required)

The name of a specific field. Its type can be `string` or `Ref<string>`

- Type `MaybeRef<string>`

If you want to create a custom component in your application, such as `<TextField />`, you should use `Ref<string>` to retain reactivity of `props.name`. as follows:

```vue
<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from '@vorms/core'

interface TextFieldProps {
  name: string
}

const props = defineProps<TextFieldProps>()

// or using `const nameSync = computed(() => props.name)`
const nameRef = toRef(props, 'name')
const { value } = useField<string>(nameRef)
</script>
```

This is useful when you have a dynamic field name, such as name that is generated with a `v-for` loop.

```vue
<template>
  <div v-for="(order, index) in orders" :key="order.id">
    <TextField :name="`order.${index}.name`" />
  </div>
</template>
```

### options

- Type

  ```ts
  interface UseFieldOptions<Value> = {
    // This function allows you to write your logic to validate your field, 
    // this is optional.
    validate?: FieldValidator<Value>;
  };

  type FieldValidator<Value> = (value: Value) => string | void | Promise<string | void>;
  ```

The `validate` is a **field level** validation, This property accepts the field's `value` as an argument. You can return a string or an undefined value to determine whether or not this is a valid value, the string you return will be the error message for this field.

## Returns

### value

Current field value.

- Type `Ref<Value>`

### error

Field error message.

- Type `ComputedRef<string>`

### touched

Return `true` after input first blur.

- Type `ComputedRef<boolean>`

### dirty

Return `true` if current field value are not equal initial value.

- Type `ComputedRef<string>`

### attrs

`attrs` is attributes that need to be bound on the field.

- Type `ComputedRef<FieldAttrs>`

  ```ts
  interface FieldAttrs = {
    // Field's name that we pass by.
    name: string;
    onBlur(event: Event): void;
    onChange(): void;
  };
  ```

- Example

  ```html
  <input v-model="value" type="text" v-bind="attrs" />
  ```
