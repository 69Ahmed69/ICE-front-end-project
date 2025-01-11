<script setup>
import { XCircleIcon } from '@heroicons/vue/24/outline'
import IceButton from '../ui elements/IceButton.vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { defineProps, defineEmits } from 'vue'
import { removeFromWishlist, addToWishlist } from '@/utils/WishlistUtils'
import { removeFromCart, addToCart } from '@/utils/CartUtils'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import { XMarkIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  courses: Array,
  type: String,
})

const emits = defineEmits(['delete'])

function emitDelete(courseId) {
  emits('delete', courseId)
}

const toast = useToast()
const userStore = useUserStore()

function isInCart(courseId) {
  return userStore.user.shoppingCart.includes(courseId)
}

function isInWishlist(courseId) {
  return userStore.user.wishlist.includes(courseId)
}

function handleRemove(courseId) {
  if (userStore.isSignedIn) {
    if (props.type == 'shoppingCart') {
      handleRemoveFromCart(courseId)
      emitDelete(courseId)
    } else {
      handleRemoveFromWishlist(courseId)
    }
    const index = props.courses.findIndex((course) => course.id == courseId)
    if (index !== -1) {
      props.courses.splice(index, 1)
    }
  }
}

function handleAddToCart(courseId) {
  if (userStore.isSignedIn) {
    addToCart(courseId, userStore, toast)
  }
}

function handleRemoveFromCart(courseId) {
  if (userStore.isSignedIn) {
    removeFromCart(courseId, userStore, toast)
  }
}

function handleAddToWishlist(courseId) {
  if (userStore.isSignedIn) {
    addToWishlist(courseId, userStore, toast)
  }
}

function handleRemoveFromWishlist(courseId) {
  if (userStore.isSignedIn) {
    removeFromWishlist(courseId, userStore, toast)
  }
}

function buyNow(courseId) {
  if (userStore.isSignedIn) {
    if (!isInCart(courseId)) {
      addToCart(courseId, userStore, toast)
    }
    router.push('/shopping-cart/')
  }
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
  <section
    class="flex-col bg-background border-2 rounded-3xl border-tertiary divide-y-2 divide-tertiary shadow-xl"
  >
    <!-- Header -->
    <div
      class="flex items-center space-x-2 pl-10 p-2 text-xs lg:text-sm text-gray_1 font-medium uppercase"
    >
      <span class="w-7/12">Course</span>
      <span class="w-2/12">Price</span>
      <span class="w-3/12">Actions</span>
    </div>

    <!-- Course List -->
    <div
      v-for="course in props.courses"
      :key="course.id"
      class="flex items-center py-3 lg:py-6 px-2"
    >
      <!-- Remove Button -->
      <button @click="handleRemove(course.id)" class="pr-2">
        <XCircleIcon class="size-6 text-gray_2 hover:text-primary" />
      </button>

      <!-- Course Details -->
      <div class="flex space-x-3 w-7/12 pr-2 items-center">
        <!-- Course Image -->
        <div class="w-2/5 shadow-lg rounded-3xl">
          <img
            :src="course.image"
            alt="Course-image"
            class="rounded-3xl object-cover lg:min-h-24 h-full"
          />
        </div>

        <!-- Course Info -->
        <div class="flex flex-col text-xs lg:text-sm w-3/5">
          <!-- Rating -->
          <div class="flex gap-1 mb-2">
            <img src="../../../public/favicon.ico" alt="Rating Icon" class="size-4 lg:size-5" />
            <span class="text-font font-primary font-bold">{{ course.rating }}</span>
            <span class="text-gray_2 font-medium">({{ course.ratings }} reviews)</span>
          </div>

          <!-- Title -->
          <h2 class="text-font font-primary font-medium line-clamp-2 mb-3">
            {{ course.title }}
          </h2>

          <!-- Instructor -->
          <div class="flex gap-1">
            <span class="text-gray_2 font-medium">Course by</span>
            <RouterLink :to="`/instructor/${course.instructor}`">
              <span class="text-gray_1 font-medium hover:underline">
                {{ course.instructorName }}
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="flex space-x-3 w-2/12 items-center">
        <div class="space-x-1">
          <span
            v-if="course.price - course.discount > 0 && daysLeft(course.discountEnd) != ''"
            class="text-font font-medium font-primary text-base lg:text-xl"
          >
            ${{ (course.price - course.discount).toFixed(2) }}
          </span>
          <span
            v-else-if="daysLeft(course.discountEnd) == ''"
            class="text-font font-medium font-primary text-base lg:text-xl"
            >${{ course.price.toFixed(2) }}</span
          >
          <span v-else class="text-danger font-primary text-base lg:text-xl font-medium">FREE</span>
          <span
            v-if="course.discount > 0 && daysLeft(course.discountEnd) != ''"
            class="text-gray_3 line-through font-primary text-sm"
          >
            ${{ course.price.toFixed(2) }}
          </span>
        </div>
        <span
          v-if="course.discount > 0 && daysLeft(course.discountEnd) != ''"
          class="bg-fourth rounded-3xl px-2 py-1 text-primary font-medium font-primary text-sm"
          >{{ ((course.discount * 100) / course.price).toFixed(0) }}% OFF</span
        >
      </div>
      <div v-if="props.type == 'shoppingCart'" class="flex flex-col w-3/12 items-center px-2">
        <transition name="flip">
          <div class="relative w-full">
            <transition name="flip" mode="out-in">
              <IceButton
                v-if="!isInWishlist(course.id)"
                key="add-to-wishlist"
                text="Wishlist"
                :priority="4"
                :size="1"
                class="w-full"
                :icon="HeartIcon"
                position="right"
                @click="handleAddToWishlist(course.id)"
              />
              <IceButton
                v-else
                key="remove-from-wishlist"
                text="Unwish"
                :priority="4"
                :size="1"
                class="w-full"
                :icon="XMarkIcon"
                position="right"
                @click="handleRemoveFromWishlist(course.id)"
              />
            </transition>
          </div>
        </transition>
      </div>
      <div v-else class="flex flex-col space-y-2 w-3/12 items-center px-2">
        <IceButton
          class="w-full"
          text="Buy Now"
          :priority="2"
          :size="1"
          @click="buyNow(course.id)"
        />
        <transition name="flip">
          <div class="relative w-full">
            <transition name="flip" mode="out-in">
              <IceButton
                v-if="!isInCart(course.id)"
                key="add-to-cart"
                text="Add to cart"
                :priority="4"
                :size="1"
                class="w-full"
                :icon="ShoppingCartIcon"
                position="right"
                @click="handleAddToCart(course.id)"
              />
              <IceButton
                v-else
                key="remove-from-cart"
                text="Remove from cart"
                :priority="8"
                :size="1"
                class="w-full"
                :icon="XMarkIcon"
                position="right"
                @click="handleRemoveFromCart(course.id)"
              />
            </transition>
          </div>
        </transition>
      </div>
    </div>
  </section>
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
