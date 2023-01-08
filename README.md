<p align="center">
<a href="https://github.com/Mini-ghost/vorms"><img src="https://raw.githubusercontent.com/Mini-ghost/vorms/main/docs/public/logo.svg" alt="Vorms - Vue Form Validation with Composition API" width="240">
</a>
<br>
Vue Form Validation with Composition API
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@vorms/core" target="__blank"><img src="https://img.shields.io/npm/v/@vorms/core/rc?color=34A88C&label=" alt="NPM version"></a>
<a href="https://vorms.mini-ghost.dev/" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs&color=3D957F" alt="Documentations"></a>
<a href="https://www.npmjs.com/package/@vorms/core" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vorms/core?color=00629E&label="></a>
<br>
<a href="https://github.com//Mini-ghost/vorms" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/Mini-ghost/vorms?style=social"></a>
</p>

## Feature

- **Type Strong**: Written in TypeScript, with TSDoc.
- **[Lightweight](https://bundlephobia.com/package/@vorms/core@1.0.0-rc.2)**: Only 12kb compressed (4kb compressed + gzip compressed) and fully tree-shaking.
- **Easiest**: Vorm uses the [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) to give you a very seamless development experience.
- **Flexible**: [Yup](https://github.com/jquense/yup), [Zod](https://github.com/colinhacks/zod) and self-def validation are supported.

## Install

```bash
npm install @vorms/core@rc
```

## CDN

```html
<script src="https://unpkg.com/@vorms/core"></script>
```

It will be exposed to global as `window.Vorms`

## Usage

**setup script**

```ts
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
```

**template**

```html
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
```

Refer [documentations](https://vorms.mini-ghost.dev/) for more details.

## Examples

- [Login](https://stackblitz.com/edit/vorms-login?file=src%2FApp.vue)
- [Field Array](https://stackblitz.com/edit/vorms-field-array?file=src%2FApp.vue)
- [Cross Field Validate](https://stackblitz.com/edit/vorms-corss-field-validate?file=src%2FApp.vue)
- [Wizard Form](https://stackblitz.com/edit/vorms-wizard-form?file=src%2FApp.vue)
- [Custom Components](https://stackblitz.com/edit/vorms-custom-components?file=src%2FApp.vue)
- [UI Library - Vuetify](https://stackblitz.com/edit/vorms-vuetify?file=src%2FApp.vue)
- [UI Library - Element Plus](https://stackblitz.com/edit/vorms-with-element-plus?file=src%2FApp.vue)
- [Validate With Yup](https://stackblitz.com/edit/vorms-validate-with-yup?file=src%2FApp.vue)
- [Validate With Zod](https://stackblitz.com/edit/vorms-validate-with-zod?file=src%2FApp.vue)

## Thanks

This project is heavily inspired by the following awesome projects.

- [Formik](https://github.com/jaredpalmer/formik)
- [React Hook Form](https://github.com/react-hook-form/react-hook-form)
- [VeeValidate](https://github.com/logaretm/vee-validate)

## Contribution

Thanks to the wonderful people who have already contributed to vorms!

<a href="https://github.com/mini-ghost/vorms/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mini-ghost/vorms" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## License

[MIT License](https://github.com/Mini-ghost/vorms/blob/main/LICENSE) © 2022-PRESENT [Alex Liu](https://github.com/Mini-ghost)
