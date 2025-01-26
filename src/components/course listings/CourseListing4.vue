<script setup>
import { UserIcon } from '@heroicons/vue/24/outline'
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import { transparentColor } from '@/utils/color'

defineProps({
  course: Object,
  category: Object,
})

function formatStudentsCount(students) {
  if (students >= 1_000_000) {
    return (students / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm'
  } else if (students >= 1_000) {
    return (students / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return students.toString()
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
  <RouterLink :to="`/course/${course.id}`">
    <div
      :class="`bg-background rounded-3xl shadow-md w-full`"
      class="transition-shadow duration-300 ease-out hover:shadow-xl hover:bg-fourth"
    >
      <!-- Image -->
      <div class="h-3/4 overflow-hidden rounded-t-3xl">
        <img :src="course.image" alt="Course Image" class="w-full object-cover" />
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col justify-between h-1/4">
        <div
          class="flex flex-wrap justify-between items-center text:xs lg:text-sm font-medium mb-2"
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
        <h3
          class="text-xs lg:text-base overflow-hidden font-sans font-medium text-font lg:min-h-12 line-clamp-2"
        >
          {{ course.title }}
        </h3>

        <!-- Divider -->
        <div class="border-t-2 border-tertiary my-2"></div>

        <!-- Rating and Number of Students -->
        <div class="flex justify-between items-center text-xs lg:text-base gap-3">
          <!-- Rating -->
          <div class="flex items-center justify-center gap-1">
            <img src="../../../public/favicon.ico" alt="" class="w-4 lg:w-5" />
            <span class="text-gray_1 font-primary font-bold">{{ course.rating }}</span>
          </div>

          <!-- Students -->
          <div class="flex items-center text-xs lg:text-base gap-1 text-right">
            <span class="text-gray_1 font-primary">{{ formatStudentsCount(course.students) }}</span>
            <UserIcon class="w-3 lg:w-4 text-secondary" />
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
