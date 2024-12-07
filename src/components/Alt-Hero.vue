<script setup>
import IceButton from './ui elements/IceButton.vue'
import { RouterLink } from 'vue-router'
import { ArrowRightIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <div class="bg-gradient-to-r from-background to-fourth">
    <section class="py-10 sm:py-16 lg:py-24">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <p class="text-base font-primary font-semibold tracking-wider text-secondary uppercase">
              An environment for students
            </p>
            <h1 class="mt-4 text-2xl font-bold text-font lg:mt-8 sm:text-4xl xl:text-6xl">
              Learn with Experts Anytime, Anywhere
            </h1>
            <p class="mt-4 text-base text-font lg:mt-8 sm:text-xl">
              Finding the right mentor will grow your skills
              <b>17 times</b> faster!!<br />Our job is to facilitate that :)
            </p>
            <RouterLink to="/sign-up">
              <IceButton
                text="Join for Free"
                :icon="ArrowRightIcon"
                :size="2"
                :priority="3"
                icon_position="right"
                class="mt-5"
              />
            </RouterLink>
            <p class="mt-5 text-gray_1">
              Already a member?
              <RouterLink
                to="/sign-in"
                class="text-font font-bold transition-all duration-200 hover:underline"
              >
                Log in</RouterLink
              >
            </p>
          </div>

          <div>
            <img class="w-full" src="@/assets/img/hero-img.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
