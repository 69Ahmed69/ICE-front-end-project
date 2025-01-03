<script setup>
import { RouterLink } from 'vue-router'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import Rating from './Rating.vue'
defineProps({
  course: Object,
  instructor: Object,
})
</script>

<template>
  <div class="flex flex-col lg:mr-96 px-6 lg:pr-20 space-y-4 py-6 lg:pl-36 lg:space-y-6">
    <div class="flex items-center flex-wrap space-x-2 text-xs text-gray_3 lg:text-base">
      <RouterLink :to="{ path: `/courses/${course.category}` }">
        <span class="hover:text-primary hover:underline">
          {{ course.category }}
        </span>
      </RouterLink>
      <ChevronRightIcon class="size-4" />
      <RouterLink :to="{ path: `/courses/${course.category}/${course.subCategory}` }">
        <span class="hover:text-primary hover:underline">
          {{ course.subCategory }}
        </span>
      </RouterLink>
    </div>

    <h1 class="text-lg lg:text-2xl text-font font-primary font-bold">{{ course.title }}</h1>
    <h2 class="text-sm lg:text-lg text-gray_2 font-sans">{{ course.subtitle }}</h2>
    <div class="flex justify-between items-center">
      <div class="flex space-x-2 lg:space-x-3">
        <RouterLink :to="{ path: `/instructor/${course.instructor}` }"
          ><img
            :src="instructor.image"
            alt="instructor-image"
            class="rounded-full border-2 object-cover border-tertiary size-10 lg:size-12 hover:border-primary"
        /></RouterLink>
        <div class="flex flex-col py-1 text-xs lg:text-sm">
          <span class="text-gray_3">Created by:</span>
          <RouterLink :to="{ path: `/instructor/${course.instructor}` }">
            <span class="text-gray_1 font-sans font-medium text-sm lg:text-base hover:underline"
              >{{ instructor.firstName }} {{ instructor.lastName }}</span
            >
          </RouterLink>
        </div>
      </div>
      <div class="flex space-x-1 lg:space-2 lg:pr-10 justify-center items-center">
        <Rating :rating="course.rating" :size="3" />
        <span class="font-primary text-base lg:text-xl font-bold text-font">{{
          course.rating
        }}</span>
        <span class="font-sans text-sm lg:text-base text-gray_3"
          >({{ course.ratings }} ratings)</span
        >
      </div>
    </div>
  </div>
</template>
