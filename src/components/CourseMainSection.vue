<script setup>
import Curriculum from './Curriculum.vue'
import { reactive, onMounted } from 'vue'
import HorizontalInstructorCard from './instructor cards/HorizontalInstructorCard.vue'
import CourseFeedBack from './FeedBackSection.vue'
import RatingPercentage from './RatingPercentage.vue'
import Rating from './Rating.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

import {
  CheckIcon,
  ArrowRightIcon,
  FolderIcon,
  ClockIcon,
  PlayCircleIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const toast = useToast()
const courseId = Number(route.params.id)

defineProps({
  course: {
    type: Object,
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

const beautifyDescription = (description) => {
  return description.replace(/\n/g, '<br>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
}

const state = reactive({
  reviews: [],
  isLoading: true,
  showFullDescription: false,
})

const maxChars = 400

const truncateDescription = (description) => {
  const beautified = beautifyDescription(description)
  if (state.showFullDescription || description.length <= maxChars) {
    return beautified
  }
  return beautifyDescription(description.substring(0, maxChars)) + '...'
}

const toggleReadMore = () => {
  state.showFullDescription = !state.showFullDescription
}

const calculateLectures = (chapters) => {
  let count = 0
  chapters.forEach((chapter) => {
    chapter.files.forEach((file) => {
      if (file.type === 'video') {
        count++
      }
    })
  })
  return count
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  try {
    await delay(10)
    const reviewResponse = await axios.get(`/api/reviews/`)
    const allReviews = reviewResponse.data
    state.reviews = allReviews.filter(
      (review) => review.isCourse === 1 && review.subjectId === courseId,
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
  <section class="flex flex-col space-y-6 p-6 lg:pl-36 lg:space-y-12 lg:w-2/3">
    <div class="bg-background rounded-t-3xl">
      <div>
        <div>
          <video controls class="rounded-t-3xl w-full">
            <source :src="`../../public/videos/${course.introVideo}`" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <!-- <iframe
          class="rounded-t-3xl w-full h-[480px]"
          src="https://www.youtube.com/embed/dCxSsr5xuL8"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe> -->
      </div>
      <div class="flex rounded-3xl border-b-2 border-primary text-gray_1 text-sans">
        <button
          class="flex-1 rounded-bl-3xl p-4 font-medium hover:text-font hover:bg-fourth text-center"
          @click="scrollTo('overview')"
        >
          Overview
        </button>
        <button
          class="flex-1 p-4 font-medium hover:bg-fourth hover:text-font text-center"
          @click="scrollTo('curriculum')"
        >
          Curriculum
        </button>
        <button
          class="flex-1 p-4 font-medium hover:bg-fourth hover:text-font text-center"
          @click="scrollTo('instructor')"
        >
          Instructor
        </button>
        <button
          class="flex-1 rounded-br-3xl p-4 font-medium hover:bg-fourth hover:text-font text-center"
          @click="scrollTo('reviews')"
        >
          Reviews
        </button>
      </div>
    </div>

    <div id="overview" class="flex flex-col space-y-4">
      <h2
        :class="[
          'text-lg lg:text-2xl text-font font-primary font-bold mb-2',
          { 'text-gray_1': !state.showFullDescription },
        ]"
      >
        Description
      </h2>
      <p
        :class="[
          'text-sm lg:text-base text-gray_1 ml-4',
          { 'text-gray_2': !state.showFullDescription },
        ]"
        v-html="truncateDescription(course.description)"
      ></p>

      <div class="flex flex-wrap bg-gray_4 py-4 px-10 rounded-3xl lg:p-10">
        <h2
          :class="[
            'text-base lg:text-xl text-font font-primary font-bold mb-2 lg:mb-4',
            { 'text-gray_1': !state.showFullDescription },
          ]"
        >
          What you will learn in this course
        </h2>
        <ul
          v-if="state.showFullDescription"
          class="text-sm lg:text-base text-wrap text-gray_1 space-y-2"
        >
          <li
            v-for="(item, i) in course.learningPoints"
            :key="i"
            class="flex items-center space-x-2"
          >
            <CheckIcon class="size-4 lg:size-6 text-success" />
            <span>{{ item }}</span>
          </li>
        </ul>
        <ul v-else class="text-sm lg:text-base text-wrap text-gray_3 space-y-2">
          <li class="flex items-center space-x-2">
            <CheckIcon class="size-4 lg:size-6 text-gray_2" />
            <span> {{ course.learningPoints[0] }}...</span>
          </li>
        </ul>
      </div>

      <div v-if="state.showFullDescription">
        <h2
          :class="[
            'text-base lg:text-xl text-font font-primary font-bold mb-2 lg:mb-4',
            { 'text-gray_1': !state.showFullDescription },
          ]"
        >
          Who is this course for
        </h2>
        <ul class="text-sm lg:text-base text-wrap text-gray_1 space-y-4 ml-4 mb-2 lg:mb-4">
          <li v-for="(item, i) in course.whoIsThisFor" :key="i" class="flex items-center space-x-2">
            <ArrowRightIcon class="size-4 lg:size-6 text-primary" />
            <span>{{ item }}</span>
          </li>
        </ul>

        <h2 class="text-base lg:text-xl text-font font-primary font-bold mb-2 lg:mb-4">
          Course requirements
        </h2>
        <ul class="text-sm lg:text-base text-wrap text-gray_1 space-y-4 ml-4">
          <li v-for="(item, i) in course.requirements" :key="i" class="flex items-center space-x-2">
            <span>•</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <button
        v-if="(course?.description?.length || 0) > maxChars"
        @click="toggleReadMore"
        class="text-primary underline mt-2 text-sm lg:text-base"
      >
        {{ state.showFullDescription ? 'Read Less' : 'Read More' }}
      </button>
    </div>
    <div id="curriculum" class="flex flex-col space-y-4">
      <div class="flex justify-between items-center p-2">
        <h2 class="font-bold font-primary text-lg text-font lg:text-2xl">Curriculum</h2>
        <div class="flex items-center gap-3">
          <div class="flex justify-center items-center gap-1">
            <FolderIcon class="size-3 lg:size-5 text-primary" />
            <span class="text-xs lg:text-sm font-medium text-gray_1"
              >{{ course.chapters.length }} Sections</span
            >
          </div>
          <div class="flex justify-center items-center gap-1">
            <PlayCircleIcon class="size-3 lg:size-5 text-secondary" />
            <span class="text-xs lg:text-sm font-medium text-gray_1"
              >{{ calculateLectures(course.chapters) }} Lectures</span
            >
          </div>
          <div class="flex justify-center items-center gap-1">
            <ClockIcon class="size-3 lg:size-5 text-warning" />
            <span class="text-xs lg:text-sm font-medium text-gray_1"
              >{{ course.duration }} Hours</span
            >
          </div>
        </div>
      </div>
      <Curriculum :course="course" />
    </div>

    <div id="instructor" class="flex flex-col space-y-4">
      <h2 class="font-bold font-primary text-lg text-font lg:text-2xl">Course Instructor</h2>
      <HorizontalInstructorCard :instructor="instructor" />
    </div>

    <div id="reviews" class="flex flex-col space-y-4 w-full">
      <h2 class="font-bold font-primary text-lg text-font lg:text-2xl text-center lg:text-left">
        Course Rating
      </h2>
      <div class="flex justify-center items-center gap-4">
        <div
          class="flex flex-col justify-center items-center gap-2 rounded-3xl border-2 border-tertiary p-4 h-48 w-1/3 lg:w-1/4"
        >
          <h1 class="text-font text-3xl lg:text-4xl font-primary font-bold">{{ course.rating }}</h1>
          <Rating :rating="course.rating" :size="2" />
          <h2 class="text-gray_1 text-sm lg:text-base font-primary font-bold">Course Rating</h2>
        </div>
        <div class="w-2/3 lg:3/4">
          <RatingPercentage :reviews="state.reviews" />
        </div>
      </div>
    </div>
    <CourseFeedBack :reviews="removeEmptyReviews(state.reviews)" />
  </section>
</template>
