<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'
import Rating from './Rating.vue'
import axios from 'axios'
import { onMounted, reactive, defineProps, ref } from 'vue'

// Define props
const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
})

// Time ago utility
const timeAgo = (timestamp) => {
  const now = new Date()
  const then = new Date(timestamp)
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365
  const elapsed = now - then
  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago'
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago'
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago'
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago'
  }
}

const state = reactive({
  user: null,
})

onMounted(async () => {
  try {
    const response = await axios.get(`/api/instructors/${props.review.userId}`)
    state.user = response.data
  } catch (error) {
    console.error('Error fetching user: ', error)
  }
})

const isFilled = ref(false)

function toggleHeart() {
  isFilled.value = !isFilled.value
}
</script>

<template>
  <div v-if="state.user" class="flex space-x-4">
    <!-- User Image -->
    <img
      :src="state.user.image"
      alt="User Avatar"
      class="size-6 lg:size-10 rounded-full object-cover"
    />
    <div class="flex flex-col space-y-2 w-full">
      <div class="flex justify-between items-center">
        <div class="flex flex-col space-y-2">
          <div class="flex items-center gap-2">
            <span class="font-primary text-base text-font font-medium">
              {{ state.user.firstName }} {{ state.user.lastName }}
            </span>
            <span class="text-sm text-gray_2">
              {{ timeAgo(review.created) }}
            </span>
          </div>
          <Rating :size="1" :rating="review.rating" />
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
      <!-- Rating -->
      <!-- Review Content -->
      <p class="text-sm lg:text-base text-gray_1 font-medium">{{ review.content }}</p>
      <!-- Number of Likes -->
      <span class="text-xs lg:text-sm text-gray_2 font-medium">
        {{ review.numLikes }} users found this helpful.
      </span>
    </div>
  </div>
  <!-- Loading State -->
  <div v-else class="text-gray-500">Loading user...</div>
</template>
