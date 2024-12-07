<script setup>
import { defineProps, ref } from 'vue'
import {
  UserIcon,
  CheckIcon,
  ClockIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  HeartIcon,
} from '@heroicons/vue/24/outline'
import IceButton from '../ui elements/IceButton.vue'

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

const isFilled = ref(false)

function toggleHeart() {
  isFilled.value = !isFilled.value
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
  <div
    :class="`bg-white pt-2 lg:pt-6 pb-4 lg:pb-10 border-2 border-tertiary flex flex-col rounded-3xl shadow-md p-2 lg:p-4`"
    class="transition-shadow duration-300 ease-out hover:shadow-xl space-y-4"
  >
    <!-- Category -->
    <div class="text-xs lg:text-sm font-medium mb-2">
      <span :class="`${category_bg} ${category_text} px-1 lg:px-2 py-1 text-xs rounded-full`">
        {{ course.category }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="text-xs lg:text-base font-primary font-semibold text-font mb-2 line-clamp-2">
      {{ course.title }}
    </h3>

    <!-- Instructor and Rating -->
    <div class="flex items-center justify-between text-xs lg:text-sm mb-2">
      <div class="flex items-center gap-2">
        <img
          :src="instructor.image"
          alt="Instructor Avatar"
          class="size-5 lg:size-8 rounded-full object-cover"
        />
        <span class="font-primary font-medium text-gray_2">
          {{ instructor.firstName }} {{ instructor.lastName }}
        </span>
      </div>
      <div class="flex items-center gap-1 text-xs lg:text-base">
        <img src="../../../public/favicon.ico" alt="Star Icon" class="w-4 lg:w-5" />
        <span class="text-gray_1 font-primary font-bold">
          {{ course.rating }}
        </span>
        <span class="text-gray_3 font-primary"> ({{ course.ratings }}) </span>
      </div>
    </div>

    <!-- Students, Level, and Duration -->
    <div class="flex justify-between text-xs font-primary flex-wrap">
      <div class="flex items-center lg:gap-1">
        <UserIcon class="size-5 text-secondary" />
        <span class="text-gray_1">{{ formatStudentsCount(course.students) }}</span>
        <span class="text-gray_3">students</span>
      </div>
      <div class="flex items-center lg:gap-1">
        <ChartBarIcon class="size-5 text-danger" />
        <span class="text-gray_1">{{ textifyLevel(course.level) }}</span>
      </div>
      <div class="flex items-center lg:gap-1">
        <ClockIcon class="size-5 text-success" />
        <span class="text-gray_1">{{ course.duration }} hours</span>
      </div>
    </div>

    <!-- Price and Heart -->
    <div class="flex justify-between items-center mb-2">
      <div class="text-sm lg:text-lg text-primary font-primary">
        <span
          v-if="course.discount > 0 && daysLeft(course.discountEnd) != ''"
          class="line-through text-gray_3"
        >
          ${{ course.price }}
        </span>
        <span v-if="daysLeft(course.discountEnd) == ''">${{ course.price }}</span>
        <span v-else-if="course.price - course.discount > 0">
          ${{ course.price - course.discount }}
        </span>
        <span v-else>FREE</span>
      </div>
      <button
        @click="toggleHeart"
        class="flex items-center justify-center p-2 transition-colors duration-200"
      >
        <HeartIcon
          :class="[
            'size-4 lg:size-5 cursor-pointer transition-all duration-300',
            isFilled ? 'text-danger fill-danger' : 'text-gray_3',
          ]"
        />
      </button>
    </div>

    <!-- What You'll Learn -->
    <div class="mb-2">
      <h4 class="text-xs lg:text-sm font-semibold text-font mb-1">What you'll learn</h4>
      <ul class="text-xs lg:text-sm text-wrap text-gray_3 space-y-1">
        <li
          v-for="(item, i) in course.learningPoints.slice(0, 3)"
          :key="i"
          class="flex items-center space-x-2"
        >
          <CheckIcon class="size-3 lg:size-4 text-success" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col gap-1 lg:gap-2 mt-auto">
      <IceButton
        class="w-full"
        :priority="1"
        :size="1"
        text="Add to Cart"
        :icon="ShoppingCartIcon"
        icon_position="left"
      />
      <RouterLink :to="`course/${course.id}`">
        <IceButton class="w-full" :priority="4" :size="1" text="Course Details" />
      </RouterLink>
    </div>
  </div>
</template>
