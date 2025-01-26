<script setup>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'

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
  4: new URL('../../assets/course-images/Course-Image-5.png', import.meta.url).href,
  5: new URL('../../assets/course-images/Course-Image-6.png', import.meta.url).href,
  6: new URL('../../assets/course-images/Course-Image-7.png', import.meta.url).href,
  7: new URL('../../assets/course-images/Course-Image-8.png', import.meta.url).href,
  8: new URL('../../assets/course-images/Course-Image-9.png', import.meta.url).href,
  9: new URL('../../assets/course-images/Course-Image-10.png', import.meta.url).href,
}
</script>
<template>
  <RouterLink :to="`course/${course.id}`">
    <div
      :class="`bg-background rounded-3xl shadow-md w-full max-w-sm transition-transform duration-500 hover:scale-110 hover:z-10`"
      class="transition-shadow duration-300 ease-out hover:shadow-xl hover:bg-fourth"
    >
      <!-- Image -->
      <div class="h-1/2 overflow-hidden rounded-t-3xl">
        <img :src="images[index%10]" alt="Course Image" class="w-full h-full object-cover" />
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col gap-2 h-1/2">
        <div class="flex justify-between items-center text-sm font-medium">
          <!-- Category -->
          <span :class="`${category_bg} ${category_text} px-2 py-1 text-xs rounded-full`">{{
            course.category
          }}</span>
          <!-- Price -->

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
              >${{ course.price - course.discount }}</span
            >
            <span v-else class="text-primary font-primary text-lg">FREE</span>
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-base font-sans font-medium text-font line-clamp-2 min-h-12">
          {{ course.title }}
        </h3>

        <!-- Divider -->
        <div class="border-t-2 border-tertiary my-2"></div>

        <!-- Rating and Number of Students -->
        <div class="flex flex-wrap justify-between items-center text-base gap-2">
          <!-- Rating -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <img src="../../../public/favicon.ico" alt="" class="w-5 h-5" />
            <span class="text-gray_1 font-primary font-bold">{{ course.rating }}</span>
          </div>

          <!-- Students -->
          <div class="flex items-center gap-1 flex-wrap text-right">
            <span class="text-gray_1 font-primary">{{ formatStudentsCount(course.students) }}</span>
            <span class="text-gray_3 text-sm font-primary">students</span>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
