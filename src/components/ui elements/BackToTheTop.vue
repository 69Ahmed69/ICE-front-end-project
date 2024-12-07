<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUpIcon } from '@heroicons/vue/24/outline'

const showButton = ref(false)

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight
  showButton.value = scrollTop > pageHeight * 0.25
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    v-if="showButton"
    class="fixed bottom-4 z-30 animate-bounce right-4 bg-fourth text-font p-2 lg:p-3 rounded-full shadow-md cursor-pointer hover:text-white hover:bg-primary hover:shadow-xl hover:shadow-gray_3 transition-shadow ease-in duration-300"
    @click="scrollToTop"
  >
    <ArrowUpIcon class="size-5 lg:size-7" />
  </div>
</template>
