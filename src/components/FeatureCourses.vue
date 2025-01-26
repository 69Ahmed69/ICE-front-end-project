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
  categories: {},
  instructorsById: {},
  isLoading: true,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchInstructors = async (courses) => {
  const instructorPromises = courses.map(async (course) => {
    try {
      const response = await axios.get(`/api/instructors/${course.instructor}`)
      return { id: course.id, instructor: response.data }
    } catch (error) {
      console.error(`Error fetching instructor for course ${course.id}: `, error)
      return { id: course.id, instructor: null }
    }
  })
  const instructorResults = await Promise.all(instructorPromises)
  // Map instructors by course ID
  instructorResults.forEach(({ id, instructor }) => {
    state.instructorsById[id] = instructor
  })
}

const fetchCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/api/categories/${categoryId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching category: ', error)
    return null
  }
}

onMounted(async () => {
  try {
    await delay(2000)
    const response = await axios.get('/api/courses?experimental_ne=true')
    state.courses = response.data

    await fetchInstructors(state.courses)

    // Fetch categories for each course
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

const topCourses = computed(() => {
  return [...state.courses].sort((a, b) => b.students - a.students).slice(0, props.limit)
})
</script>

<template>
  <section
    class="bg-white justify-center items-center flex-col px-8 lg:px-2 py-6 lg:py-12 border-2 lg:mx-36 border-tertiary rounded-3xl"
  >
    <div class="px-10 flex flex-wrap justify-center items-center">
      <h2 class="text-xl lg:text-3xl font-primary font-bold text-font mb-6 text-center">
        Our Feature Courses
      </h2>
    </div>
    <div v-if="state.isLoading">
      <LoadingAnimation />
    </div>
    <div
      v-else
      class="flex flex-nowrap overflow-x-auto lg:overflow-visible lg:flex-wrap lg:max-w-full gap-6 justify-center items-center"
      style="padding: 0 1rem; min-width: 100%"
    >
      <CourseListing
        v-for="course in topCourses"
        :key="course.id"
        :instructor="state.instructorsById[course.id]"
        :course="course"
        :category="state.categories[course.category]"
        class="h-full"
      />
    </div>
  </section>
</template>
