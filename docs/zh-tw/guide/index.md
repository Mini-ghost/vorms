# 開始

Vorms 是一個強型別、輕量、簡單且靈活，基於 [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) 的表單驗證和狀態管理工具。

## 安裝

```bash
npm install @vorms/core
```

## CDN

```html
<script src="https://unpkg.com/@vorms/core"></script>
```
這將會被公開為全域變數 `window.Vorms`。

## 使用範例

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

請參考 [範例](/zh-tw/examples/) 部分以獲得更多使用範例。