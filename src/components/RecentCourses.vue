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
  title: {
    type: String,
    defualt: 'Recently Added Courses',
  },
  titlePosition: {
    type: String,
    defualt: 'center',
  },
})

const state = reactive({
  courses: [],
  instructors: [],
  categories: {},
  isLoading: true,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchInstructors = async (courses) => {
  const instructorPromises = courses.map(async (course) => {
    try {
      const response = await axios.get(`/api/instructors/${course.instructor}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching instructor for course ${course.id}: `, error)
      return null
    }
  })
  return Promise.all(instructorPromises)
}

const fetchCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/api/categories/${categoryId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching category: ', error)
    toast.error('Failed to fetch category details')
    return null
  }
}

onMounted(async () => {
  try {
    await delay(3000)
    const response = await axios.get('/api/courses?experimental_ne=true')
    state.courses = response.data

    state.instructors = await fetchInstructors(state.courses)

    const categoryPromises = state.courses.map(async (course) => {
      const category = await fetchCategory(course.category)
      state.categories[course.category] = category
    })

    await Promise.all(categoryPromises)
  } catch (error) {
    console.error('Error fetching courses: ', error)
  } finally {
    state.isLoading = false
  }
})

const recentCourses = computed(() => {
  return [...state.courses]
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, props.limit)
})

const findInstructor = (targetId) => {
  return state.instructors.find((instructor) => instructor.id == targetId)
}
</script>

<template>
  <section class="px-8 lg:px-20 py-8 lg:py-16 rounded-3xl">
    <h2
      :class="[
        'text-xl lg:text-3xl font-primary font-bold text-font mb-6',
        { 'text-left': props.titlePosition == 'left' },
        { 'text-right': props.titlePosition == 'right' },
        { 'text-center': props.titlePosition == 'center' },
      ]"
    >
      {{ props.title }}
    </h2>
    <div v-if="state.isLoading">
      <LoadingAnimation />
    </div>
    <div v-else class="flex flex-wrap justify-center gap-6 px-4">
      <CourseListing
        v-for="(course, i) in recentCourses"
        :key="course.id"
        :course="course"
        :instructor="findInstructor(course.instructor)"
        :category="state.categories[course.category]"
        class="h-full"
      />
    </div>
  </section>
</template>
