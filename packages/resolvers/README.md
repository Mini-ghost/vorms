## Install

```bash
npm install @vorms/resolvers
```

## Quickstart

### [Valibot](https://github.com/fabian-hiller/valibot)

The modular and type safe schema library for validating structural data 🤖

```vue
<script setup lang="ts">
import { useForm } from '@vorms/core';
import { valibotResolver } from '@vorms/resolvers/valibot';
import { object, string, minLength } from 'valibot'

const { register, errors, handleSubmit } = useForm({
  initialValues: {
    account: '',
    password: '',
  },
  validate: valibotResolver(object({
    account: string([minLength()]),
    password: string([minLength()])
  })),
  onSubmit(values) {
    alert(JSON.stringify(values, null, 2));
  },
});

const { value: account, attrs: accountAttrs } = register('account');
const { value: password, attrs: passwordAttrs } = register('password');
</script>

<template>
  <form @submit="handleSubmit">
    <div>
      <input
        v-model="account"
        type="text"
        placeholder="Account"
        v-bind="accountAttrs"
      />
      <div v-show="'account' in errors">
        {{ errors.account }}
      </div>
    </div>
    <div>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        v-bind="passwordAttrs"
      />
      <div v-show="'password' in errors">
        {{ errors.password }}
      </div>
    </div>
    <div>
      <input type="submit" />
    </div>
  </form>
</template>
```

### [Yup](https://github.com/jquense/yup)

Dead simple Object schema validation

```vue
<script setup lang="ts">
import { useForm } from '@vorms/core';
import { yupResolver } from '@vorms/resolvers/yup';
import * as yup from 'yup'

const { register, errors, handleSubmit } = useForm({
  initialValues: {
    account: '',
    password: '',
  },
  validate: yupResolver(yup.object({
    account: yup.string().required(),
    password: yup.string().required()
  })),
  onSubmit(values) {
    alert(JSON.stringify(values, null, 2));
  },
});

const { value: account, attrs: accountAttrs } = register('account');
const { value: password, attrs: passwordAttrs } = register('password');
</script>

<template>
  <form @submit="handleSubmit">
    <div>
      <input
        v-model="account"
        type="text"
        placeholder="Account"
        v-bind="accountAttrs"
      />
      <div v-show="'account' in errors">
        {{ errors.account }}
      </div>
    </div>
    <div>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        v-bind="passwordAttrs"
      />
      <div v-show="'password' in errors">
        {{ errors.password }}
      </div>
    </div>
    <div>
      <input type="submit" />
    </div>
  </form>
</template>
```

### [Zod](https://github.com/vriad/zod)

TypeScript-first schema validation with static type inference

```vue
<script setup lang="ts">
import { useForm } from '@vorms/core';
import { zodResolver } from '@vorms/resolvers/zod';
import z from 'zod'

const { register, errors, handleSubmit } = useForm({
  initialValues: {
    account: '',
    password: '',
  },
  validate: yupResolver(z.object({
    account: z.string().min(1),
    password: z.string().min(1)
  })),
  onSubmit(values) {
    alert(JSON.stringify(values, null, 2));
  },
});

const { value: account, attrs: accountAttrs } = register('account');
const { value: password, attrs: passwordAttrs } = register('password');
</script>

<template>
  <form @submit="handleSubmit">
    <div>
      <input
        v-model="account"
        type="text"
        placeholder="Account"
        v-bind="accountAttrs"
      />
      <div v-show="'account' in errors">
        {{ errors.account }}
      </div>
    </div>
    <div>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        v-bind="passwordAttrs"
      />
      <div v-show="'password' in errors">
        {{ errors.password }}
      </div>
    </div>
    <div>
      <input type="submit" />
    </div>
  </form>
</template>
```

## Examples

- [Validate With Valibot](https://stackblitz.com/edit/vorms-validate-with-valibot?file=src%2FApp.vue)
- [Validate With Yup](https://stackblitz.com/edit/vorms-validate-with-yup?file=src%2FApp.vue)
- [Validate With Zod](https://stackblitz.com/edit/vorms-validate-with-zod?file=src%2FApp.vue)

## Credits

API inspired by [React Hook Form - Resolvers](https://github.com/react-hook-form/resolvers)
