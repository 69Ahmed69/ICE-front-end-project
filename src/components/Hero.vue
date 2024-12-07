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
      'Our mission is to help people find the best course<br>and learn with an expert, anytime, anywhere.',
  },
})
</script>

<template>
  <section class="bg-gray_4 text-font">
    <div class="flex flex-col lg:flex-row justify-between items-center">
      <!-- Left: Text and Button -->
      <div class="flex-1 pl-10 pr-0 space-y-6 lg:pl-36 pt-10 lg:pt-0">
        <h1
          class="lg:text-5xl text-4xl text-left text-font font-primary font-semibold md:text-4xl"
          v-html="title"
        ></h1>
        <p class="my-4 text-base text-left text-gray_2 font-sans font-medium" v-html="subtitle"></p>
        <IceButton text="Create an Account" :priority="1" :size="2" />
      </div>

      <!-- Right: Image -->
      <div class="flex-1 flex pt-6 lg:pt-0">
        <img class="block max-w-full object-contain" src="../assets/img/hero.png" alt="Hero" />
      </div>
    </div>
  </section>
</template>
