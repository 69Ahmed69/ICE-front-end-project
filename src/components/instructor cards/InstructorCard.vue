<script setup>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import { UserIcon } from '@heroicons/vue/24/outline'

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
</script>
<template>
  <RouterLink :to="`instructor/${instructor.id}`">
    <div
      :class="`bg-background max-w-52 rounded-3xl shadow-md transition-transform duration-500 hover:scale-110 hover:z-10`"
      class="transition-shadow duration-300 ease-out hover:shadow-xl hover:bg-fourth"
    >
      <!-- Image -->
      <div class="h-1/2 overflow-hidden rounded-t-3xl">
        <img
          :src="instructor.image"
          alt="instructor Image"
          class="min-w-40 max-w-40 min-h-40 max-h-40 lg:min-h-52 lg:min-w-52 lg:max-h-52 lg:max-w-52 object-cover"
        />
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col gap-2 h-1/2">
        <!-- Title -->
        <h2 class="text-xs lg:text-base text-center items-center font-primary font-bold text-font">
          {{ instructor.firstName }} {{ instructor.lastName }}
        </h2>
        <h3
          class="text-xs lg:text-sm text-nowrap text-center items-center font-sans font-medium text-gray_2"
        >
          {{ instructor.specialty }}
        </h3>

        <!-- Divider -->
        <div class="border-t-2 w-full border-tertiary my-2"></div>

        <!-- Rating and Number of Students -->
        <div class="flex flex-wrap items-center justify-between text-xs lg:text-base gap-2">
          <!-- Rating -->
          <div class="flex items-center justify-center gap-1">
            <img src="../../../public/favicon.ico" alt="" class="w-4 lg:w-5" />
            <span class="text-gray_1 font-primary font-bold">{{ instructor.rating }}</span>
          </div>

          <!-- Students -->
          <div class="flex items-center text-xs lg:text-base gap-1 flex-wrap text-right">
            <span class="text-gray_1 font-primary">{{
              formatStudentsCount(instructor.students)
            }}</span>
            <UserIcon class="w-3 lg:w-4 text-secondary" />
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
