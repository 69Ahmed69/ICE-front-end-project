<script setup>
import { defineProps, ref, onMounted } from 'vue'
import {
  UserIcon,
  CheckIcon,
  ClockIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  HeartIcon,
} from '@heroicons/vue/24/outline'
import IceButton from '../ui elements/IceButton.vue'
import { transparentColor } from '@/utils/color'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import { removeFromCart, addToCart, isInCart } from '@/utils/CartUtils'

const props = defineProps({
  course: Object,
  category: Object,
  instructor: Object,
})

const inCart = ref(false)
const ownsIt = ref(false)
const userStore = useUserStore()
const toast = useToast()

onMounted(() => {
  if (userStore.isSignedIn) {
    for (const ownedCourse of userStore.user.ownedCourses) {
      if (ownedCourse.courseId == props.course.id) {
        ownsIt.value = true
        return
      }
    }
    inCart.value = isInCart(props.course.id, userStore, toast)
  }
})

function handleAddToCart(courseId) {
  if (!userStore.isSignedIn) {
    toast.warning('Please Login to your account to add this course to your cart.')
  } else {
    addToCart(courseId, userStore, toast)
    inCart.value = true
  }
}

function handleRemoveFromCart(courseId) {
  if (userStore.isSignedIn) {
    removeFromCart(courseId, userStore, toast)
    inCart.value = false
  }
}

function formatStudentsCount(students) {
  if (students >= 1_000_000) {
    return (students / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm'
  } else if (students >= 1_000) {
    return (students / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return students.toString()
}

const textifyLevel = (level) => {
  if (level === 0) {
    return 'Beginner'
  }
  if (level === 1) {
    return 'Intermediate'
  } else return 'Expert'
}

const isFilled = ref(false)

function toggleHeart() {
  isFilled.value = !isFilled.value
}
function daysLeft(discountEnd) {
  const today = new Date()
  const endDate = new Date(discountEnd)
  const timeDifference = endDate - today
  const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
  return days > 0 ? `${days} days left at this price!!` : ''
}
</script>

<template>
  <div
    :class="`bg-white pt-2 lg:pt-6 pb-4 lg:pb-10 border-2 border-tertiary flex flex-col rounded-3xl shadow-md p-2 lg:p-4`"
    class="transition-shadow duration-300 ease-out hover:shadow-xl space-y-4"
  >
    <!-- Category -->
    <div class="text-xs lg:text-sm font-medium mb-2">
      <span
        :style="{
          background: transparentColor(props.category.color, 0.2),
          color: props.category.color,
        }"
        class="px-1 lg:px-2 py-1 text-xs rounded-full"
      >
        {{ props.category.name }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="text-xs lg:text-base font-primary font-semibold text-font mb-2 line-clamp-2">
      {{ props.course.title }}
    </h3>

    <!-- Instructor and Rating -->
    <div class="flex items-center justify-between text-xs lg:text-sm mb-2">
      <div class="flex items-center gap-2">
        <img
          :src="props.instructor.image"
          alt="Instructor Avatar"
          class="size-5 lg:size-8 rounded-full object-cover"
        />
        <span class="font-primary font-medium text-gray_2">
          {{ props.instructor.firstName }} {{ props.instructor.lastName }}
        </span>
      </div>
      <div class="flex items-center gap-1 text-xs lg:text-base">
        <img src="../../../public/favicon.ico" alt="Star Icon" class="w-4 lg:w-5" />
        <span class="text-gray_1 font-primary font-bold">
          {{ props.course.rating }}
        </span>
        <span class="text-gray_3 font-primary"> ({{ props.course.ratings }}) </span>
      </div>
    </div>

    <!-- Students, Level, and Duration -->
    <div class="flex justify-between text-xs font-primary flex-wrap">
      <div class="flex items-center lg:gap-1">
        <UserIcon class="size-5 text-secondary" />
        <span class="text-gray_1">{{ formatStudentsCount(props.course.students) }}</span>
        <span class="text-gray_3">students</span>
      </div>
      <div class="flex items-center lg:gap-1">
        <ChartBarIcon class="size-5 text-danger" />
        <span class="text-gray_1">{{ textifyLevel(props.course.level) }}</span>
      </div>
      <div class="flex items-center lg:gap-1">
        <ClockIcon class="size-5 text-success" />
        <span class="text-gray_1">{{ props.course.duration }} hours</span>
      </div>
    </div>

    <!-- Price and Heart -->
    <div class="flex justify-between items-center mb-2">
      <div class="text-sm lg:text-lg text-primary font-primary">
        <span
          v-if="props.course.discount > 0 && daysLeft(props.course.discountEnd) != ''"
          class="line-through text-gray_3"
        >
          ${{ props.course.price }}
        </span>
        <span v-if="daysLeft(props.course.discountEnd) == ''">${{ props.course.price }}</span>
        <span v-else-if="props.course.price - props.course.discount > 0">
          ${{ props.course.price - props.course.discount }}
        </span>
        <span v-else>FREE</span>
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

    <!-- What You'll Learn -->
    <div class="mb-2">
      <h4 class="text-xs lg:text-sm font-semibold text-font mb-1">What you'll learn</h4>
      <ul class="text-xs lg:text-sm text-wrap text-gray_3 space-y-1">
        <li
          v-for="(item, i) in props.course.learningPoints.slice(0, 3)"
          :key="i"
          class="flex items-center space-x-2"
        >
          <CheckIcon class="size-3 lg:size-4 text-success" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col gap-1 lg:gap-2 mt-auto items-center">
      <transition name="flip">
        <div class="relative w-full">
          <span v-if="ownsIt" class="text-gray_1 text-sm lg:text-base font-medium text-center py-2"
            >You already own this course.</span
          >
          <transition v-else name="flip" mode="out-in">
            <IceButton
              v-if="!inCart && !ownsIt"
              key="add-to-cart"
              class="w-full"
              text="Add to Cart"
              :priority="1"
              :size="4"
              :icon="ShoppingCartIcon"
              position="right"
              @click="handleAddToCart(props.course.id)"
            />
            <IceButton
              v-else
              key="remove-from-cart"
              class="w-full"
              text="Remove from Cart"
              :priority="1"
              :size="4"
              :icon="XMarkIcon"
              position="right"
              @click="handleRemoveFromCart(props.course.id)"
            />
          </transition>
        </div>
      </transition>
      <RouterLink class="w-full" :to="`course/${props.course.id}`">
        <IceButton class="w-full" :priority="4" :size="4" text="Course Details" />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Flip animation styles */
.flip-enter-active,
.flip-leave-active {
  transition:
    transform 0.3s,
    opacity 0.3s;
}

.flip-enter-from,
.flip-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}

.flip-enter-to,
.flip-leave-from {
  transform: rotateX(0);
  opacity: 1;
}
</style>
