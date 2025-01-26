<script setup>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import { transparentColor } from '@/utils/color'

defineProps({
  category: {
    type: Object,
    required: true,
  },
})

// Function to convert hex to RGBA with opacity
</script>

<template>
  <RouterLink :to="`/category/${category.id}`" class="block">
    <div
      :style="{ backgroundColor: transparentColor(category.color, 0.3) }"
      class="flex items-center text-nowrap truncate p-4 shadow rounded-3xl space-x-4 transition-transform duration-500 hover:scale-110 hover:z-10 ease-out hover:shadow-xl"
    >
      <!-- Left: Rounded Div with Icon -->
      <div
        class="flex items-center justify-center min-w-6 min-h-6 lg:min-w-12 lg:min-h-12 bg-background rounded-full"
      >
        <img
          :src="`../../public/categories/${category.icon}.svg`"
          :class="`w-4 lg:w-8 ${category.color}`"
        />
      </div>

      <!-- Right: Text Content -->
      <div>
        <p class="text-xs lg:text-base text-font font-primary">{{ category.name }}</p>
        <p class="text-xs lg:text-base text-gray_2">{{ category.courses }} courses</p>
      </div>
    </div>
  </RouterLink>
</template>
