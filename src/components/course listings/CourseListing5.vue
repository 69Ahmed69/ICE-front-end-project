<script setup>
import { defineProps } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import IceButton from '../ui elements/IceButton.vue'

const router = useRouter()

defineProps({
  course: Object,
  completion: Number,
})
</script>
<template>
  <RouterLink :to="`course/${course.id}`">
    <div
      class="bg-background rounded-3xl shadow-md transition-shadow duration-300 ease-out hover:shadow-xl min-w-44 max-w-44 lg:min-w-80 lg:max-w-80"
    >
      <!-- Image -->
      <div class="h-3/4 overflow-hidden rounded-t-3xl">
        <img :src="course.image" alt="Course Image" class="w-44 lg:w-full object-cover" />
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col justify-between">
        <!-- Title -->
        <h2
          class="text-xs lg:text-sm overflow-hidden font-sans font-medium text-gray_2 line-clamp-1"
        >
          {{ course.subtitle }}...
        </h2>
        <h2
          class="text-xs lg:text-base overflow-hidden font-sans font-medium text-font lg:min-h-12 line-clamp-2"
        >
          {{ course.title }}
        </h2>

        <!-- Divider -->
        <div class="border-t-2 border-tertiary my-2"></div>

        <div v-if="completion == 0">
          <RouterLink :to="`/watch-course/${course.id}`">
            <IceButton text="Watch Lecture" :priority="4" :size="1" class="w-full" />
          </RouterLink>
        </div>
        <div v-else class="flex justify-between items-center text-xs lg:text-base gap-3 w-full">
          <RouterLink :to="`/watch-course/${course.id}`">
            <IceButton text="Watch Lecture" :priority="4" :size="1" class="text-nowrap" />
          </RouterLink>
          <span class="font-medium text-success text-base text-nowrap"
            >{{ completion }}% Completed</span
          >
        </div>
      </div>
    </div>
  </RouterLink>
</template>
