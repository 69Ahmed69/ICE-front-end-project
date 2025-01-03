<script setup>
import IceButton from './ui elements/IceButton.vue'
import Comment from './Comment.vue'
import { Menu, MenuItem, MenuButton, MenuItems } from '@headlessui/vue'
import { ref, computed, defineProps, watchEffect } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  reviews: {
    type: Array,
    required: true,
  },
})

const selectedRating = ref(5)
const itemsPerPage = 10
const currentPage = ref(1)
const displayedReviews = ref([])

const filteredReviews = computed(() => {
  return props.reviews.filter((review) => Math.ceil(review.rating) === selectedRating.value)
})

watchEffect(() => {
  currentPage.value = 1
  displayedReviews.value = filteredReviews.value.slice(0, itemsPerPage)
})

const loadMore = () => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  displayedReviews.value.push(...filteredReviews.value.slice(start, end))
  currentPage.value++
}

const handleSelect = (rating) => {
  selectedRating.value = rating
}
</script>

<template>
  <section class="flex flex-col space-y-4 w-full">
    <!-- Header Section -->
    <div class="flex justify-between items-center">
      <h2 class="font-bold font-primary text-lg text-font lg:text-2xl text-center lg:text-left">
        Student Feedback
      </h2>
      <!-- Ratings Dropdown -->
      <Menu as="div" class="relative">
        <MenuButton
          class="flex justify-between w-full px-4 items-center gap-x-1.5 py-2 lg:py-3 text-sm lg:text-base font-semibold shadow-md ring-1 ring-inset rounded-3xl bg-background text-font hover:bg-fourth ring-tertiary"
        >
          {{ selectedRating }} Star reviews
          <ChevronDownIcon class="size-3 lg:size-5 text-font" aria-hidden="true" />
        </MenuButton>
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="absolute right-0 z-20 mt-2 w-56 origin-top-right shadow-lg ring-1 ring-tertiary focus:outline-none bg-background rounded-3xl"
          >
            <div class="py-1">
              <template v-for="rating in [5, 4, 3, 2, 1]" :key="rating">
                <MenuItem v-slot="{ active }">
                  <button
                    @click="handleSelect(rating)"
                    :class="[
                      active ? 'bg-fourth text-font' : 'text-gray_1 bg-white',
                      'block w-full px-4 py-2 text-left text-xs lg:text-sm hover:bg-fourth rounded-3xl',
                    ]"
                  >
                    {{ rating }} Star reviews
                  </button>
                </MenuItem>
              </template>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>

    <!-- Reviews Section -->
    <div class="flex flex-col space-y-2 divide-y-2 divide-tertiary w-full px-4">
      <div v-for="review in displayedReviews" :key="review.id" class="py-2">
        <Comment :review="review" />
      </div>
      <div v-if="displayedReviews.length === 0" class="text-center text-gray-500">
        No reviews found for the selected rating.
      </div>
    </div>

    <!-- Load More Button -->
    <IceButton
      v-if="displayedReviews.length < filteredReviews.length"
      text="Load More"
      :size="1"
      :priority="4"
      class="w-1/3 lg:w-1/5 self-center"
      @click="loadMore"
    />
  </section>
</template>
