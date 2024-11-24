<script setup>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({
  categoryName: {
    type: String,
    required: true,
  },
  numberOfCourses: {
    type: Number,
    required: true,
  },
  icon: {
    type: Function,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  icon_color: {
    type: String,
    default: 'text-font',
  },
  bg_color: {
    type: String,
    default: 'bg-white',
  },
})
</script>

<template>
  <RouterLink :to="link" class="block">
    <div
      :class="`flex items-center ${bg_color} text-nowrap truncate p-4 shadow rounded-3xl space-x-4 transition-transform duration-500 hover:scale-110 hover:z-10`"
      class="transition-shadow duration-300 ease-out hover:shadow-xl hover:bg-fourth"
    >
      <!-- Left: Rounded Div with Icon -->
      <div class="flex items-center justify-center min-w-16 min-h-16 bg-background rounded-full">
        <component :is="icon" :class="`w-8 h-8 ${icon_color}`" />
      </div>

      <!-- Right: Text Content -->
      <div>
        <p class="text-base text-font font-primary">{{ categoryName }}</p>
        <p class="text-base text-gray_2">{{ numberOfCourses }} courses</p>
      </div>
    </div>
  </RouterLink>
</template>
