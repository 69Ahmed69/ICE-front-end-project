<script setup>
import Rating from './Rating.vue'

defineProps({
  reviews: {
    type: Array,
    required: true,
  },
})

const calculatePercentage = (rating, ratings) => {
  if (!ratings.length) return { count: 0, percentage: 0 }
  const roundedRatings = ratings.map((review) => Math.ceil(review.rating))
  const count = roundedRatings.filter((r) => r === rating).length
  const percentage = Math.round((count / ratings.length) * 100)
  return { count, percentage }
}
</script>

<template>
  <section class="flex flex-col justify-center items-center gap-4">
    <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex space-x-2 lg:space-x-4 w-full">
      <div class="flex">
        <Rating :rating="star" :size="1" />
      </div>
      <div class="flex items-center gap-2 w-3/4">
        <div class="w-full h-2 bg-danger_trans rounded-full overflow-hidden">
          <div
            class="h-2 bg-warning"
            :style="{ width: calculatePercentage(star, reviews).percentage + '%' }"
          ></div>
        </div>
        <span class="text-xs lg:text-sm font-primary font-medium text-font text-nowrap">
          {{ calculatePercentage(star, reviews).count }} ({{
            calculatePercentage(star, reviews).percentage
          }}%)
        </span>
      </div>
    </div>
  </section>
</template>
