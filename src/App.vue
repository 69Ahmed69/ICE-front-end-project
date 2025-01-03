<script setup>
import { RouterView } from 'vue-router'
import { usePrefrencesStore } from '@/stores/user'

const preferencesStore = usePrefrencesStore()

const lang = sessionStorage.getItem('lang')
preferencesStore.setLanguage(lang || 'English')

const curr = sessionStorage.getItem('curr')
preferencesStore.setCurrency(curr || 'USD')
</script>

<template>
  <RouterView />
</template>
