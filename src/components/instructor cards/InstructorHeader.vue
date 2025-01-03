<script setup>
import { PlayCircleIcon } from '@heroicons/vue/20/solid'
import { UsersIcon, GlobeAltIcon } from '@heroicons/vue/24/outline'

defineProps({
  instructor: Object,
})

const formatNumber = (number) => {
  const numberString = number.toString()
  const [integerPart, decimalPart] = numberString.split('.')

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (decimalPart) {
    return formattedIntegerPart + '.' + decimalPart
  } else {
    return formattedIntegerPart
  }
}
</script>
<template>
  <div
    class="flex flex-col w-full space-y-2 lg:space-y-0 items-center justify-center my-2 p-4 lg:p-8 lg:px-12 mx-6 lg:mx-36 lg:flex-row lg:justify-between rounded-3xl bg-background border-2 border-tertiary shadow-lg ease-in duration-300 hover:shadow-xl transition-shadow"
  >
    <!-- Left part with instructor image and instructor information -->
    <div class="flex space-x-4 lg:space-x-6">
      <div>
        <img
          :src="instructor.image"
          alt="Instructor avatar"
          class="rounded-full size-28 lg:size-44 object-cover"
        />
      </div>
      <div class="flex justify-center flex-col">
        <div class="flex gap-2 mb-1">
          <h1 class="font-primary text-font font-bold text-xl lg:text-2xl">
            {{ instructor.firstName }} {{ instructor.lastName }}
          </h1>
          <span
            v-if="instructor.tag"
            class="font-primary text-primary text-xs bg-fourth rounded-full p-1 px-2 flex items-center justify-center gap-1"
          >
            <img
              src="../../assets/img/ice-crown.svg"
              alt=""
              class="hidden size-4 lg:size-6 lg:block"
            />
            {{ instructor.tag }}</span
          >
        </div>
        <h2 class="font-sans text-gray_2 text-sm lg:text-base font-medium mb-3 lg:mb-4">
          {{ instructor.specialty }}
        </h2>
        <div class="flex items-center justify-between space-x-2 lg:space-x-4">
          <div class="flex justify-center items-center gap-1">
            <img src="../../../public/favicon.ico" alt="" class="w-4 lg:w-5" />
            <span class="text-font font-primary font-bold text-xs lg:text-sm">{{
              instructor.rating
            }}</span>
            <span class="text-gray_2 text-xs lg:text-sm">({{ instructor.numOfRatings }})</span>
          </div>
          <div class="flex justify-center items-center gap-1">
            <UsersIcon class="w-4 lg:w-5 text-secondary" />
            <span class="text-font font-primary font-bold text-xs lg:text-sm">{{
              formatNumber(instructor.students)
            }}</span>
            <span class="text-gray_2 text-xs lg:text-sm">students</span>
          </div>
          <div class="flex justify-center items-center gap-1">
            <PlayCircleIcon class="w-4 lg:w-5 text-danger" />
            <span class="text-font font-primary font-bold text-xs lg:text-sm">{{
              instructor.courses.length
            }}</span>
            <span class="text-gray_2 text-xs lg:text-sm">course</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex justify-between items-center w-full px-4 lg:px-0 lg:w-auto lg:justify-center lg:flex-col lg:items-end lg:space-y-2"
    >
      <div
        v-if="instructor.website != ''"
        class="flex justify-center items-center gap-1 text-secondary text-xs lg:text-sm"
      >
        <GlobeAltIcon class="size-4 lg:size-5" />
        <a :href="instructor.website" class="hover:underline font-medium">{{
          instructor.website
        }}</a>
      </div>
      <div class="flex gap-1 lg:gap-2">
        <a
          v-if="instructor.twitter != ''"
          :href="instructor.twitter"
          class="bg-fourth rounded-full p-1 lg:p-2 size-8 lg:size-10 flex justify-center items-center shadow-md hover:shadow-xl duration-200 ease-in"
        >
          <img src="../../assets/social-media/twitter.svg" alt="TwitterLogo" class="h-4 lg:h-5" />
        </a>
        <a
          v-if="instructor.youtube != ''"
          :href="instructor.youtube"
          class="bg-fourth rounded-full p-1 lg:p-2 size-8 lg:size-10 flex justify-center items-center shadow-md hover:shadow-xl duration-200 ease-in"
        >
          <img src="../../assets/social-media/youtube.svg" alt="TwitterLogo" class="h-4 lg:h-5" />
        </a>
        <a
          v-if="instructor.instagram != ''"
          :href="instructor.instagram"
          class="bg-fourth rounded-full p-1 lg:p-2 size-8 lg:size-10 flex justify-center items-center shadow-md hover:shadow-xl duration-200 ease-in"
        >
          <img src="../../assets/social-media/instagram.svg" alt="TwitterLogo" class="h-4 lg:h-5" />
        </a>
        <a
          v-if="instructor.github != ''"
          :href="instructor.github"
          class="bg-fourth rounded-full p-1 lg:p-2 size-8 lg:size-10 flex justify-center items-center shadow-md hover:shadow-xl duration-200 ease-in"
        >
          <img src="../../assets/social-media/github.svg" alt="TwitterLogo" class="h-4 lg:h-5" />
        </a>
        <a
          v-if="instructor.linkedIn != ''"
          :href="instructor.linkedIn"
          class="bg-fourth rounded-full p-1 lg:p-2 size-8 lg:size-10 flex justify-center items-center shadow-md hover:shadow-xl duration-200 ease-in"
        >
          <img src="../../assets/social-media/linkedin.svg" alt="TwitterLogo" class="h-4 lg:h-5" />
        </a>
      </div>
    </div>
  </div>
</template>
