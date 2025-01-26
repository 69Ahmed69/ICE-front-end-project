<script setup>
import CategoryCard from './CategoryCard.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import { RouterLink } from 'vue-router'
import { reactive, onMounted } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/20/solid'
import axios from 'axios'

const state = reactive({
  categories: [],
  isLoading: true,
})

onMounted(async () => {
  try {
    const response = await axios.get('/api/categories')
    // Sort categories by number of courses in descending order and take the top 12
    state.categories = response.data.sort((a, b) => b.courses - a.courses).slice(0, 12)
  } catch (error) {
    console.error('Error fetching categories: ', error)
  } finally {
    state.isLoading = false
  }
})
</script>

<template>
  <section v-if="!state.isLoading" class="py-10 lg:py-12 px-6 lg:px-32 bg-white">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-xl lg:text-3xl font-primary font-black text-font">Browse Top Categories</h2>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 px-4">
      <CategoryCard
        v-for="(category, index) in state.categories"
        :key="index"
        :category="category"
      />
    </div>
    <div
      class="text-font gap-2 text-sm lg:text-lg flex font-medium font-sans justify-center items-center mt-6 lg:mt-12"
    >
      <p>We have even more categories for you!</p>
      <RouterLink to="/courses/" class="flex items-center gap-1">
        <p class="text-primary">Browse All</p>
        <ArrowRightIcon class="w-4 lg:w-6 text-primary" />
      </RouterLink>
    </div>
  </section>
  <div v-else>
    <LoadingAnimation />
  </div>
</template>
