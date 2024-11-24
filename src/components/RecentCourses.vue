<script setup>
import { reactive, defineProps, onMounted, computed } from 'vue'
import CourseListing from './course listings/CourseListing1.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import axios from 'axios'

const props = defineProps({
  limit: {
    type: Number,
    default: 4,
  },
})

const state = reactive({
  courses: [],
  isLoading: true,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  try {
    // Simulated lag
    await delay(3000)
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

const recentCourses = computed(() => {
  return [...state.courses]
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, props.limit)
})
</script>

<template>
  <section class="bg-white px-10 py-20 gap-4 mx-24 rounded-3xl">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-4xl font-primary font-bold text-font mb-12 text-center">
        Recently added courses.
      </h2>
      <div v-if="state.isLoading">
        <LoadingAnimation />
      </div>
      <div
        v-else
        class="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4"
      >
        <CourseListing
          v-for="(course, i) in recentCourses"
          :key="course.id"
          :index="i"
          :course="course"
          :category_bg="colors[i % colors.length].bg_color"
          :category_text="colors[i % colors.length].icon_color"
          class="h-full"
        />
      </div>
    </div>
  </section>
</template>
