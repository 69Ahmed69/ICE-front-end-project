<script setup>
import { ArrowRightIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/user'
import IceButton from '@/components/ui elements/IceButton.vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const isChecked = ref(false)
const passwordVisible = ref(false)
const userStore = useUserStore()
const toast = useToast()
const router = useRouter()

const email = ref(null)
const password = ref(null)
const fieldsWarning = ref('')

const toggleCheck = () => {
  isChecked.value = !isChecked.value
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const signIn = async () => {
  if (!email.value || !password.value) {
    fieldsWarning.value = 'Please make sure to fill out all the required fields.'
    return
  }
  // Determine if input is an email or username
  const isEmail = email.value.includes('@')
  const queryField = isEmail ? 'email' : 'userName'

  // Fetch the user based on email or username
  const response = await axios.get(`/api/users?${queryField}=${email.value}`)

  if (response.data.length === 0) {
    fieldsWarning.value = 'User not found. Check your input and try again.'
    return
  }

  const user = response.data[0]

  if (user.password !== password.value) {
    fieldsWarning.value = 'Incorrect password. Please try again.'
    return
  }

  // Generate token and expiry
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''

  // Generate a random 32-character token
  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    token += characters[randomIndex]
  }

  const expiryTimestamp = Date.now() + 3 * 60 * 60 * 1000

  // Update the user's token in the database
  await axios.patch(`/api/users/${user.id}`, {
    authentication: {
      token: token,
      expires: expiryTimestamp,
    },
  })
  userStore.signIn(user)
  if (user.isInstructor) {
    userStore.makeInstructor()
  } else {
    userStore.removeInstructor()
  }
  // Store the token and username in cookies
  document.cookie = `ice-token=${token}; path=/; max-age=${60 * 60 * 3}` // 3 hours
  document.cookie = `username=${user.userName}; path=/; max-age=${60 * 60 * 3}` // 3 hours

  if (isChecked.value) {
    const shouldStore = confirm('Do you want to save your email and password for easier login?')
    if (shouldStore) {
      localStorage.setItem('rememberedEmail', email.value)
      localStorage.setItem('rememberedPassword', password.value)
    }
  }
  // Redirect to the home page
  router.push('/')
  toast.success(`Welcome back, ${user.firstName}.`)
}
</script>

<template>
  <nav class="w-full py-2 lg:py-3 shadow-xl lg:pl-24 fixed lg:pr-12 p-4 bg-white">
    <div class="flex flex-col lg:flex-row lg:justify-between items-center font-primary gap-2">
      <RouterLink to="/">
        <div class="flex justify-center items-center gap-2">
          <img class="h-10 lg:h-12" src="@/assets/img/logo.svg" alt="ice-logo" />
          <h2 class="text-font font-primary font-bold text-sm lg:text-lg">
            Integrated Classroom Environment
          </h2>
        </div>
      </RouterLink>

      <div class="hidden lg:items-center lg:gap-2 lg:flex">
        <p class="text-xs lg:text-sm text-gray_1">Don't have an account?</p>
        <router-link to="/sign-up" class="cta" href="#">
          <IceButton :priority="4" :size="1" text="Sign Up" class="w-28 h-10" />
        </router-link>
      </div>
    </div>
  </nav>
  <main>
    <div class="flex h-screen lg:h-auto justify-center items-center bg-gray_4">
      <!-- Left Section -->
      <div
        class="lg:w-1/2 h-screen bg-gradient-to-t from-tertiary to-primary hidden lg:flex lg:items-center lg:justify-center"
      >
        <img class="object-cover" src="@/assets/img/Saly-10.svg" alt="illustration" />
      </div>

      <div
        class="flex bg-white h-auto lg:h-full justify-center items-center shadow-xl lg:mx-10 mb-6 mt-20 lg:mt-24 rounded-3xl lg:w-1/2"
      >
        <div class="flex flex-col gap-4 px-16 lg:px-24 py-8 lg:py-16 w-full h-full">
          <form
            id="signUpForm"
            @submit.prevent="signIn"
            class="flex flex-col items-center w-full h-full gap-4"
          >
            <h2 class="text-font font-primary font-semibold text-lg lg:text-2xl">
              Sign in to your account
            </h2>

            <!-- Email Input -->
            <div class="flex flex-col h-full w-full gap-2">
              <label class="text-font text-xs lg:text-sm font-medium">Email</label>
              <input
                type="text"
                v-model="email"
                placeholder="Username or Email..."
                class="text-font py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
              />
            </div>

            <!-- Password Inputs -->
            <div class="flex w-full gap-2">
              <!-- Password Field -->
              <div class="flex flex-col flex-1 gap-2">
                <label class="text-font text-xs lg:text-sm font-medium">Password</label>
                <div class="relative">
                  <input
                    :type="passwordVisible ? 'text' : 'password'"
                    v-model="password"
                    placeholder="Password"
                    class="text-font py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth w-full"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-3 flex items-center"
                    @click="togglePasswordVisibility()"
                  >
                    <EyeIcon v-if="!passwordVisible" class="size-5 text-gray_3" />
                    <EyeSlashIcon v-else class="size-5 text-gray_3" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between w-full gap-4 lg:mb-4">
              <label class="flex items-center cursor-pointer text-xs gap-1">
                <input type="checkbox" class="hidden" v-model="isChecked" @click="toggleCheck" />
                <span
                  class="size-4 rounded-full border border-primary inline-flex justify-center items-center relative"
                  :class="{ 'bg-primary': isChecked, 'text-white': isChecked }"
                >
                  <CheckIcon v-if="isChecked" class="size-4 text-white" />
                </span>
                <span class="text-xs lg:text-sm text-gray_1 font-medium">Remember me</span>
              </label>
              <IceButton
                :priority="1"
                :size="1"
                :icon="ArrowRightIcon"
                icon_position="right"
                text="Sign In"
                type="submit"
                class="lg:h-10 w-1/2"
              />
            </div>
          </form>
          <span class="text-danger text-xs lg:text-sm">{{ fieldsWarning }}</span>
          <div
            class="text-xs lg:text-sm text-gray_2 font-medium flex items-center justify-center gap-2"
          >
            <span class="flex-1 h-[1px] bg-tertiary"></span> SIGN IN WITH
            <span class="flex-1 h-[1px] bg-tertiary"></span>
          </div>

          <!-- Social Login Buttons -->
          <div
            class="flex flex-col lg:flex-row w-full mb-6 lg:mb-0 gap-4 px-4 lg:px-12 justify-center items-center text-xs lg:text-sm text-font font-primary font-medium"
          >
            <!-- Google Button -->
            <button
              class="flex justify-center items-center gap-2 border w-full lg:w-1/2 hover:bg-fourth border-primary rounded-full transition-shadow hover:shadow-xl ease-in duration-200"
            >
              <div class="w-1/5 p-2 flex items-center justify-center border-r border-primary">
                <img
                  src="@/assets/img/googleIcon.svg"
                  alt="Google Icon"
                  class="w-4 h-4 lg:w-6 lg:h-6"
                />
              </div>
              <div class="w-4/5 flex items-center justify-center">Google</div>
            </button>

            <!-- Facebook Button -->
            <button
              class="flex justify-center items-center gap-2 border w-full lg:w-1/2 hover:bg-secondary_trans border-secondary rounded-full transition-shadow hover:shadow-xl ease-in duration-200"
            >
              <div class="w-1/5 p-2 flex items-center justify-center border-r border-secondary">
                <img
                  src="@/assets/img/facebookIcon.svg"
                  alt="Facebook Icon"
                  class="w-4 h-4 lg:w-6 lg:h-6"
                />
              </div>
              <div class="w-4/5 flex items-center justify-center">Facebook</div>
            </button>
          </div>

          <div class="lg:hidden items-center justify-center gap-2 flex">
            <p class="text-sm font-medium text-gray_1">Don't have an account?</p>
            <router-link to="/sign-up" class="cta" href="#">
              <IceButton :priority="2" :size="1" text="Sign Up" class="px-4" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
