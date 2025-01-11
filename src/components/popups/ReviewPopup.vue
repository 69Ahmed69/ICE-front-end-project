<script setup>
import { ref, defineEmits } from 'vue'
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/vue/20/solid'
import IceButton from '../ui elements/IceButton.vue'
import fullSnowflake from '@/assets/rating/full-snowflake.svg'
import halfSnowflake from '@/assets/rating/half-snowflake.svg'
import hollowSnowflake from '@/assets/rating/hollow-snowflake.svg'

const emits = defineEmits(['confirm', 'cancel'])
const inputValue = ref('')
const reviewValue = ref(5) // Default review value
const hoverValue = ref(5) // Hovered value

function confirm() {
  emits('confirm', inputValue.value, reviewValue.value)
}

function cancel() {
  emits('cancel')
}

function setReview() {
  reviewValue.value = hoverValue.value
  clearHover()
}

function hoverReview(event, index) {
  const snowflake = event.currentTarget
  const rect = snowflake.getBoundingClientRect()
  const midpoint = rect.left + rect.width / 2

  if (event.clientX < midpoint) {
    hoverValue.value = index - 0.5
  } else {
    hoverValue.value = index
  }
}

function clearHover() {
  hoverValue.value = null
}

function reviewText() {
  const value =
    hoverValue.value !== null ? Math.ceil(hoverValue.value) : Math.ceil(reviewValue.value)
  switch (value) {
    case 1:
      return '(Not worth it)'
    case 2:
      return '(Could be better)'
    case 3:
      return '(It was okay)'
    case 4:
      return '(Amazing)'
    case 5:
      return '(ICE Solid)'
    default:
      return ''
  }
}

function reviewNumber() {
  return hoverValue.value !== null ? hoverValue.value : reviewValue.value
}

function getSnowflakeType(index) {
  const value = hoverValue.value !== null ? hoverValue.value : reviewValue.value
  if (value >= index) {
    return fullSnowflake
  } else if (value >= index - 0.5) {
    return halfSnowflake
  }
  return hollowSnowflake
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-background shadow-xl rounded-3xl flex flex-col divide-y divide-tertiary w-1/3">
      <div class="flex justify-between p-3">
        <span class="font-medium text-font text-xs lg:text-sm">Write a Review</span>
        <button @click="cancel">
          <XMarkIcon class="size-5 text-gray_2 hover:text-primary" />
        </button>
      </div>
      <div class="flex flex-col">
        <!-- Review Section -->
        <div class="flex items-center justify-center flex-col p-4 space-y-2">
          <div class="flex gap-1 justify-center items-center">
            <span class="text-font font-bold font-primary text-base lg:text-lg">{{
              reviewNumber()
            }}</span>
            <span class="text-gray_2 font-medium font-primary text-sm">{{ reviewText() }}</span>
          </div>
          <div class="flex items-center justify-center">
            <template v-for="i in 5" :key="i">
              <transition name="snowflake" mode="out-in">
                <img
                  :src="getSnowflakeType(i)"
                  class="size-8 lg:size-10 cursor-pointer transition-transform duration-200 transform hover:scale-110"
                  @click="setReview()"
                  @mousemove="hoverReview($event, i)"
                  @mouseleave="clearHover"
                  :alt="'Snowflake ' + i"
                />
              </transition>
            </template>
          </div>
        </div>

        <!-- Feedback Section -->
        <div class="flex flex-col gap-1 p-3">
          <label class="font-medium text-font text-xs lg:text-sm">Feedback</label>
          <textarea
            v-model="inputValue"
            placeholder="Write your feedback..."
            rows="4"
            class="w-full resize-none py-1 text-font lg:py-2 rounded-lg border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
            @input="
              ($event.target.style.height = 'auto'),
                ($event.target.style.height = `${$event.target.scrollHeight}px`)
            "
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between p-3 gap-4">
          <IceButton text="Cancel" :priority="7" :size="1" @click="cancel" />
          <IceButton
            text="Post the review"
            :priority="1"
            :size="1"
            :icon="PaperAirplaneIcon"
            icon-position="right"
            @click="confirm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Add custom animation for snowflakes */
.snowflake-enter-active,
.snowflake-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.snowflake-enter-from,
.snowflake-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
