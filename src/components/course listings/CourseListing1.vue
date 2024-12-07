<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { defineProps } from 'vue'
import { UserIcon } from '@heroicons/vue/24/outline'
import CourseListingHover from './CourseListingHover.vue'

defineProps({
  course: Object,
  instructor: Object,
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
const isSmallScreen = ref(window.innerWidth < 640) // Adjust breakpoint as needed
let hoverTimeout = null
let leaveTimeout = null

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
  if (isSmallScreen.value) return // Disable hover on small screens
  clearTimeout(hoverTimeout)
  clearTimeout(leaveTimeout)
  hoverTimeout = setTimeout(() => {
    isHovered.value = true
    calculatePosition(event)
  }, 400)
}

function handleMouseLeave() {
  if (isSmallScreen.value) return // No need to handle leave on small screens
  clearTimeout(hoverTimeout)
  leaveTimeout = setTimeout(() => {
    isHovered.value = false
  }, 100)
}

// Update isSmallScreen on resize
function updateScreenSize() {
  isSmallScreen.value = window.innerWidth < 640
}

onMounted(() => {
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})
function daysLeft(discountEnd) {
  const today = new Date()
  const endDate = new Date(discountEnd)
  const timeDifference = endDate - today
  const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
  return days > 0 ? `${days} days left at this price!!` : ''
}
</script>

<template>
  <div
    :class="`bg-background border-2 border-tertiary flex flex-col rounded-3xl shadow-md hover:z-10`"
    class="relative transition-shadow max-w-44 lg:max-w-60 duration-300 ease-out hover:shadow-xl"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Image Section -->
    <div class="w-full h-1/2 overflow-hidden rounded-t-3xl">
      <img :src="course.image" alt="Course Image" class="w-44 lg:w-full lg:max-w-60 object-cover" />
    </div>

    <!-- Content Section -->
    <div class="p-4 flex flex-col justify-between">
      <!-- First Row: Category and Price -->
      <div class="flex flex-wrap justify-between items-center text:xs lg:text-sm font-medium mb-2">
        <span :class="`${category_bg} ${category_text} px-1 lg:px-2 py-1 text-xs rounded-full`">
          {{ course.category }}
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

      <!-- Second Row: Title -->
      <h3
        class="text-xs lg:text-base overflow-hidden font-sans font-medium text-font mb-2 lg:h-16 line-clamp-2"
      >
        {{ course.title }}
      </h3>
      <div class="flex justify-between text-xs lg:text-base mb-2 flex-wrap">
        <div class="flex items-center justify-center gap-1">
          <img src="../../../public/favicon.ico" alt="" class="w-4 lg:w-5" />
          <span class="text-gray_1 font-primary font-bold">{{ course.rating }}</span>
        </div>
        <div class="flex items-center text-xs lg:text-base gap-1 flex-wrap text-right">
          <span class="text-gray_1 font-primary">{{ formatStudentsCount(course.students) }}</span>
          <UserIcon class="w-3 lg:w-4 text-secondary" />
        </div>
      </div>
    </div>

    <!-- Hover Component -->
    <CourseListingHover
      v-if="isHovered"
      :index="index"
      :course="course"
      :instructor="instructor"
      :category_bg="category_bg"
      :category_text="category_text"
      :style="hoverStyle"
      class="fixed max-w-52 lg:max-w-96 transition-opacity duration-300 ease-out opacity-0 z-50"
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
