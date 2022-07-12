import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue Composition Form',
  description: 'Vue form validate with Composition API',

  markdown: {
    theme: 'github-dark-dimmed',
    config(md) {
      // https://github.com/markdown-it/markdown-it/issues/878
      md.linkify.set({
        fuzzyLink: false
      })
    }
  },

  themeConfig: {
    nav: [
      { text: 'Get Started', link: '/guide/', activeMatch: '/guide/' },
      { text: 'API', link: '/api/', activeMatch: '/api/' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Mini-ghost/vue-composition-form' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          {
            text: 'Get Started',
            link: '/guide/'
          },
          {
            text: 'Examples',
            link: '/guide/examples'
          }
        ]
      },
      {
        text: 'API Reference',
        items: [
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
      }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Alex Liu'
    },
  }
})
