<script setup>
import { ref, reactive } from 'vue'
import { defineProps } from 'vue'
import { UserIcon } from '@heroicons/vue/24/outline'
import CourseListingHover from './CourseListingHover.vue'

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
const isHovered = ref(false)
const hoverStyle = reactive({})
let hoverTimeout = null

function calculatePosition(event) {
  const elementRect = event.target.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  let top = elementRect.top
  let left = elementRect.right + 10

  if (left + 300 > viewportWidth) {
    left = elementRect.left - 310
  }
  if (top + 100 > viewportHeight) {
    top = viewportHeight - 310
  }

  hoverStyle.top = `${top}px`
  hoverStyle.left = `${left}px`
  hoverStyle.opacity = 1
}

function handleMouseEnter(event) {
  clearTimeout(hoverTimeout)
  hoverTimeout = setTimeout(() => {
    isHovered.value = true
    calculatePosition(event)
  }, 600)
}

function handleMouseLeave() {
  clearTimeout(hoverTimeout)
  isHovered.value = false
}
</script>

<template>
  <div
    :class="`bg-background border-2 border-tertiary flex flex-col rounded-3xl shadow-md hover:z-10`"
    class="relative transition-shadow duration-300 ease-out hover:shadow-xl"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Image Section -->
    <div class="w-full h-1/2 overflow-hidden rounded-t-3xl">
      <img :src="images[index]" alt="Course Image" class="w-full h-full object-cover" />
    </div>

    <!-- Content Section -->
    <div class="p-4 flex flex-col justify-between flex-grow">
      <!-- First Row: Category and Price -->
      <div class="flex flex-wrap justify-between items-center text-sm font-medium mb-2">
        <span :class="`${category_bg} ${category_text} px-2 py-1 text-xs rounded-full`">
          {{ course.category }}
        </span>
        <div class="space-x-1">
          <span v-if="course.discount > 0" class="text-gray_3 line-through font-primary text-base">
            ${{ course.price }}
          </span>
          <span v-if="course.price - course.discount > 0" class="text-primary font-primary text-lg">
            ${{ course.price - course.discount }}
          </span>
          <span v-else class="text-primary font-primary text-lg">FREE</span>
        </div>
      </div>

      <!-- Second Row: Title -->
      <h3 class="text-base font-sans font-medium text-font mb-2 overflow-hidden h-16 line-clamp-2">
        {{ course.title }}
      </h3>
      <div class="flex justify-between text-sm mb-2 flex-wrap">
        <div class="flex items-center gap-2">
          <img src="../../../public/favicon.ico" alt="Star Icon" class="w-5 h-5" />
          <span class="text-gray_1 font-primary font-bold">
            {{ course.rating }}
          </span>
        </div>
        <div class="flex items-center gap-1 font-primary">
          <UserIcon class="size-5 text-secondary" />
          <span class="text-gray_1">{{ formatStudentsCount(course.students) }}</span>
          <span class="text-gray_3 text-xs">students</span>
        </div>
      </div>
    </div>

    <!-- Hover Component -->
    <CourseListingHover
      v-if="isHovered"
      :index="index"
      :course="course"
      :category_bg="category_bg"
      :category_text="category_text"
      :style="hoverStyle"
      class="fixed max-w-96 transition-opacity duration-300 ease-out opacity-0"
    />
  </div>
</template>

<style scoped>
.CourseListingHover {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
</style>
