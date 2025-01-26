<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="text-center flex flex-col justify-center items-center h-96">
    <i class="pi pi-exclamation-triangle text-warning text-7xl mb-5"></i>
    <h1 class="text-6xl font-bold mb-4 font-primary text-font">404 Not Found</h1>
    <p class="text-xl mb-5">This page does not exist</p>
    <RouterLink
      to="/"
      class="text-white bg-primary hover:bg-secondary rounded-3xl px-3 py-2 mt-4 hover:shadow-xl"
      >Go Back</RouterLink
    >
  </section>
</template>
