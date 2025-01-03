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
  title: {
    type: String,
    defualt: 'Best Sellig Courses',
  },
  titlePosition: {
    type: String,
    defualt: 'center',
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
    await delay(1000)
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
  <section class="px-6 lg:px-16 py-6 lg:pb-16">
    <h2
      :class="[
        'text-xl lg:text-3xl font-primary font-bold text-font mb-6',
        { 'text-left': titlePosition == 'left' },
        { 'text-right': titlePosition == 'right' },
        { 'text-center': titlePosition == 'center' },
      ]"
    >
      {{ title }}
    </h2>
    <div v-if="state.isLoading">
      <LoadingAnimation />
    </div>
    <div
      v-else
      class="gap-6 lg:py-4 lg:px-20 lg:grid lg:grid-cols-4 lg:place-items-center lg:overflow-x-auto flex flex-nowrap justify-center items-center overflow-x-scroll"
    >
      <CourseListing
        v-for="(course, i) in state.courses.slice(0, limit || state.courses.length)"
        :key="i"
        :index="i"
        :course="course"
        :category_bg="colors[i % colors.length].bg_color"
        :category_text="colors[i % colors.length].icon_color"
      />
    </div>
  </section>
</template>
