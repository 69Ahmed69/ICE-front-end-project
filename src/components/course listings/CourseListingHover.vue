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
</script>

<template>
  <div
    :class="`bg-white pt-6 pb-10 border-2 border-tertiary flex flex-col rounded-3xl shadow-md p-4`"
    class="transition-shadow duration-300 ease-out hover:shadow-xl space-y-4"
  >
    <!-- Category -->
    <div class="text-sm font-medium mb-2">
      <span :class="`${category_bg} ${category_text} px-2 py-1 text-xs rounded-full`">
        {{ course.category }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="text-base font-primary font-semibold text-font mb-2 line-clamp-2">
      {{ course.title }}
    </h3>

    <!-- Instructor and Rating -->
    <div class="flex items-center justify-between text-sm mb-2">
      <div class="flex items-center gap-2">
        <img
          src="../../assets/img/instructor_avatar.png"
          alt="Instructor Avatar"
          class="w-8 h-8 rounded-full"
        />
        <span class="font-primary font-medium text-gray_2">
          {{ course.instructor }}
        </span>
      </div>
      <div class="flex items-center gap-1">
        <img src="../../../public/favicon.ico" alt="Star Icon" class="w-5 h-5" />
        <span class="text-gray_1 font-primary text-base font-bold">
          {{ course.rating }}
        </span>
        <span class="text-gray_3 font-primary"> ({{ course.ratings }}) </span>
      </div>
    </div>

    <!-- Students, Level, and Duration -->
    <div class="flex justify-between text-xs font-primary flex-wrap">
      <div class="flex items-center gap-1">
        <UserIcon class="size-5 text-secondary" />
        <span class="text-gray_1">{{ formatStudentsCount(course.students) }}</span>
        <span class="text-gray_3">students</span>
      </div>
      <div class="flex items-center gap-1">
        <ChartBarIcon class="size-5 text-danger" />
        <span class="text-gray_1">{{ textifyLevel(course.level) }}</span>
      </div>
      <div class="flex items-center gap-1">
        <ClockIcon class="size-5 text-success" />
        <span class="text-gray_1">{{ course.duration }} hours</span>
      </div>
    </div>

    <!-- Price and Heart -->
    <div class="flex justify-between items-center mb-2">
      <div class="text-lg text-primary font-primary">
        <span v-if="course.discount > 0" class="line-through text-gray_3">
          ${{ course.price }}
        </span>
        <span v-if="course.price - course.discount > 0">
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
            'size-5 cursor-pointer transition-all duration-300',
            isFilled ? 'text-danger fill-danger' : 'text-gray-500',
          ]"
        />
      </button>
    </div>

    <!-- What You'll Learn -->
    <div class="mb-2">
      <h4 class="text-sm font-semibold text-font mb-1">What you'll learn</h4>
      <ul class="text-sm text-wrap text-gray_3 space-y-1">
        <li
          v-for="(item, i) in course.learning_points.slice(0, 3)"
          :key="i"
          class="flex items-center space-x-2"
        >
          <CheckIcon class="size-4 text-success" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col gap-2 mt-auto">
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
