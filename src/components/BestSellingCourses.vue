<script setup>
import { reactive, defineProps, onMounted } from 'vue'
import CourseListing from './course listings/CourseListing3.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import axios from 'axios'

const props = defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Best Selling Courses',
  },
  titlePosition: {
    type: String,
    default: 'center',
  },
  perRow: {
    type: Number,
    default: 4,
  },
  category: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  courses: [],
  categories: {}, // Store fetched categories here
  isLoading: true,
})

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
    state.isLoading = true

    // Fetch courses based on category
    const response = props.category
      ? await axios.get(`/api/courses?category=${props.category.id}`)
      : await axios.get('/api/courses?experimental_ne=true')

    state.courses = response.data

    // Fetch categories for each course
    if (!props.category) {
      const categoryPromises = state.courses.map(async (course) => {
        if (!state.categories[course.category]) {
          const category = await fetchCategory(course.category)
          if (category) {
            state.categories[course.category] = category
          }
        }
      })
      await Promise.all(categoryPromises)
    }
  } catch (error) {
    console.error('Error fetching courses: ', error)
  } finally {
    state.isLoading = false
  }
})
</script>

<template>
  <section class="px-6 lg:px-16 py-6 lg:pb-16">
    <!-- Title -->
    <h2
      :class="[
        'text-xl lg:text-3xl font-primary font-bold text-font mb-6',
        { 'text-left': props.titlePosition === 'left' },
        { 'text-right': props.titlePosition === 'right' },
        { 'text-center': props.titlePosition === 'center' },
      ]"
    >
      {{ props.title }}
    </h2>

    <!-- Loading Animation -->
    <div v-if="state.isLoading">
      <LoadingAnimation />
    </div>

    <!-- Course Listings -->
    <div
      v-else
      :class="[
        'lg:py-4 lg:px-20 lg:grid lg:place-items-center lg:overflow-x-auto flex flex-nowrap justify-center items-center overflow-x-scroll',
        props.perRow === 5 ? 'gap-2 lg:grid-cols-5' : 'gap-6 lg:grid-cols-4',
      ]"
    >
      <CourseListing
        v-for="(course, i) in state.courses.slice(0, props.limit || state.courses.length)"
        :key="i"
        :course="course"
        :category="!props.category ? state.categories[course.category] : props.category"
      />
    </div>
  </section>
</template>
