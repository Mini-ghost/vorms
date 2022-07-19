import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vorms',
  description: 'Vue form validate with Composition API',

  head: [
    ['meta', { name: 'author', content: 'Alex Liu' }],
    ['meta', { property: 'og:title', content: 'Vorms' }],
    // ['meta', { property: 'og:image', content: 'https://vueuse.org/og.png' }],
    ['meta', { property: 'og:description', content: 'Vue Form Validate with Composition API' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@Minighost_Alex' }],
    // ['meta', { name: 'twitter:image', content: 'https://vueuse.org/og.png' }],
  ],

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

    editLink: {
      pattern: 'https://github.com/Mini-ghost/vorms/tree/docs/docs/:path'
    },

    nav: [
      { text: 'Get Started', link: '/guide/', activeMatch: '/guide/' },
      { text: 'API', link: '/api/', activeMatch: '/api/' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Mini-ghost/vorms' },
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
