<script setup>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({
  instructor: Object,
  index: {
    type: Number,
    default: 1,
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
  0: new URL('../assets/instructor-images/Image-1.png', import.meta.url).href,
  1: new URL('../assets/instructor-images/Image-2.png', import.meta.url).href,
  2: new URL('../assets/instructor-images/Image-3.png', import.meta.url).href,
  3: new URL('../assets/instructor-images/Image-4.png', import.meta.url).href,
  4: new URL('../assets/instructor-images/Image-5.png', import.meta.url).href,
}
</script>
<template>
  <RouterLink :to="`instructor/${instructor.id}`">
    <div
      :class="`bg-background rounded-3xl shadow-md w-full max-w-sm transition-transform duration-500 hover:scale-110 hover:z-10`"
      class="transition-shadow duration-300 ease-out hover:shadow-xl hover:bg-fourth"
    >
      <!-- Image -->
      <div class="h-2/3 overflow-hidden rounded-t-3xl">
        <img :src="images[index]" alt="instructor Image" class="w-full h-full object-cover" />
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col gap-2 h-1/2">
        <!-- Title -->
        <h2 class="text-base text-center items-center font-primary font-bold text-font">
          {{ instructor.first_name }} {{ instructor.last_name }}
        </h2>
        <h3 class="text-base text-center items-center font-sans font-medium text-gray_2">
          {{ instructor.sepcialty }}
        </h3>

        <!-- Divider -->
        <div class="border-t-2 border-tertiary my-2"></div>

        <!-- Rating and Number of Students -->
        <div class="flex flex-wrap justify-between items-center text-base gap-2">
          <!-- Rating -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <img src="../../../public/favicon.ico" alt="" class="w-5 h-5" />
            <span class="text-gray_1 font-primary font-bold">{{ instructor.rating }}</span>
          </div>

          <!-- Students -->
          <div class="flex items-center gap-1 flex-wrap text-right">
            <span class="text-gray_1 font-primary">{{
              formatStudentsCount(instructor.students)
            }}</span>
            <span class="text-gray_3 text-sm font-primary">students</span>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
