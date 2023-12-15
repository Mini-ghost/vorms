const guide = [
  {
    text: 'Get Started',
    link: '/zh-tw/guide/',
  },
]
  
const api = [
  {
    text: 'useForm',
    link: '/zh-tw/api/use-form',
  },
  {
    text: 'useField',
    link: '/zh-tw/api/use-field',
  },
  {
    text: 'useFieldArray',
    link: '/zh-tw/api/use-field-array',
  },
  {
    text: 'useFormContext',
    link: '/zh-tw/api/use-form-context',
  },
]

const advanced = [
  {
    text: 'Smart Form Component',
    link: '/zh-tw/advanced/smart-form-component',
  },
]

export default {
  nav: [
    { text: 'Get Started', link: '/zh-tw/guide/', activeMatch: '/guide/' },
    { text: 'API', link: '/zh-tw/api/use-form', activeMatch: '/api/' },
    { text: 'Examples', link: '/zh-tw/examples/', activeMatch: '/examples/' }
  ],

  sidebar: [
    {
      text: 'Guide',
      items: guide
    },
    {
      text: 'API Reference',
      items: api
    },
    {
      text: 'Advanced',
      items: advanced
    }
  ],
}