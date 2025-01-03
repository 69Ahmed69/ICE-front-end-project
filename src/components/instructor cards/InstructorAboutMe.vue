<script setup>
defineProps({
  instructor: Object,
})
</script>

<template>
  <div
    class="flex space-y-2 flex-col p-6 mx-6 lg:mx-0 lg:ml-36 my-2 lg:mb-6 bg-background rounded-3xl border-2 border-tertiary shadow-lg lg:z-50 ease-in duration-500 hover:shadow-xl transition-shadow"
  >
    <h2 class="font-primary text-lg lg:text-xl font-bold text-font">About Me</h2>
    <p class="font-sans text-sm lg:text-base font-medium text-gray_1">{{ instructor.aboutMe }}</p>
  </div>
</template>
