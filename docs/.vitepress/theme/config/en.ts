const guide = [
  {
    text: 'Get Started',
    link: '/guide/',
  },
]
  
const api = [
  {
    text: 'useForm',
    link: '/api/use-form',
  },
  {
    text: 'useField',
    link: '/api/use-field',
  },
  {
    text: 'useFieldArray',
    link: '/api/use-field-array',
  },
  {
    text: 'useFormContext',
    link: '/api/use-form-context',
  },
]

const advanced = [
  {
    text: 'Smart Form Component',
    link: '/advanced/smart-form-component',
  },
]

export default {
  nav: [
    { text: 'Get Started', link: '/guide/', activeMatch: '/guide/' },
    { text: 'API', link: '/api/use-form', activeMatch: '/api/' },
    { text: 'Examples', link: '/examples/', activeMatch: '/examples/' }
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