<script setup>
import { defineProps } from 'vue'
import IceButton from './ui elements/IceButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Learn With Experts<br>Anytime, Anywhere.',
  },
  subtitle: {
    type: String,
    default:
      'Our mission is to help people to find the best course<br>and learn with an expert, anytime, anywhere.',
  },
})
</script>

<template>
  <section class="bg-gray_4 text-font pt-36">
    <div class="mt-18 flex justify-between items-center pl-32 max-w-8xl mx-auto max-h-full">
      <!-- Left: Text and Button -->
      <div class="flex-1 pr-0 space-y-10">
        <h1
          class="text-4xl text-left text-font font-primary font-extrabold sm:text-5xl md:text-6xl"
          v-html="title"
        ></h1>
        <p class="my-4 text-xl text-left text-gray_2 font-sans font-medium" v-html="subtitle"></p>
        <IceButton text="Create an Account" :priority="1" :size="2" />
      </div>

      <!-- Right: Image -->
      <div class="flex-1 flex justify-end">
        <img class="max-w-full max-h-full object-contain" src="../assets/img/hero.png" alt="Hero" />
      </div>
    </div>
  </section>
</template>
