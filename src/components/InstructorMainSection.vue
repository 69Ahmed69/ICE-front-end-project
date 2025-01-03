<script setup>
import { reactive, onMounted } from 'vue'
import InstructorFeedBack from './FeedBackSection.vue'
import CourseListing from '@/components/course listings/CourseListing4.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const route = useRoute()
const toast = useToast()
const instructorId = Number(route.params.id)

defineProps({
  courses: {
    type: Array,
    required: true,
  },
  instructor: {
    type: Object,
    required: true,
  },
})

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const state = reactive({
  reviews: [],
  isLoading: true,
  showFullDescription: false,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  try {
    await delay(10)
    const reviewResponse = await axios.get(`/api/reviews/`)
    const allReviews = reviewResponse.data
    state.reviews = allReviews.filter(
      (review) => review.isCourse === 0 && review.subjectId === instructorId,
    )
  } catch (error) {
    console.error('Error fetching review: ', error)
    toast.error('Failed to fetch review details')
    router.push('/404')
  } finally {
    state.isLoading = false
  }
})

const removeEmptyReviews = (reviews) => {
  return reviews.filter((review) => review.content.trim() != '')
}
</script>

<template>
  <section
    class="flex flex-col my-2 mb-6 lg:mr-36 space-y-6 mx-6 lg:space-y-12 lg:w-6/12 bg-background rounded-3xl"
  >
    <div class="flex rounded-t-3xl border-2 border-tertiary text-gray_1 text-sans">
      <button
        class="flex-1 rounded-tl-3xl p-4 font-medium hover:text-font hover:bg-fourth text-center"
        @click="scrollTo('courses')"
      >
        Courses
      </button>
      <button
        class="flex-1 rounded-tr-3xl p-4 font-medium hover:bg-fourth hover:text-font text-center"
        @click="scrollTo('reviews')"
      >
        Reviews
      </button>
    </div>
    <div id="courses" class="px-6 lg:px-12">
      <h2 class="font-bold font-primary text-lg text-font lg:text-2xl">
        {{ instructor.firstName }}'s Courses
      </h2>
      <div
        v-if="courses === undefined || courses.length == 0"
        class="flex items-center justify-center p-4"
      >
        <span class="text-base lg:text-xl text-gray_2 font-medium"
          >This instructor is still cooking...</span
        >
      </div>
      <div v-else class="gap-2 py-4 grid grid-cols-1 lg:grid-cols-2 2xl:gird-cols-3">
        <CourseListing
          v-for="(course, i) in courses"
          :key="i"
          :index="i"
          :course="course"
          category_bg="bg-secondary_trans"
          category_text="text-secondary"
        />
      </div>
    </div>
    <InstructorFeedBack
      id="reviews"
      :reviews="removeEmptyReviews(state.reviews)"
      class="px-6 lg:px-12 pb-4 lg:pb-8"
    />
  </section>
</template>
