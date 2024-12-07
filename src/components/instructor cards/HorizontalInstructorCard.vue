<script setup>
import { reactive } from 'vue'
import { PlayCircleIcon } from '@heroicons/vue/20/solid'
import { UsersIcon } from '@heroicons/vue/24/outline'

defineProps({
  instructor: {
    type: Object,
    required: true,
  },
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

const beautifyAboutMe = (aboutMe) => {
  return aboutMe.replace(/\n/g, '<br>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
}

const state = reactive({
  showFullAboutMe: false,
})

const maxChars = 200

const truncateAboutMe = (aboutMe) => {
  const beautified = beautifyAboutMe(aboutMe)
  if (state.showFullAboutMe || aboutMe.length <= maxChars) {
    return beautified
  }
  return beautifyAboutMe(aboutMe.substring(0, maxChars)) + '...'
}

const toggleReadMore = () => {
  state.showFullAboutMe = !state.showFullAboutMe
}
</script>

<template>
  <section
    class="flex space-x-4 justify-center items-center bg-background border-2 border-tertiary rounded-3xl p-4 lg:p-6"
  >
    <div>
      <img
        :src="instructor.image"
        alt="Instructor avatar"
        class="rounded-full size-20 lg:size-32 object-cover"
      />
    </div>
    <div class="w-3/4 flex flex-col justify-center">
      <div class="mb-4">
        <h2 class="text-base lg:text-lg font-bold text-font font-primary mb-1">
          {{ instructor.firstName }} {{ instructor.lastName }}
        </h2>
        <h3 class="text-sm lg:text-base font-medium text-gray_2 font-sans">
          {{ instructor.specialty }}
        </h3>
      </div>

      <div class="flex items-center space-x-2 lg:space-x-6 mb-4">
        <div class="flex justify-center items-center gap-1">
          <img src="../../../public/favicon.ico" alt="" class="w-5 lg:w-6" />
          <span class="text-font font-primary font-bold text-sm lg:text-base">{{
            instructor.rating
          }}</span>
          <span class="text-gray_2 text-xs lg:text-sm">course rating</span>
        </div>
        <div class="flex justify-center items-center gap-1">
          <UsersIcon class="w-4 lg:w-5 text-secondary" />
          <span class="text-font font-primary font-seminbold text-sm lg:text-base">{{
            formatNumber(instructor.students)
          }}</span>
          <span class="text-gray_2 text-xs lg:text-sm">students</span>
        </div>
        <div class="flex justify-center items-center gap-1">
          <PlayCircleIcon class="w-4 lg:w-5 text-danger" />
          <span class="text-font font-primary font-bold text-sm lg:text-base">{{
            instructor.courses.length
          }}</span>
          <span class="text-gray_2 text-xs lg:text-sm">course</span>
        </div>
      </div>
      <div id="overview" class="flex flex-col">
        <p
          :class="['text-xs lg:text-sm text-gray_1', { 'text-gray_2': !state.showFullAboutMe }]"
          v-html="truncateAboutMe(instructor.aboutMe)"
        ></p>
        <button
          v-if="(instructor?.aboutMe?.length || 0) > maxChars"
          @click="toggleReadMore"
          class="text-primary underline text-xs lg:text-sm hover:text-secondary"
        >
          {{ state.showFullAboutMe ? 'Read Less' : 'Read More' }}
        </button>
      </div>
    </div>
  </section>
</template>
