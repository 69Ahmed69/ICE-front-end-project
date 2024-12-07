<script setup>
import BackToTheTop from './components/ui elements/BackToTheTop.vue'
import { RouterView } from 'vue-router'
import { usePrefrencesStore } from '@/stores/user'

const preferncesStore = usePrefrencesStore()

const lang = sessionStorage.getItem('lang')
if (!lang) {
  lang == 'English'
} else {
  preferncesStore.setLanguage(lang)
}
const curr = sessionStorage.getItem('curr')
if (!curr) {
  curr == 'USD'
} else {
  preferncesStore.setCurrency(curr)
}
</script>

<template>
  <RouterView />
</template>
<style scoped></style>
