<script setup>
import fullSnowflake from '@/assets/rating/full-snowflake.svg'
import halfSnowflake from '@/assets/rating/half-snowflake.svg'
import hollowSnowflake from '@/assets/rating/hollow-snowflake.svg'
import { defineProps, computed } from 'vue'

const props = defineProps({
  rating: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 5,
  },
  size: {
    type: Number,
    required: false,
    default: 1,
  },
})

const snowflakeArray = computed(() => {
  const roundedRating = Math.round(props.rating * 2) / 2

  const full = Math.floor(roundedRating)
  const half = roundedRating % 1 !== 0 ? 1 : 0
  const empty = 5 - full - half
  return {
    full,
    half,
    empty,
  }
})

const iconSizeClass = computed(() => {
  return (
    {
      1: 'size-4 lg:size-6',
      2: 'size-5 lg:size-7',
      3: 'size-6 lg:size-8',
    }[props.size] ||
    (() => {
      console.error(`Invalid "size" value: ${props.size}`)
      return 'size-5 lg:size-7'
    })()
  )
})
</script>

<template>
  <div class="flex items-center">
    <img
      v-for="n in snowflakeArray.full"
      :key="'full-' + n"
      :src="fullSnowflake"
      alt="Full Snowflake"
      :class="`${iconSizeClass}`"
    />
    <img
      v-if="snowflakeArray.half > 0"
      :src="halfSnowflake"
      alt="Half Snowflake"
      :class="`${iconSizeClass}`"
    />

    <img
      v-for="n in snowflakeArray.empty"
      :key="'hollow-' + n"
      :src="hollowSnowflake"
      alt="Hollow Snowflake"
      :class="`${iconSizeClass}`"
    />
  </div>
</template>
