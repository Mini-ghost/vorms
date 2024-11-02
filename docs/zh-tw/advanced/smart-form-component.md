# Smart Form Component

雖然 Vue 的 `v-model` 指令幫助我們簡化了表單輸入綁定，但處理大型且複雜的表單仍然有點痛苦。

智慧表單元件（Smart Form Components）可以幫助我們進一步簡化表單建置。 我們只需要組合那些表單元件，它就會自動匹配對應的表單資料並完成輸入綁定。

```vue
<script setup lang="ts">
import SmartForm from './components/SmartForm.vue'
import SmartTextField from './components/SmartTextField.vue'
import SmartSelect from './components/SmartSelect.vue'

interface Values {
  drink: string,
  sugar: 'no' | 'light' | 'half' | 'standard'
}

const initialValues = {
  drink: '',
  sugar: 'light',
}

const onSubmit = (values: Values) => {
  console.log(values);
  
}

</script>

<template>
  <div>
    <SmartForm :initial-values="initialValues" @submit="onSubmit">
      <SmartTextField name="name" />
      <SmartSelect name="sugar" :options="['no', 'light', 'half', 'standard']" />

      <button type="submit">Submit</button>
    </SmartForm>
  </div>
</template>
```

讓我們看看如何編寫這些元件。

## SmartForm

SmartForm 元件將為元件的後代提供 vorms 的狀態和方法。

```vue
<script setup lang="ts">
import { useForm } from '@vorms/core';

type Values = Record<string, any>;

interface SmartFormProps {
  initialValues: Values;
}

interface SmartFormEvent {
  (event: 'submit', values: Values): void;
}

const props = defineProps<SmartFormProps>();
const emit = defineEmits<SmartFormEvent>();

const { handleSubmit, handleReset } = useForm({
  initialValues: props.initialValues,
  onSubmit(values) {
    emit('submit', values);
  },
});
</script>

<template>
  <form @submit="handleSubmit" @reset="handleReset">
    <slot name="default" />
  </form>
</template>
```

## SmartTextField 和 SmartSelect

這些輸入元件將注入 SmartForm 元件提供的狀態和方法，並在背景處理表單輸入綁定。

**SmartTextField**

```vue
<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from '@vorms/core'

interface SmartTextFieldProps {
  name: string;
}

const props = defineProps<SmartTextFieldProps>()

const nameRef = toRef(props, 'name')
const { value, attrs } = useField(nameRef)
</script>

<template>
  <input v-model="value" type="text" v-bind="attrs">
</template>
```

**SmartSelect**

```vue
<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from '@vorms/core'

interface SmartSelectProps {
  name: string;
  options: string[]
}

const props = defineProps<SmartSelectProps>()

const nameRef = toRef(props, 'name')
const { value, attrs } = useField(nameRef)
</script>

<template>
  <select v-model="value" v-bind="attrs">
    <option v-for="item in options" :key="item" :value="item">
      {{ item }}
    </option>
  </select>
</template>
```

現在，您可以在專案中創建和組合複雜的內容，而無縫接軌。  
這個理想的靈感來自 [React Hook Form](https://react-hook-form.com/advanced-usage#SmartFormComponent)
