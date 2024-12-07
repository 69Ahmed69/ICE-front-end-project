<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    required: false,
    default: 1, // Number between 1 and 3
    validator: (value) =>
      [1, 2, 3, 4].includes(value) ||
      console.error(`Invalid "size" value: ${value}. Expected 1, 2, or 3.`),
  },
  icon: {
    type: Function, // Icon(Hero Icon)
    required: false,
  },
  icon_position: {
    type: String, // Icon Position('left', 'right')
    required: false,
    default: 'right',
    validator: (value) =>
      ['left', 'right'].includes(value) ||
      console.error(`Invalid "icon_position" value: ${value}. Expected "left" or "right".`),
  },
  priority: {
    type: Number,
    required: false,
    default: 1, // Number between 1 and 9
    validator: (value) =>
      (value >= 1 && value <= 9) ||
      console.error(`Invalid "priority" value: ${value}. Expected a number between 1 and 9.`),
  },
  text: {
    type: String,
    required: false,
    default: 'Click Me',
  },
  onClick: {
    type: Function, // Function for click handler
    required: false,
  },
})

// Dynamically calculate Tailwind classes based on props
const buttonClasses = computed(() => {
  const sizeClasses =
    {
      1: 'px-2 lg:px-5 py-1 lg:py-3 text-xs lg:text-sm',
      2: 'px-3 lg:px-6 py-3 lg:py-4 text-sm lg:text-base',
      3: 'px-4 lg:px-7 py-4 lg:py-5 text-base lg:text-lg',
      4: 'px-3 py-2 text-base',
    }[props.size] ||
    (() => {
      console.error(`Invalid "size" value: ${props.size}`)
      return 'px-2 lg:px-5 py-1 lg:py-3 text-xs lg:text-sm' // Fallback
    })()

  const borderSize =
    {
      1: 'border-2 lg:border-4',
      2: 'border-2 lg:border-4',
      3: 'border-4 lg:border-6',
    }[props.size] || 'border-4'

  const priorityClasses =
    {
      1: `bg-primary text-white ${borderSize} border-primary hover:bg-secondary hover:border-secondary hover:shadow-lg hover:shadow-secondary disabled:opacity-70`,
      2: `bg-tertiary border-tertiary ${borderSize} text-white hover:text-secondary hover:border-secondary hover:shadow-lg hover:shadow-secondary disabled:opacity-70`,
      3: `bg-gray_1 ${borderSize} border-gray_1 text-white hover:text-primary hover:border-primary hover:shadow-lg hover:shadow-primary disabled:opacity-70`,
      4: `bg-fourth text-primary ${borderSize} border-fourth hover:text-secondary hover:border-secondary disabled:opacity-60`,
      5: `bg-secondary_trans ${borderSize} border-secondary_trans text-secondary hover:bg-secondary hover:border-secondary hover:text-background disabled:opacity-60`,
      6: `bg-gray_3 ${borderSize} border-gray_3 text-background hover:border-gray_1 hover:bg-gray_1 disabled:opacity-60`,
      7: `bg-background text-font hover:bg-tertiary disabled:opacity-50`,
      8: `bg-background border-2 border-fourth text-secondary hover:bg-secondary_trans disabled:opacity-50`,
      9: `bg-transparent text-gray_1 hover:bg-gray_4 disabled:opacity-50`,
    }[props.priority] ||
    (() => {
      console.error(`Invalid "priority" value: ${props.priority}`)
      return 'bg-primary text-white disabled:opacity-60' // Fallback
    })()

  return `transition gap-1 duration-200 ease-out hover:ease-in inline-flex font-primary items-center justify-center rounded-full ${sizeClasses} ${priorityClasses}`
})

const textColorClass = computed(() => {
  const baseColor = buttonClasses.value.match(/text-\S+/)?.[0] || 'text-black'
  const hoverColor = buttonClasses.value.match(/hover:text-\S+/)?.[0] || ''
  return `${baseColor} ${hoverColor}`
})

const iconSizeClass = computed(() => {
  return (
    {
      1: 'w-5 h-5',
      2: 'w-6 h-6',
      3: 'w-7 h-7',
      4: 'size-6',
    }[props.size] ||
    (() => {
      console.error(`Invalid "size" value: ${props.size}`)
      return 'w-5 h-5' // Fallback
    })()
  )
})

const isSquare = computed(() => !props.text && props.icon)
</script>

<template>
  <button :class="buttonClasses" @click="onClick">
    <!-- Render icon on the left if specified -->
    <template v-if="icon && icon_position === 'left'">
      <component
        :is="icon"
        :class="`${iconSizeClass} ${textColorClass} ${isSquare ? 'p-0 m-0 w-auto aspect-square' : ''}`"
      />
    </template>

    <!-- Render button text -->
    <span :class="textColorClass">{{ text }}</span>

    <!-- Render icon on the right if specified -->
    <template v-if="icon && icon_position === 'right'">
      <component
        :is="icon"
        :class="`${iconSizeClass} ${textColorClass} ${isSquare ? 'p-0 m-0 w-auto aspect-square' : ''}`"
      />
    </template>
  </button>
</template>
