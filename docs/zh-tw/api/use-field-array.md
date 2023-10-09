# useFieldArray

`useFieldArray()` 是一個自訂的 Vue Composition API，它將傳回值（values）、狀態（state）、特定欄位的屬性（attributes）並提供通用操作幫助器，您還可以新增驗證來驗證其中的值。

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

## 參數

### name (必填)

欄位陣列的名稱。

- Type `MaybeRefOrGetter<string>`

### options

- Type

```ts
interface UseFieldArrayOptions<Value> {
  // 此方法允許您編寫邏輯來驗證您的欄位，
  // 這是可選的。
  validate?: FieldArrayValidator<Value[]>;
}

type FieldArrayValidator<Value extends Array<any>> = (value: Value) => FormErrors<Value> | void | Promise<FormErrors<Value> | void>;
```

`validate` 是 **欄位級別（field level）** 驗證。此屬性接受該欄位的值（`values`）作為參數。 您可以傳回一個陣列（array）或一個 undefined 來決定其中的值是否有效。

## 回傳

### fields

此陣列包含每個 key、value、meta 和 attrs 的欄位輸入。

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

`useFieldArray` 會自動產生一個名為 `key` 的唯一標識，用於 key prop。

關於為什麼需要這樣做，可以參考以下資訊：[Maintaining State with key](https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key)

必須加入 `field.key` 作為元件的 key，以防止欄位因重新渲染而被破壞。

```vue
<template>
  <!-- 正確 -->
  <input v-for="field in fields" :key="field.key" />

  <!-- 錯誤 -->
  <input v-for="(field, index) in fields" :key="index" />
</template>
```

### append

將 item 附加到欄位陣列（field array）。
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

將一個 item 加入到欄位陣列的前面。

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

交換 item 的位置

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

按索引（index）刪除 item，或在未提供索引（index）時刪除所有項目。

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

將 item 移動到另一個位置

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

在指定位置插入 item。

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

更新指定位置的 item。

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

替換整個欄位陣列的值。

- Type `(values: Value[]) => void`

```ts
const { fields, update } = useFieldArray('food')

console.log(fields.value.map(field => field.value))
// output:  ['Fried Chicken', 'Bubble Tea']

insert(['Soup Dumplings', 'Three-Cup Chicken'])
console.log(fields.value.map(field => field.value))
// output:  ['Soup Dumplings', 'Three-Cup Chicken']
```

## 類型聲明

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
