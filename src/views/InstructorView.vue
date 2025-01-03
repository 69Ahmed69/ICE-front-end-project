<script setup>
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import FooterTop from '@/components/footers/FooterTop.vue'
import FooterBottom from '@/components/footers/FooterBottom.vue'
import InstructorHeader from '@/components/instructor cards/InstructorHeader.vue'
import InstructorAboutMe from '@/components/instructor cards/InstructorAboutMe.vue'
import InstructorMainSection from '@/components/InstructorMainSection.vue'

import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const instructorId = route.params.id

const state = reactive({
  instructor: {},
  isLoading: true,
  courses: [],
})

const fetchCourses = async (courses) => {
  try {
    const fetchedCourses = []
    for (const id of courses) {
      const response = await axios.get(`/api/courses/${id}`)
      fetchedCourses.push(response.data)
    }
    state.courses = fetchedCourses
  } catch (error) {
    console.error('Error fetching courses: ', error)
    toast.error('Failed to fetch courses details')
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  try {
    await delay(300)
    const instructorResponse = await axios.get(`/api/instructors/${instructorId}`)
    state.instructor = instructorResponse.data
    if (state.instructor) {
      await fetchCourses(state.instructor.courses)
    }
  } catch (error) {
    console.error('Error fetching instructor: ', error)
    toast.error('Failed to fetch instructor details')
    router.push('/404')
  } finally {
    state.isLoading = false
  }
})
</script>

<template>
  <NavBarTop />
  <NavBarBottom />
  <section v-if="!state.isLoading">
    <div class="flex flex-wrap bg-gray_4 lg:pt-4 lg:max-h-80">
      <InstructorHeader :instructor="state.instructor" />
    </div>
    <div class="flex flex-col lg:flex-row bg-gray_4 lg:items-start">
      <InstructorAboutMe :instructor="state.instructor" class="lg:w-4/12" />
      <InstructorMainSection
        :courses="state.courses"
        :instructor="state.instructor"
        class="lg:w-8/12"
      />
    </div>
    <div class="bg-gray_4">
      <FooterTop />
      <FooterBottom />
    </div>
  </section>
  <div v-else>
    <LoadingAnimation />
  </div>
</template>
