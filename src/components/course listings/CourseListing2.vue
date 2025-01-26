<script setup>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import { UserIcon, ClockIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { transparentColor } from '@/utils/color'

defineProps({
  course: Object,
  category: Object,
  instructor: Object,
})

function formatStudentsCount(students) {
  if (students >= 1_000_000) {
    return (students / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm'
  } else if (students >= 1_000) {
    return (students / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return students.toString()
}

const textifyLevel = (level) => {
  if (level === 0) {
    return 'Beginner'
  }
  if (level === 1) {
    return 'Intermediate'
  } else return 'Expert'
}
function daysLeft(discountEnd) {
  const today = new Date()
  const endDate = new Date(discountEnd)
  const timeDifference = endDate - today
  const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
  return days > 0 ? `${days} days left at this price!!` : ''
}
</script>

<template>
  <RouterLink :to="`course/${course.id}`">
    <div
      :class="`bg-background border-2 border-tertiary flex flex-col lg:flex-row rounded-3xl shadow-md transition-transform duration-500 hover:scale-105 hover:z-10`"
      class="lg:max-w-md transition-shadow duration-300 ease-out hover:shadow-xl hover:bg-fourth"
    >
      <!-- Image Section -->
      <div
        class="w-full lg:w-2/5 h-48 lg:h-auto rounded-t-3xl lg:rounded-l-3xl lg:rounded-r-none overflow-hidden"
      >
        <img :src="course.image" alt="Course Image" class="w-full h-full object-cover" />
      </div>

      <!-- Info Section -->
      <div class="p-4 flex flex-col justify-between flex-grow">
        <!-- Price and Category -->
        <div
          class="flex flex-wrap justify-between items-center text-xs lg:text-sm font-medium mb-1"
        >
          <span
            :style="{
              background: transparentColor(category.color, 0.2),
              color: category.color,
            }"
            class="px-1 lg:px-2 py-1 text-xs rounded-full"
          >
            {{ category.name }}
          </span>
          <div class="space-x-1">
            <span
              v-if="course.discount > 0 && daysLeft(course.discountEnd) != ''"
              class="text-gray_3 line-through font-primary text-xs lg:text-base"
            >
              ${{ course.price }}
            </span>
            <span
              v-if="course.price - course.discount > 0 && daysLeft(course.discountEnd) != ''"
              class="text-primary font-primary text-sm lg:text-base"
            >
              ${{ course.price - course.discount }}
            </span>
            <span
              v-else-if="daysLeft(course.discountEnd) == ''"
              class="text-primary font-primary text-sm lg:text-base"
              >${{ course.price }}</span
            >
            <span v-else class="text-primary font-primary text-sm lg:text-base">FREE</span>
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-sm lg:text-base font-sans font-semibold text-font my-1 line-clamp-2">
          {{ course.title }}
        </h3>

        <!-- Instructor and Rating -->
        <div class="flex items-center flex-wrap justify-between text-xs lg:text-sm mb-1">
          <div class="flex items-center gap-1 lg:gap-2">
            <img
              :src="instructor.image"
              alt="Instructor Avatar"
              class="size-6 lg:size-8 rounded-full object-cover"
            />
            <span class="font-primary font-medium text-gray_2">
              {{ instructor.firstName }} {{ instructor.lastName }}
            </span>
          </div>
          <div class="flex items-center justify-center gap-1 text-xs lg:text-base">
            <img src="../../../public/favicon.ico" alt="" class="w-4 lg:w-5" />
            <span class="text-gray_1 font-primary font-bold">{{ course.rating }}</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t-2 border-tertiary my-1 lg:my-1"></div>

        <!-- Students, Level, and Time -->
        <div class="flex justify-between text-xs font-primary flex-wrap">
          <div class="flex items-center gap-1">
            <UserIcon class="size-3 lg:size-5 text-secondary" />
            <span class="text-gray_1">{{ formatStudentsCount(course.students) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <ChartBarIcon class="size-3 lg:size-5 text-danger" />
            <span class="text-gray_1">{{ textifyLevel(course.level) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <ClockIcon class="size-3 lg:size-5 text-success" />
            <span class="text-gray_1">{{ course.duration }} hours</span>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
