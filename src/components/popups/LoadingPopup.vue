<script setup>
import LoadingAnimation from '../LoadingAnimation.vue'

defineProps({
  text: String,
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-background shadow-xl rounded-3xl flex flex-col p-5 gap-2">
      <LoadingAnimation />
      <p class="text-center font-primary font-medium text-sm lg:text-lg text-font">{{ text }}</p>
    </div>
  </div>
</template>
