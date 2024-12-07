<script setup>
import { reactive, defineProps, onMounted, computed } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import InstructorCard from './instructor cards/InstructorCard.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import axios from 'axios'

const props = defineProps({
  limit: {
    type: Number,
    default: 5,
  },
})

const state = reactive({
  instructors: [],
  isLoading: true,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  try {
    await delay(10)
    const response = await axios.get('/api/instructors')
    state.instructors = response.data
  } catch (error) {
    console.error('Error fetching instructors: ', error)
  } finally {
    state.isLoading = false
  }
})
const bestInstructors = computed(() => {
  return [...state.instructors].sort((a, b) => b.rating - a.rating).slice(0, props.limit)
})
</script>

<template>
  <section class="bg-white py-4 lg:pb-12 gap-4 rounded-3xl px-8 lg:px-16">
    <div class="flex flex-wrap flex-col justify-center items-center">
      <h2 class="text-xl lg:text-3xl font-primary font-bold text-font mb-12 text-center">
        Instructors of the Month
      </h2>
      <div v-if="state.isLoading">
        <LoadingAnimation />
      </div>
      <div
        v-else
        class="flex flex-nowrap overflow-scroll lg:overflow-visible lg:flex-wrap max-w-80 lg:max-w-full gap-6 justify-center"
      >
        <InstructorCard
          v-for="(instructor, i) in bestInstructors"
          :key="instructor.id"
          :index="i"
          :instructor="instructor"
          class="h-full"
        />
      </div>
      <div
        class="text-gray_2 text-center lg:text-start gap-2 lg:text-base text-sm flex flex-wrap font-medium font-sans justify-center items-center mt-12"
      >
        <p>Millions of students are waiting for an instructor. Start Teaching & Earning Now!</p>
        <RouterLink to="/become-an-instructor" class="flex items-center gap-1">
          <p class="text-primary">Become an Instructor</p>
          <ArrowRightIcon class="w-6 h-6 text-primary" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
