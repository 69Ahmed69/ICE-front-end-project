<script setup>
import { reactive, defineProps, onMounted, computed } from 'vue'
import CourseListing from './course listings/CourseListing2.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import axios from 'axios'

// Define props
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
    await delay(2000)
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

// Access limit through props
const topCourses = computed(() => {
  return [...state.courses].sort((a, b) => b.students - a.students).slice(0, props.limit)
})
</script>

<template>
  <section class="bg-white px-10 py-20 border-2 mx-24 border-tertiary rounded-3xl">
    <div class="container-xl lg:container m-auto">
      <div class="px-10 flex flex-wrap justify-between items-center">
        <h2 class="text-3xl font-primary font-bold text-font mb-6 text-center">
          Our Feature Courses
        </h2>
        <p class="text-xl font-medium text-gray_2 mb-6 text-center">
          Our most recommended courses, these are sure to be the best bank for your buck.
        </p>
      </div>
      <div v-if="state.isLoading">
        <LoadingAnimation />
      </div>
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-7xl mx-auto px-4"
      >
        <CourseListing
          v-for="(course, i) in topCourses"
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
