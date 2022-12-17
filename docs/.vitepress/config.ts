import { defineConfig } from 'vitepress'

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

export default defineConfig({
  title: 'Vorms',
  titleTemplate: 'Vorms - Vue Form Validation with Composition API',
  description: 'Vue Form Validation with Composition API',


  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Alex Liu' }],
    ['meta', { property: 'og:title', content: 'Vorms' }],
    ['meta', { property: 'og:description', content: 'Vue Form Validation with Composition API' }],
    ['meta', { property: 'og:image', content: 'https://vorms.mini-ghost.dev/og.png' }],
    ['meta', { property: 'og:image:alt', content: 'Vorms' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@Minighost_Alex' }],
    ['meta', { name: 'twitter:image', content: 'https://vorms.mini-ghost.dev/og.png' }],
  ],

  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    config(md) {
      // https://github.com/markdown-it/markdown-it/issues/878
      md.linkify.set({
        fuzzyLink: false
      })
    }
  },

  themeConfig: {
    logo: '/favicon.svg',

    editLink: {
      pattern: 'https://github.com/Mini-ghost/vorms/tree/docs/docs/:path'
    },

    nav: [
      { text: 'Get Started', link: '/guide/', activeMatch: '/guide/' },
      { text: 'API', link: '/api/use-form', activeMatch: '/api/' },
      { text: 'Examples', link: '/examples/', activeMatch: '/examples/' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Mini-ghost/vorms' },
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

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Alex Liu'
    },
  }
})
