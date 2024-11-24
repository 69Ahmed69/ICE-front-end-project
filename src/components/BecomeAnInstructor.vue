<script setup>
import IceButton from './ui elements/IceButton.vue'
import { ArrowRightIcon } from '@heroicons/vue/20/solid'
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="flex flex-col lg:flex-row gap-10 px-40 pb-10">
    <!-- Left Section -->
    <div
      class="flex-1 basis-1/2 bg-gradient-to-t from-background to-primary text-white p-8 rounded-3xl"
    >
      <h2 class="text-3xl font-primary text-font font-bold mb-4">Become an Instructor</h2>
      <p class="text-base font-primary text-font mb-6">
        Share your knowledge with millions of students around the world <br />
        and build a rewarding teaching career.
      </p>
      <RouterLink to="/become-an-instructor">
        <IceButton
          :priority="3"
          text="Start Teaching"
          :size="2"
          :icon="ArrowRightIcon"
          icon_position="right"
        ></IceButton>
      </RouterLink>
    </div>

    <!-- Right Section -->
    <div class="flex-column basis-1/2 text-font pt-8">
      <h1 class="text-3xl font-primary align-center font-semibold">
        Your teaching & earning steps
      </h1>
      <div class="flex-1 grid py-10 grid-cols-2 gap-6">
        <!-- Step 1 -->
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 text-xl font-primary rounded-full bg-secondary_trans text-secondary flex items-center justify-center font-bold"
          >
            1
          </div>
          <p class="text-base font-primary text-font font-medium">Apply to become instructor</p>
        </div>
        <!-- Step 2 -->
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 text-xl font-primary rounded-full bg-fourth text-primary flex items-center justify-center font-bold"
          >
            2
          </div>
          <p class="text-base font-primary text-font font-medium">Build & edit your profile</p>
        </div>
        <!-- Step 3 -->
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 text-xl font-primary rounded-full bg-danger_trans text-danger flex items-center justify-center font-bold"
          >
            3
          </div>
          <p class="text-base font-primary text-font font-medium">Create your new course</p>
        </div>
        <!-- Step 4 -->
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 text-xl font-primary rounded-full bg-success_trans text-success flex items-center justify-center font-bold"
          >
            4
          </div>
          <p class="text-base font-primary text-font font-medium">Start teaching & earning</p>
        </div>
      </div>
    </div>
  </div>
</template>
