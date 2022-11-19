<script setup lang="ts">
import { onMounted, ref } from 'vue';
import stackblitz from '@stackblitz/sdk'

interface StackblitzEmbedProps {
  projectId: string
}

const props = defineProps<StackblitzEmbedProps>()

const rootRef = ref<HTMLElement>()

onMounted(() => {
  if(!rootRef.value) return
  stackblitz.embedProjectId(rootRef.value, props.projectId, {
    openFile: 'src/App.vue',
    view: 'preview',
    clickToLoad: true,
    height: 520,
  })
})
</script>

<template>
  <div ref="rootRef" />
</template>
