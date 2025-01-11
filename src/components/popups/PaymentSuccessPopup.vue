<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import lottie from 'lottie-web'
import IceButton from '../ui elements/IceButton.vue'
import { RouterLink } from 'vue-router'
import { ArrowRightIcon } from '@heroicons/vue/20/solid'

// Import the Lottie JSON animation file
import successAnimation from '@/assets/animations/success.json'

const animationContainer = ref(null)
let lottieInstance = null

onMounted(() => {
  // Initialize Lottie animation
  lottieInstance = lottie.loadAnimation({
    container: animationContainer.value, // The DOM element to render the animation
    renderer: 'svg', // Render type: 'svg', 'canvas', or 'html'
    loop: true, // Set to true for infinite looping
    autoplay: true, // Automatic playback on load
    animationData: successAnimation, // Use the imported JSON data directly
  })
})

onUnmounted(() => {
  // Cleanup Lottie instance to avoid memory leaks
  if (lottieInstance) {
    lottieInstance.destroy()
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-background shadow-xl rounded-3xl flex flex-col p-5 gap-2 w-3/4 lg:w-1/3">
      <!-- Lottie animation container -->
      <div ref="animationContainer" class="h-48 lg:h-64"></div>

      <!-- Success message -->
      <p class="text-center font-primary font-medium text-base lg:text-xl text-font">
        Payment Successful
      </p>

      <!-- Thank you note -->
      <div class="flex gap-1 items-center justify-center mb-4">
        <p class="text-center font-primary font-medium text-sm lg:text-base text-gray_1">
          Thank you for choosing ICE. Happy learning!
        </p>
        <span>❄️</span>
      </div>

      <!-- Navigation button -->
      <RouterLink to="/profile">
        <IceButton
          text="Start Watching"
          :size="4"
          :priority="4"
          :icon="ArrowRightIcon"
          icon-position="right"
          class="w-full"
        />
      </RouterLink>
    </div>
  </div>
</template>
