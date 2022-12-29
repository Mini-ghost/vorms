# useFieldArray

`useFieldArray()` is a custom Vue composition api that will return values, meta (state), attributes of specific field and provides common operation helpers, you can also add validation to validate the values in it.

## Usage

```vue
<script setup lang="ts">
import { useForm, useFieldArray } from '@vorms/core'

const { handleSubmit } = useForm({
  initialValues: {
    foods: ['Bubble Tea', 'Stinky Tofu', 'Scallion Pancake']
  },
  onSubmit(data) {
    console.log(data)
  }
})

const { fields, append } = useFieldArray<string>('foods')
</script>

<template>
  <form @submit="handleSubmit">
    <div v-for="field in fields" :key="field.key">
      <input 
        v-model="field.value" 
        type="text" 
        :name="field.name" 
        v-bind="field.attrs"
      >
    </div>
    <button type="button" @click="append('Taiwanese Fried Chicken')">
      Append
    </button>
    <button type="submit">Order</button>
  </form>
</template>
```

## Params

### name (Required)

Name of the field array.

- Type `MaybeRef<string>`

### options

- Type

```ts
interface UseFieldArrayOptions<Value> {
  // This function allows you to write your logic to validate your values in this field,
  // this is optional.
  validate?: FieldArrayValidator<Value[]>;
}

type FieldArrayValidator<Value extends Array<any>> = (value: Value) => FormErrors<Value> | void | Promise<FormErrors<Value> | void>;
```

The `validate` is a **field level** validation. This property accepts the `values` of this field as an argument. You can return an array or an undefined to determine whether the values in it is valid or not.

## Returns

### fields

This array contains every entry of field's key, value, meta and attrs.

- Type `Ref<FieldEntry<Value>[]>`

  ```ts
  interface FieldEntry<Value> {
    key: number;
    value: Value;
    name: string;
    error: FormErrors<Value>;
    touched: Value extends Primitive ? boolean : FormTouched<Value> | undefined;
    dirty: boolean;
    attrs: Omit<FieldAttrs, 'name'>;
  }
  ```

`useFieldArray` automatically generates an unique identifier named `key` which is used for key prop. For more information why this is required: [Maintaining State with key](https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key)

The `field.key` must be added as the key of component to prevent the field from being broken by re-rendering.

```vue
<template>
  <!-- correct -->
  <input v-for="field in fields" :key="field.key" />

  <!-- incorrect -->
  <input v-for="(field, index) in fields" :key="index" />
</template>
```

### append

Append an item to the field array.

- Type `(value: Value) => void;`

```ts
const { fields, append } = useFieldArray('food')

console.log(fields.value.map(field => field.value))
// output:  ['Bubble Tea']

append('Stinky Tofu')
console.log(fields.value.map(field => field.value))
// output:  ['Bubble Tea', 'Stinky Tofu']
```

### prepend

Prepend an item to the field array.

- Type `(value: Value) => void;`

```ts
const { fields, prepend } = useFieldArray('food')

console.log(fields.value.map(field => field.value))
// output:  ['Bubble Tea']

prepend('Fried Chicken')
console.log(fields.value.map(field => field.value))
// output:  ['Fried Chicken', 'Bubble Tea']
```

### swap

Swap the position of the item.

- Type `(indexA: number, indexB: number) => void`

```ts
const { fields, swap } = useFieldArray('food')

console.log(fields.value.map(field => field.value))
// output:  ['Aiyu Jelly', 'Shaved Ice', 'Bubble Tea']

swap(0, 2)
console.log(fields.value.map(field => field.value))
// output:  ['Bubble Tea', 'Shaved Ice', 'Aiyu Jelly']
```

### remove

Remove the item by it index, or remove all when no index is provided.

- Type `(index?: number) => void`

```ts
const { fields, remove } = useFieldArray('food')

console.log(fields.value.map(field => field.value))
// output:  ['Century Egg', 'Stinky Tofu', 'Oyster Vermicelli Noodles']

remove(2)
console.log(fields.value.map(field => field.value))
// output:  ['Century Egg', 'Stinky Tofu']

remove()
console.log(fields.value.map(field => field.value))
// output:  []
```

### move

Move the item to another position.

- Type `(from: number, to: number) => void`

```ts
const { fields, move } = useFieldArray('food')

console.log(fields.value.map(field => field.value))
// output:  ['Avocado', 'Shaved Ice', 'Bubble Tea']

move(0, 2)
console.log(fields.value.map(field => field.value))
// output:  ['Shaved Ice', 'Bubble Tea', 'Avocado']
```

### insert

Insert an item at the specified position.

- Type `(index: number, value: Value) => void`

```ts
const { fields, insert } = useFieldArray('food')

console.log(fields.value.map(field => field.value))
// output:  ['Chicken Chop', 'Bubble Tea']

insert(1, 'Bubble Tea')
console.log(fields.value.map(field => field.value))
// output:  ['Chicken Chop', 'Bubble Tea', 'Bubble Tea']
```

### update

Update the item at the specified position.

- Type `(index: number, value: Value) => void`

```ts
const { fields, update } = useFieldArray('food')

console.log(fields.value.map(field => field.value))
// output:  ['Fried Chicken', 'Bubble Tea']

insert(0, 'Soup Dumplings')
console.log(fields.value.map(field => field.value))
// output:  ['Soup Dumplings', 'Bubble Tea']
```

### replace

Replace the entire field array values.

- Type `(values: Value[]) => void`

```ts
const { fields, update } = useFieldArray('food')

console.log(fields.value.map(field => field.value))
// output:  ['Fried Chicken', 'Bubble Tea']

insert(['Soup Dumplings', 'Three-Cup Chicken'])
console.log(fields.value.map(field => field.value))
// output:  ['Soup Dumplings', 'Three-Cup Chicken']
```

## Type Declarations

<details>
  <summary>Show Type Declarations</summary>

  ```ts
  function useFieldArray <Value>(name: MaybeRef<string>, options?: UseFieldArrayOptions<Value>): UseFieldArrayReturn<Value>

  interface UseFieldArrayOptions<Value> {
    validate?: FieldArrayValidator<Value[]>;
  }

  type FieldArrayValidator<Value extends Array<any>> = (value: Value) => FormErrors<Value> | void | Promise<FormErrors<Value> | void>;

  type UseFieldArrayReturn<Value> = {
    fields: Ref<FieldEntry<Value>[]>;
    append: (value: Value) => void;
    prepend: (value: Value) => void;
    swap: (indexA: number, indexB: number) => void;
    remove: (index?: number) => void;
    move: (from: number, to: number) => void;
    insert: (index: number, value: Value) => void;
    update: (index: number, value: Value) => void;
    replace: (values: Value[]) => void;
  };

  interface FieldEntry<Value> {
    key: number;
    value: Value;
    name: string;
    error: FormErrors<Value>;
    touched: Value extends Primitive ? boolean : FormTouched<Value> | undefined;
    dirty: boolean;
    attrs: Omit<FieldAttrs, 'name'>;
  }
  ```

</details>
