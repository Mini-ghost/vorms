# useField

`useField(name: MaybeRef<string>, options?: UseFieldOptions<Value>)` 是一個自訂的 Vue Composition API，它將傳回特定欄位的值（value）、狀態（state）和屬性（attributes），當然 您也可以為其新增驗證。

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

## 參數

### name (必填)

特定欄位的名稱。 它的型別可以是 `string`、`Ref<string>` 或 `() => string`

- Type `MaybeRefOrGetter<string>`

如果您想在應用程式中建立自訂元件，例如 `<TextField />`，則應該使用 `Ref<string>` 來保留 `props.name` 的響應性。 如下：

```vue
<script setup lang="ts">
import { useField } from '@vorms/core'

interface TextFieldProps {
  name: string
}

const props = defineProps<TextFieldProps>()

// 或使用 `const nameSync = computed(() => props.name)`
// 或使用 `const nameRef = toRef(props, 'name')`
const { value } = useField<string>(() => 'name')
</script>
```

當您有動態欄位名稱時，這非常有用。 例如 `name` 是使用 `v-for` 循環產生的。

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
  // 此方法允許您編寫邏輯來驗證您的欄位，
  // 這是可選的。
  validate?: FieldValidator<Value>;
};

type FieldValidator<Value> = (value: Value) => string | void | Promise<string | void>;
```

`validate` 是 **欄位級別驗證（field level）**。此屬性接受欄位的值（`value`）作為參數。  
您可以傳回一個字串（string）或一個 undefined 的值來確定該值是否有效，您傳回的字串將是該欄位的錯誤訊息。

## 回傳

### value

當前欄位的值。

- Type `Ref<Value>`

### error

當前欄位的錯誤訊息

- Type `ComputedRef<string>`

### touched

字段第一次模糊（blurred）後回傳`true`。

- Type `ComputedRef<boolean>`

### dirty

如果目前欄位的值不等於初始值，則傳回`true`。

- Type `ComputedRef<string>`

### attrs

`attrs` 是需要綁定到欄位的屬性。

- Type `ComputedRef<FieldAttrs>`

  ```ts
  interface FieldAttrs {
    // 您之前通過的欄位名稱。
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
