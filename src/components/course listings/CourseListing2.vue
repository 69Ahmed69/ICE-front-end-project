<script setup>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import { UserIcon, ClockIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

defineProps({
  course: Object,
  index: {
    type: Number,
    default: 1,
  },
  category_bg: {
    type: String,
    default: 'bg-fourth',
  },
  category_text: {
    type: String,
    default: 'text-primary',
  },
})

function formatStudentsCount(students) {
  if (students >= 1_000_000) {
    return (students / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm'
  } else if (students >= 1_000) {
    return (students / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return students.toString()
}

const images = {
  0: new URL('../../assets/course-images/Course-Image-1.png', import.meta.url).href,
  1: new URL('../../assets/course-images/Course-Image-2.png', import.meta.url).href,
  2: new URL('../../assets/course-images/Course-Image-3.png', import.meta.url).href,
  3: new URL('../../assets/course-images/Course-Image-4.png', import.meta.url).href,
}
const textifyLevel = (level) => {
  if (level === 0) {
    return 'Beginner'
  }
  if (level === 1) {
    return 'Intermediate'
  } else return 'Expert'
}
</script>

<template>
  <RouterLink :to="`course/${course.id}`">
    <div
      :class="`bg-background border-2 border-tertiary flex rounded-3xl shadow-md transition-transform duration-500 hover:scale-105 hover:z-10`"
      class="transition-shadow duration-300 ease-out hover:shadow-xl hover:bg-fourth"
    >
      <!-- Image Section -->
      <div class="w-1/3 h-auto rounded-l-3xl overflow-hidden">
        <img :src="images[index]" alt="Course Image" class="w-full h-full object-cover" />
      </div>

      <!-- Info Section -->
      <div class="p-4 flex flex-col justify-between flex-grow">
        <!-- Price and Category -->
        <div class="flex justify-between items-center text-sm font-medium">
          <span :class="`${category_bg} ${category_text} px-2 py-1 text-xs rounded-full`">
            {{ course.category }}
          </span>
          <div class="space-x-1">
            <span
              v-if="course.discount > 0"
              class="text-gray_3 line-through font-primary text-base"
            >
              ${{ course.price }}
            </span>
            <span
              v-if="course.price - course.discount > 0"
              class="text-primary font-primary text-lg"
            >
              ${{ course.price - course.discount }}
            </span>
            <span v-else class="text-primary font-primary text-lg">FREE</span>
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-base font-sans font-semibold text-font mb-2 line-clamp-2">
          {{ course.title }}
        </h3>

        <!-- Instructor and Rating -->
        <div class="flex items-center justify-between text-sm mb-2">
          <div class="flex items-center gap-2">
            <img
              src="../../assets/img/instructor_avatar.png"
              alt="Instructor Avatar"
              class="w-8 h-8 rounded-full"
            />
            <span class="font-primary font-medium text-gray_2">
              {{ course.instructor }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <img src="../../../public/favicon.ico" alt="Star Icon" class="w-4 h-4" />
            <span class="text-gray_1 font-primary font-bold">
              {{ course.rating }}
            </span>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t-2 border-tertiary my-2"></div>

        <!-- Students, Level, and Time -->
        <div class="flex justify-between text-xs font-primary flex-wrap">
          <div class="flex items-center gap-1">
            <UserIcon class="size-5 text-secondary" />
            <span class="text-gray_1">{{ formatStudentsCount(course.students) }}</span>
            <span class="text-gray_3">students</span>
          </div>
          <div class="flex items-center gap-1">
            <ChartBarIcon class="size-5 text-danger" />
            <span class="text-gray_1">{{ textifyLevel(course.level) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <ClockIcon class="size-5 text-success" />
            <span class="text-gray_1">{{ course.duration }} hours</span>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
