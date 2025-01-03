<script setup>
import { useUserStore } from '@/stores/user'
import {
  PlayCircleIcon,
  ClipboardDocumentCheckIcon,
  TrophyIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/24/outline'
import CourseListing from '../course listings/CourseListing5.vue'
import { ref } from 'vue'

const userStore = useUserStore()

defineProps({
  courses: Array,
  instructors: Number,
})

function countCompletedCourses(courses) {
  let count = 0
  for (const course of courses) {
    if (course.completion == 100) count++
  }
  return count
}

function checkCompletion(course) {
  for (const ownedCourse of userStore.user.ownedCourses) {
    if (course.id == ownedCourse.courseId) {
      return ownedCourse.completion
    }
  }
}

const courseContainer = ref(null)

const scrollLeft = () => {
  courseContainer.value.scrollBy({ left: -408, behavior: 'smooth' }) // Adjust scroll amount
}

const scrollRight = () => {
  courseContainer.value.scrollBy({ left: 408, behavior: 'smooth' }) // Adjust scroll amount
}
</script>

<template>
  <section class="flex flex-col space-y-2 lg:space-y-4 mb-4 lg:mb-6">
    <div class="p-4 rounded-3xl shadow-lg bg-background space-y-2 lg:space-y-4">
      <h2 class="font-primary text-font font-semibold text-base lg:text-xl">Dashboard</h2>
      <div class="flex flex-wrap justify-between gap-2 lg:gap-4">
        <div
          class="flex items-center lg:flex-row gap-2 lg:gap-4 bg-fourth rounded-3xl p-3 flex-1 basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-1rem)]"
        >
          <div
            class="flex items-center justify-center p-2 size-12 lg:p-4 lg:size-16 rounded-full bg-white"
          >
            <PlayCircleIcon class="size-10 text-primary" />
          </div>
          <div class="flex flex-col">
            <h2 class="font-primary font-bold text-gray_1 text-lg lg:text-xl">
              {{ courses.length }}
            </h2>
            <p class="font-sans text-gray_2 text-xs lg:text-sm">Enrolled Courses</p>
          </div>
        </div>
        <div
          class="flex items-center lg:flex-row gap-2 lg:gap-4 bg-secondary_trans rounded-3xl p-3 flex-1 basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-1rem)]"
        >
          <div
            class="flex items-center justify-center p-2 size-12 lg:p-4 lg:size-16 rounded-full bg-white"
          >
            <ClipboardDocumentCheckIcon class="size-10 text-secondary" />
          </div>
          <div class="flex flex-col">
            <h2 class="font-primary font-bold text-gray_1 text-lg lg:text-xl">
              {{ courses.length }}
            </h2>
            <p class="font-sans text-gray_2 text-xs lg:text-sm">Active Courses</p>
          </div>
        </div>
        <div
          class="flex items-center lg:flex-row gap-2 lg:gap-4 bg-success_trans rounded-3xl p-3 flex-1 basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-1rem)]"
        >
          <div
            class="flex items-center justify-center p-2 size-12 lg:p-4 lg:size-16 rounded-full bg-white"
          >
            <TrophyIcon class="size-10 text-success" />
          </div>
          <div class="flex flex-col">
            <h2 class="font-primary font-bold text-gray_1 text-lg lg:text-xl">
              {{ countCompletedCourses(courses) }}
            </h2>
            <p class="font-sans text-gray_2 text-xs lg:text-sm">Completed Courses</p>
          </div>
        </div>
        <div
          class="flex items-center lg:flex-row gap-2 lg:gap-4 bg-warning_trans rounded-3xl p-3 flex-1 basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-1rem)]"
        >
          <div
            class="flex items-center justify-center p-2 size-12 lg:p-4 lg:size-16 rounded-full bg-white"
          >
            <UserIcon class="size-10 text-warning" />
          </div>
          <div class="flex flex-col">
            <h2 class="font-primary font-bold text-gray_1 text-lg lg:text-xl">
              {{ instructors }}
            </h2>
            <p class="font-sans text-gray_2 text-xs lg:text-sm">Course Instructors</p>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 rounded-3xl shadow-lg bg-background space-y-2 lg:space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="font-primary text-font font-semibold text-base lg:text-xl">
          Let's keep learning, {{ userStore.user.firstName }}!!
        </h2>
        <div class="flex gap-2">
          <button
            class="flex justify-center items-center size-6 p-1 lg:size-10 lg:p-2 bg-primary text-white rounded-full shadow hover:bg-primary-dark hover:shadow-xl transition-shadow duration-200 ease-in"
            @click="scrollLeft"
          >
            <ArrowLeftIcon class="text-white size-4 lg:size-6" />
          </button>
          <button
            class="flex justify-center items-center size-6 p-1 lg:size-10 lg:p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary-dark hover:shadow-xl transition-shadow duration-200 ease-in"
            @click="scrollRight"
          >
            <ArrowRightIcon class="text-white size-4 lg:size-6" />
          </button>
        </div>
      </div>
      <div ref="courseContainer" class="flex py-2 flex-nowrap gap-6 overflow-hidden no-scroll">
        <CourseListing
          v-for="course in courses"
          :key="course.id"
          :course="course"
          :completion="checkCompletion(course)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.no-scroll {
  overflow: hidden; /* Completely hides the scrollbar */
}
</style>
