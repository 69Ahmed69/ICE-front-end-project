<script setup>
import { reactive, defineProps, onMounted } from 'vue'
import CourseListing from './course listings/CourseListing3.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import axios from 'axios'

defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
})

const state = reactive({
  courses: [],
  isLoading: true,
})

// Helper function to simulate delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  try {
    // Simulated lag
    await delay(5000)
    const response = await axios.get('/api/courses')
    state.courses = response.data
  } catch (error) {
    console.error('Error fetching courses: ', error)
  } finally {
    state.isLoading = false
  }
})
const colors = [
  { bg_color: 'bg-secondary_trans', icon_color: 'text-secondary' },
  { bg_color: 'bg-success_trans', icon_color: 'text-success' },
  { bg_color: 'bg-warning_trans', icon_color: 'text-warning' },
  { bg_color: 'bg-danger_trans', icon_color: 'text-danger' },
  { bg_color: 'bg-fourth', icon_color: 'text-primary' },
  { bg_color: 'bg-purple-200', icon_color: 'text-purple-900' },
]
</script>

<template>
  <section class="bg-white px-10 py-20">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-primary font-bold text-font mb-6 text-center">
        Best Selling Courses.
      </h2>
      <!-- Show the loading animation while loading -->
      <div v-if="state.isLoading">
        <LoadingAnimation />
      </div>
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto px-4"
      >
        <CourseListing
          v-for="(course, i) in state.courses.slice(0, limit || state.courses.length)"
          :index="i"
          :course="course"
          :category_bg="colors[i % colors.length].bg_color"
          :category_text="colors[i % colors.length].icon_color"
        />
      </div>
    </div>
  </section>
</template>
