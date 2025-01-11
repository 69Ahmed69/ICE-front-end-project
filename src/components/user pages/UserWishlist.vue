<script setup>
import CourseListingBox from '../course listings/CourseListingBox.vue'
import { reactive, onMounted } from 'vue'
import LoadingAnimation from '../LoadingAnimation.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()

const state = reactive({
  courses: [],
  instructors: [],
  isLoading: true,
})

onMounted(async () => {
  try {
    // Fetch courses in the shopping cart
    const fetchedCourses = []
    for (const courseId of userStore.user.wishlist) {
      const response = await axios.get(`/api/courses/${courseId}`)
      fetchedCourses.push(response.data)
    }
    state.courses = fetchedCourses
  } catch (error) {
    console.error('Error fetching courses: ', error)
    toast.error('Failed to fetch course details')
  }

  try {
    // Fetch instructors, avoiding duplicates
    const fetchedInstructors = []
    const fetchedInstructorIds = new Set() // Track fetched instructor IDs

    for (const course of state.courses) {
      const instructorId = course.instructor
      if (!fetchedInstructorIds.has(instructorId)) {
        const response = await axios.get(`/api/instructors/${instructorId}`)
        fetchedInstructors.push(response.data)
        fetchedInstructorIds.add(instructorId) // Mark this instructor as fetched
      }
    }
    state.instructors = fetchedInstructors
  } catch (error) {
    console.error('Error fetching instructors: ', error)
    toast.error('Failed to fetch instructor details')
  } finally {
    state.isLoading = false
  }
})
</script>

<template>
  <section class="flex flex-col space-y-2 lg:space-y-4 mb-4 lg:mb-6">
    <div class="p-4 space-y-2 lg:space-y-4">
      <h2 class="font-primary text-font font-semibold text-base lg:text-xl">
        Wishlist ({{ state.courses.length }})
      </h2>
      <CourseListingBox
        v-if="!state.isLoading"
        :courses="state.courses"
        :instructors="state.instructors"
        type="wishlist"
      />
      <div v-else>
        <LoadingAnimation />
      </div>
    </div>
  </section>
</template>
