<script setup>
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import FooterTop from '@/components/footers/FooterTop.vue'
import FooterBottom from '@/components/footers/FooterBottom.vue'
import BestSellingCourses from '@/components/BestSellingCourses.vue'
import TopInsctructors from '@/components/TopInsctructors.vue'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

import { useUserStore } from '@/stores/user'
import { reactive, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const categoryId = route.params.categoryId

const state = reactive({
  category: {},
  isLoading: true,
  instructor: [],
})

// Carousel state
const currentIndex = ref(0)

// Computed value for visible tools based on container size
const visibleTools = ref(5) // Adjust this based on your design or calculate dynamically

// Navigation functions
const prev = () => {
  currentIndex.value = Math.max(currentIndex.value - 1, 0)
}

const next = () => {
  currentIndex.value = Math.min(
    currentIndex.value + 1,
    state.category.tools.length - visibleTools.value,
  )
}
onMounted(async () => {
  try {
    const categoryResponse = await axios.get(`/api/categories/${categoryId}`)
    state.category = categoryResponse.data
  } catch (error) {
    console.error('Error fetching category: ', error)
    toast.error('Failed to fetch category details')
  } finally {
    state.isLoading = false
  }
})
</script>
<template>
  <NavBarTop />
  <NavBarBottom />
  <section v-if="!state.isLoading" class="my-2 lg:my-10">
    <BestSellingCourses
      :limit="5"
      :category="state.category"
      :perRow="5"
      :showButton="false"
      :title="`Best selling courses in ${state.category.name}`"
      titlePosition="center"
    />
    <div class="flex flex-col mx-4 lg:mx-36">
      <div class="flex justify-between">
        <span class="font-primary text-font text-base lg:text-xl font-bold"> Popular tools </span>
        <div class="flex gap-2 items-center justify-center">
          <button @click="prev" :disabled="currentIndex === 0">
            <ArrowLeftIcon
              class="text-gray_2 w-5 lg:w-7 hover:text-primary"
              :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
            />
          </button>
          <button
            @click="next"
            :disabled="currentIndex === state.category.tools.length - visibleTools"
          >
            <ArrowRightIcon
              class="text-gray_2 w-5 lg:w-7 hover:text-primary"
              :class="{
                'opacity-50 cursor-not-allowed':
                  currentIndex === state.category.tools.length - visibleTools,
              }"
            />
          </button>
        </div>
      </div>

      <div class="relative w-full overflow-hidden mt-4">
        <div
          class="flex transition-transform duration-500"
          :style="{ transform: `translateX(-${currentIndex * (100 / visibleTools)}%)` }"
        >
          <div
            v-for="(tool, index) in state.category.tools"
            :key="index"
            class="flex-shrink-0 w-[calc(100%/5)] px-2"
          >
            <div
              class="my-4 rounded-3xl shadow-md bg-background text-center border-2 border-tertiary transition-transform hover:bg-fourth hover:scale-105 hover:shadow-xl"
            >
              <button class="flex items-center justify-center w-full h-full p-4 lg:p-6 lg:py-8">
                <h3 class="font-primary font-medium text-font text-sm lg:text-base">{{ tool }}</h3>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TopInsctructors
      class="my-10"
      :limit="5"
      :title="`Popular instructors in ${state.category.name}`"
      :cta="false"
    />
  </section>
  <div v-else>
    <LoadingAnimation />
  </div>
  <FooterTop />
  <FooterBottom />
</template>
