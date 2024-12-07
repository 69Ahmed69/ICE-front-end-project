<script setup>
import { reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/user'
import IceButton from '../ui elements/IceButton.vue'
import axios from 'axios'

const state = reactive({
  categories: [],
})

onMounted(async () => {
  try {
    const response = await axios.get('/api/categories')
    state.categories = response.data
  } catch (error) {
    console.error('Error fetching categories: ', error)
  }
})

const topCategories = computed(() => {
  return [...state.categories].sort((a, b) => b.courses - a.courses).slice(0, 4)
})
const userStore = useUserStore()
const userState = computed(() => userStore.isSignedIn)
const instructorState = computed(() => userStore.isInstuctor)
</script>

<template>
  <div v-if="!userState" class="bg-font text-background px-4 lg:px-36 py-2 lg:pt-8 lg:py-4">
    <div class="flex flex-wrap text-center lg:text-start space-y-4 lg:space-y-4">
      <div class="w-full md:w-3/5 flex flex-col space-y-4">
        <div>
          <h2 class="text-xl lg:text-3xl font-primary">
            Start learning with 16.74 Million <br />
            students around the world.
          </h2>
        </div>
        <div
          class="flex flex-wrap items-center justify-center lg:items-start lg:justify-start md:flex-nowrap space-x-6"
        >
          <RouterLink to="/sign-in">
            <IceButton
              class="px-8 hover:bg-tertiary shadow-tertiary hover:text-font"
              text="Join the Family"
              :priority="1"
              :size="2"
          /></RouterLink>
          <RouterLink to="/courses/"
            ><IceButton
              class="bg-gray_4 border-gray_4"
              text="Browse all courses"
              :priority="6"
              :size="2"
          /></RouterLink>
        </div>
      </div>

      <!-- Right Section -->
      <div class="w-full md:w-2/5 flex flex-wrap space-y-4">
        <div
          class="flex w-full space-x-12 justify-center items-center lg:items-start lg:justify-start"
        >
          <div class="space-y-4">
            <h3 class="text-2xl lg:text-4xl font-semibold">16.5k</h3>
            <p class="text-gray_3 text-xs lg:text-base">Online Course</p>
          </div>
          <div class="space-y-4">
            <h3 class="text-2xl lg:text-4xl font-semibold">3.1k</h3>
            <p class="text-gray_3 text-xs lg:text-base">Verified Instructor</p>
          </div>
          <div class="space-y-4">
            <h3 class="text-2xl lg:text-4xl font-semibold">94.1%</h3>
            <p class="text-gray_3 text-xs lg:text-base">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="userState && !instructorState"
    class="bg-font text-background px-4 lg:px-36 py-4 lg:py-4"
  >
    <div class="flex flex-wrap justify-center items-center lg:justify-between">
      <div class="w-full md:w-1/2 flex flex-col space-y-4 lg:space-y-8">
        <div>
          <h2 class="text-2xl lg:text-4xl font-primary text-center lg:text-start">
            Start teaching with us<br />
            and inspire others.
          </h2>
        </div>
        <div>
          <p class="text-gray_3 text-xs lg:text-lg text-center lg:text-start">
            Become an instructor & start teaching with 26k<br />
            certified instructors. Create a success story with<br />
            16.74m Students — Grow yourself in 71 countries.
          </p>
        </div>
        <RouterLink to="/become-an-instructor" class="text-center lg:text-start">
          <IceButton
            class="hover:bg-tertiary w-1/2 shadow-tertiary hover:text-font mb-4 lg:mb-0"
            text="Register Now!!"
            :priority="1"
            :size="2"
        /></RouterLink>
      </div>
      <img src="../../assets/img/CTA.png" alt="Call to Action" class="h-40 lg:h-80" />
    </div>
  </div>
  <footer class="bg-font text-background px-6 lg:px-36 py-4 lg:py-8">
    <div class="flex flex-wrap md:flex-nowrap space-y-4 lg:space-y-10">
      <!-- Left Section -->
      <div class="w-full md:w-1/2 flex flex-col space-y-4">
        <div>
          <img src="../../assets/img/logo.png" alt="Logo" class="h-16 lg:h-20" />
        </div>
        <div>
          <h2 class="text-lg lg:text-2xl font-primary">Integrated Classroom Environment</h2>
        </div>
        <div>
          <p class="text-xs lg:text-sm leading-relaxed text-gray_3">
            We are dedicated to providing the best online learning experience<br />
            with a variety of courses and resources.
          </p>
        </div>
        <div class="flex space-x-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="size-6 lg:size-10 flex items-center justify-center rounded-full bg-gray_1 hover:bg-primary hover:shadow-lg hover:shadow-primary transition"
          >
            <img
              src="../../assets/social-media/facebook-icon.png"
              alt="Facebook"
              class="size-3 lg:size-5"
            />
          </a>
          <a
            href="https://www.x.com"
            target="_blank"
            rel="noopener noreferrer"
            class="size-6 lg:size-10 flex items-center justify-center rounded-full bg-gray_1 hover:bg-primary hover:shadow-lg hover:shadow-primary transition"
          >
            <img
              src="../../assets/social-media/twitter-icon.png"
              alt="Twitter"
              class="size-3 lg:size-5"
            />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="size-6 lg:size-10 flex items-center justify-center rounded-full bg-gray_1 hover:bg-primary hover:shadow-lg hover:shadow-primary transition"
          >
            <img
              src="../../assets/social-media/instagram-icon.png"
              alt="Instagram"
              class="size-3 lg:size-5"
            />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            class="size-6 lg:size-10 flex items-center justify-center rounded-full bg-gray_1 hover:bg-primary hover:shadow-lg hover:shadow-primary transition"
          >
            <img
              src="../../assets/social-media/linkedin-icon.png"
              alt="LinkedIn"
              class="size-3 lg:size-5"
            />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            class="size-6 lg:size-10 flex items-center justify-center rounded-full bg-gray_1 hover:bg-primary hover:shadow-lg hover:shadow-primary transition"
          >
            <img
              src="../../assets/social-media/youtube-icon.png"
              alt="YouTube"
              class="size-3 lg:size-5"
            />
          </a>
        </div>
      </div>

      <!-- Right Section -->
      <div class="w-full md:w-1/2 flex flex-wrap space-y-4">
        <div class="flex justify-between w-full space-x-6">
          <div class="space-y-4">
            <h3 class="text-sm lg:text-lg font-semibold">Top 4 Categories</h3>
            <ul class="text-xs lg:text-base space-y-2 lg:space-y-4 text-gray_3">
              <li v-for="(category, index) in topCategories" :key="index">
                <RouterLink :to="category.link" class="hover:underline">
                  {{ category.name }}
                </RouterLink>
              </li>
            </ul>
          </div>
          <!-- Quick Links -->
          <div class="space-y-4">
            <h3 class="text-sm lg:text-lg font-semibold">Quick Links</h3>
            <ul class="text-xs lg:text-base space-y-2 lg:space-y-4 text-gray_3">
              <li>
                <RouterLink to="/about" class="hover:underline">About</RouterLink>
              </li>
              <li>
                <RouterLink
                  v-if="!instructorState"
                  to="/become-an-instructor"
                  class="flex items-center gap-1 border-b-2 border-primary pb-2"
                >
                  <p class="text-background hover:underline hover:text-primar">
                    Become an Instructor
                  </p>
                  <ArrowRightIcon class="size-3 lg:size-5 text-background hover:text-primary" />
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/about" class="hover:underline">Contact</RouterLink>
              </li>
              <li>
                <RouterLink to="/contact" class="hover:underline">Career</RouterLink>
              </li>
            </ul>
          </div>
          <!-- Support -->
          <div class="space-y-4">
            <h3 class="text-sm lg:text-lg font-semibold">Support</h3>
            <ul class="text-xs lg:text-base space-y-2 lg:space-y-4 text-gray_3">
              <li>
                <RouterLink to="/support/help-center" class="hover:underline"
                  >Help Center</RouterLink
                >
              </li>
              <li>
                <RouterLink to="/support/faq" class="hover:underline">FAQ</RouterLink>
              </li>
              <li>
                <RouterLink to="/terms-of-service" class="hover:underline"
                  >Terms & Conditions</RouterLink
                >
              </li>
              <li>
                <RouterLink to="/privacy-policy" class="hover:underline">Privacy Policy</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
