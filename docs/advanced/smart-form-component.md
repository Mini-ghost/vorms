# Smart Form Component

While Vue's `v-model` directive has helped us simplify form input binding, it's still a bit of a pain to deal with large and complex forms.

Smart form components can help us simplify form building even further. We only need to combine those form components, it will automatically match the corresponding form data and complete the input binding.

```vue
<script setup lang="ts">
import SmartForm from './components/SmartForm.vue'
import SmartTextField from './components/SmartTextField.vue'
import SmartSelect from './components/SmartSelect.vue'

interface Values {
  drink: string,
  sugar: 'no' | 'light' | 'half' | 'half' | 'standard'
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
      <SmartSelect name="sugar" :options="['no', 'light', 'half', 'half', 'standard']" />

      <button type="submit">Submit</button>
    </SmartForm>
  </div>
</template>
```

Let's see how to write those components.

## SmartForm

The SmartForm component will provide vorms's states and methods to a component's descendants.

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

## SmartTextField and SmartSelect

Those input components will inject the state and methods provided by the SmartForm component and handle form input binding under the hood.

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

Now, you can create and compose complex from in your project without the tears. This ideal is inspired by [React Hook Form](https://react-hook-form.com/advanced-usage#SmartFormComponent)
