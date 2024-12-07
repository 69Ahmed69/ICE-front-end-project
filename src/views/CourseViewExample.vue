<script setup>
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import { reactive, onMounted } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import axios from 'axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const courseId = route.params.id

const state = reactive({
  course: {},
  isLoading: true,
})

const deletecourse = async () => {
  const confirm = window.confirm('Are you sure you want to delete this course?')
  if (confirm) {
    try {
      await axios.delete(`/api/courses/${courseId}`)
      toast.success('course Deleted Successfully')
      router.push('/courses')
    } catch (error) {
      console.error('Error deleting course: ', error)
      toast.error('course not deleted.')
    }
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  try {
    // Simulated lag
    await delay(10)
    const response = await axios.get(`/api/courses/${courseId}`)
    state.course = response.data
  } catch (error) {
    console.error('Error fetching course: ', error)
  } finally {
    state.isLoading = false
  }
})
</script>

<template>
  <BackButton />
  <section v-if="!state.isLoading" class="bg-green-50">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <main>
          <div class="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
            <div class="text-gray-500 mb-4">{{ state.course.type }}</div>
            <h1 class="text-3xl font-bold mb-4">{{ state.course.title }}</h1>
            <div class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
              <i class="pi pi-map-marker text-orange-700 mr-2"></i>
              <p class="text-orange-700">{{ state.course.location }}</p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-green-800 text-lg font-bold mb-6">course Description</h3>

            <p class="mb-4">
              {{ state.course.description }}
            </p>

            <h3 class="text-green-800 text-lg font-bold mb-2">Salary</h3>

            <p class="mb-4">{{ state.course.salary }} / Year</p>
          </div>
        </main>

        <!-- Sidebar -->
        <aside>
          <!-- Company Info -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-6">Company Info</h3>

            <h2 class="text-2xl">{{ state.course.company.name }}</h2>

            <p class="my-2">
              {{ state.course.company.description }}
            </p>

            <hr class="my-4" />

            <h3 class="text-xl">Contact Email:</h3>

            <p class="my-2 bg-green-100 p-2 font-bold">{{ state.course.company.contactEmail }}</p>

            <h3 class="text-xl">Contact Phone:</h3>

            <p class="my-2 bg-green-100 p-2 font-bold">{{ state.course.company.contactPhone }}</p>
          </div>

          <!-- Manage -->
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-6">Manage course</h3>
            <RouterLink
              :to="`/courses/edit/${state.course.id}`"
              class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              >Edit course</RouterLink
            >
            <button
              @click="deletecourse"
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Delete course
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>
  <div v-else>
    <LoadingAnimation />
  </div>
</template>
