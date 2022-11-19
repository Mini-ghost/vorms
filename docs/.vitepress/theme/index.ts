import DefaultTheme from 'vitepress/theme'

// @ts-expect-error
import StackblitzEmbed from './components/StackblitzEmbed.vue'

import './styles/vars.css'
import './styles/main.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: any) {
    ctx.app.component('StackblitzEmbed', StackblitzEmbed)
  }
}

