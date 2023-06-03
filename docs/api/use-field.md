# useField

`useField(name: MaybeRef<string>, options?: UseFieldOptions<Value>)` is a custom Vue composition api that will return the value, meta (state) and attributes of a specific field, you can also add validation to it.

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

The name of a specific field. Its type can be `string`, `Ref<string>` or `() => string`

- Type `MaybeRefOrGetter<string>`

If you want to create a custom component in your application, such as `<TextField />`, you should use `Ref<string>` to retain reactivity for `props.name`. as follows:

```vue
<script setup lang="ts">
import { useField } from '@vorms/core'

interface TextFieldProps {
  name: string
}

const props = defineProps<TextFieldProps>()

// or using `const nameSync = computed(() => props.name)`
// or using `const nameRef = toRef(props, 'name')`
const { value } = useField<string>(() => 'name')
</script>
```

This is useful when you have a dynamic field name. e.g. the name is generated using a `v-for` loop.

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
interface UseFieldOptions<Value> {
  // This function allows you to write your logic to validate your field, 
  // this is optional.
  validate?: FieldValidator<Value>;
};

type FieldValidator<Value> = (value: Value) => string | void | Promise<string | void>;
```

The `validate` is a **field level** validation. This property accepts the field's `value` as an argument. You can return a string or an undefined value to determine whether this value is valid or not, the string you return will be the error message for this field.

## Returns

### value

Current field's value.

- Type `Ref<Value>`

### error

Current field's error message.

- Type `ComputedRef<string>`

### touched

Returns `true` after the field has been blurred for the first time.

- Type `ComputedRef<boolean>`

### dirty

Return `true` if current field's value are not equal to initial value.

- Type `ComputedRef<string>`

### attrs

`attrs` is attributes that need to be bound to the field.

- Type `ComputedRef<FieldAttrs>`

  ```ts
  interface FieldAttrs {
    // Field's name that you passed earlier.
    name: string;
    onBlur(event: Event): void;
    onChange(): void;
    onInput(): void
  };
  ```

- Example

  ```html
  <input v-model="value" type="text" v-bind="attrs" />
  ```
