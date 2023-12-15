import { defineConfig } from 'vitepress'
import enConfig from './theme/config/en'
import zhTWConfig from './theme/config/zh-tw'

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

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: enConfig
    },
    'zh-tw': {
      label: '繁體中文',
      lang: 'zh-tw',
      link: '/zh-tw/',
      themeConfig: zhTWConfig
    }
  },

  themeConfig: {
    logo: '/favicon.svg',

    editLink: {
      pattern: 'https://github.com/Mini-ghost/vorms/tree/docs/docs/:path'
    },


    socialLinks: [
      { icon: 'github', link: 'https://github.com/Mini-ghost/vorms' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Alex Liu'
    },
  }
})
