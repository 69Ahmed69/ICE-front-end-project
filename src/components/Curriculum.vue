<script setup>
import { ref } from 'vue'
import {
  ClockIcon,
  PlayCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentIcon,
} from '@heroicons/vue/24/outline'
import { PlayIcon } from '@heroicons/vue/20/solid'

defineProps({
  course: {
    type: Object,
    required: true,
  },
})

const activeChapter = ref(0)
const toggleChapter = (index) => {
  activeChapter.value = activeChapter.value === index ? null : index
}
const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins == 0) return `${hours}h`
  else return `${hours}h ${mins}m`
}

const calculateLectures = (chapter) => {
  let count = 0
  chapter.files.forEach((file) => {
    if (file.type === 'video') {
      count++
    }
  })
  return count
}
const buttonClass = (chapters, index) => {
  if (index === 0) return 'rounded-t-3xl'
  if (index === chapters.length - 1) return 'rounded-b-3xl'
  return 'rounded-none'
}
const beforeEnter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
}

const enter = (el) => {
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
}

const leave = (el) => {
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
  el.style.height = '0'
  el.style.opacity = '0'
}
</script>

<template>
  <div class="bg-background border-2 border-tertiary rounded-3xl">
    <ul class="text-gray_2 divide-y-2 divide-tertiary">
      <li v-for="(chapter, index) in course.chapters" :key="index">
        <button
          @click="toggleChapter(index)"
          :class="buttonClass(course.chapters, index)"
          class="flex justify-between items-center w-full px-4 py-4 font-medium hover:bg-fourth transition"
        >
          <div class="flex gap-1 justify-center items-center">
            <ChevronDownIcon
              v-if="activeChapter !== index"
              class="size-4 lg:size-6 text-gray_2 transition-transform"
            />
            <ChevronUpIcon v-else class="size-4 lg:size-6 text-primary transition-transform" />
            <span
              :class="
                activeChapter === index
                  ? 'text-primary text-sm lg:text-base'
                  : 'text-sm lg:text-base'
              "
            >
              {{ chapter.title }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex justify-center items-center gap-1">
              <PlayCircleIcon class="size-4 lg:size-5 text-secondary" />
              <span
                :class="
                  activeChapter === index
                    ? 'text-xs lg:text-sm text-font'
                    : 'text-xs lg:text-sm text-gray_2 '
                "
                >{{ calculateLectures(chapter) }} Lectures</span
              >
            </div>
            <div class="flex justify-center items-center gap-1">
              <ClockIcon class="size-4 lg:size-5 text-warning" />
              <span
                :class="
                  activeChapter === index
                    ? 'text-xs lg:text-sm text-font'
                    : 'text-xs lg:text-sm text-gray_2 '
                "
                >{{ formatDuration(chapter.duration) }}</span
              >
            </div>
          </div>
        </button>
        <transition name="dropdown" @before-enter="beforeEnter" @enter="enter" @leave="leave">
          <ul v-show="activeChapter === index" class="px-8 mb-4 overflow-hidden">
            <li
              v-for="(file, fileIndex) in chapter.files"
              :key="fileIndex"
              class="flex justify-between py-2 px-4 rounded-lg items-center text-sm lg:text-base text-gray_1 hover:bg-fourth"
            >
              <div class="flex justify-center items-center gap-1">
                <DocumentIcon
                  v-if="file.type === 'text'"
                  class="size-3 lg:size-4 text-gray_1 transition-transform"
                />
                <PlayIcon v-else class="size-3 lg:size-4 text-gray_1 transition-transform" />
                <span class="font-medium">{{ file.name }}</span>
              </div>
              <div>
                <span v-if="file.type === 'text'" class="text-gray_2 font-medium"
                  >{{ file.size }} MB
                </span>
                <span v-else-if="file.type === 'video'" class="text-gray_2 font-medium">
                  {{ file.time }} min
                </span>
              </div>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    height 0.3s ease,
    opacity 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  height: 0;
  opacity: 0;
}
</style>
