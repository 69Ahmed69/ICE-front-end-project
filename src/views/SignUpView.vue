<script setup>
import { ArrowRightIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import IceButton from '@/components/ui elements/IceButton.vue'
import axios from 'axios'

const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    passwordVisible.value = !passwordVisible.value
  } else if (field === 'confirmPassword') {
    confirmPasswordVisible.value = !confirmPasswordVisible.value
  }
}

const isChecked = ref(false)

const toggleCheck = () => {
  isChecked.value = !isChecked.value
}

const firstName = ref(null)
const lastName = ref(null)
const userName = ref(null)
const email = ref(null)
const password = ref(null)
const token = ref(null)

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const response = await axios.post('http://localhost:1234/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      userName: userName.value,
      email: email.value,
      password: password.value,
    })

    token.value = response.data.token
    localStorage.setItem('token', token.value)
    router.push('/')
  } catch (error) {
    console.error('Registration error:', error)
  }
}

const getToken = () => {
  const storedToken = localStorage.getItem('token')
  email.value = storedToken
  console.log('Retrieved token:', storedToken)
}
</script>

<template>
  <nav
    class="flex flex-row justify-between items-center py-2 lg:py-3 shadow-xl pl-4 lg:pl-24 pr-4 lg:pr-12 shadow-inset-black p-4 fixed inset-x-0 top-0 bg-white"
  >
    <div
      class="flex w-full flex-col lg:flex-row lg:justify-between items-center font-primary gap-2"
    >
      <RouterLink to="/">
        <div class="flex justify-center items-center gap-2">
          <img class="h-10 lg:h-12" src="@/assets/img/logo.svg" alt="ice-logo" />
          <h2 class="text-font font-primary font-bold text-sm lg:text-lg">
            Integrated Classroom Environment
          </h2>
        </div>
      </RouterLink>
      <div class="hidden lg:items-center lg:gap-2 lg:flex">
        <p class="text-xs lg:text-sm text-gray_1">Already have an account?</p>
        <router-link to="/sign-in" class="cta" href="#">
          <IceButton
            :priority="7"
            :size="1"
            text="Sign In"
            class="inline-flex px-2 h-10 hover:border-2"
          />
        </router-link>
      </div>
    </div>
  </nav>
  <main>
    <div class="flex h-screen justify-center items-center lg:items-stretch bg-gray_4">
      <div
        class="lg:w-6/12 bg-gradient-to-t from-tertiary to-primary hidden lg:flex lg:items-center lg:justify-center"
      >
        <img src="@/assets/img/Saly.svg" alt="illustration" />
      </div>

      <div
        class="flex bg-white items-center shadow-xl mx-auto lg:mx-10 mb-6 mt-20 lg:mt-24 rounded-3xl justify-center lg:w-6/12"
      >
        <div class="flex flex-col w-full gap-2 px-10 lg:gap-4 lg:px-32 py-8 lg:py-16">
          <form
            id="signUpForm"
            @submit="handleSubmit"
            class="flex flex-col items-center w-full gap-2 lg:gap-4"
          >
            <h2 class="text-font font-primary font-semibold text-lg lg:text-2xl">
              Create Your account
            </h2>

            <!-- Full Name Inputs -->
            <div class="flex flex-col w-full gap-2">
              <label class="text-font text-xs lg:text-sm font-medium">Full Name</label>
              <div class="flex gap-4">
                <input
                  type="text"
                  v-model="firstName"
                  placeholder="First name..."
                  class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
                />
                <input
                  type="text"
                  v-model="lastName"
                  placeholder="Last name"
                  class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
                />
              </div>
            </div>

            <!-- User Name Input -->
            <div class="flex flex-col w-full gap-2">
              <label class="text-font text-xs lg:text-sm font-medium">User Name</label>
              <input
                type="text"
                v-model="userName"
                placeholder="Username..."
                class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
              />
            </div>

            <!-- Email Input -->
            <div class="flex flex-col w-full gap-2">
              <label class="text-font text-xs lg:text-sm font-medium">Email</label>
              <input
                type="email"
                v-model="email"
                placeholder="Email address"
                class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
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
                    class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth w-full"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-3 flex items-center"
                    @click="togglePasswordVisibility('password')"
                  >
                    <EyeIcon v-if="!passwordVisible" class="size-5 text-gray_3" />
                    <EyeSlashIcon v-else class="size-5 text-gray_3" />
                  </button>
                </div>
              </div>

              <!-- Confirm Password Field -->
              <div class="flex flex-col flex-1 gap-2">
                <label class="text-font text-xs lg:text-sm font-medium">Confirm Password</label>
                <div class="relative">
                  <input
                    :type="confirmPasswordVisible ? 'text' : 'password'"
                    placeholder="Confirm password"
                    class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth w-full"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-3 flex items-center"
                    @click="togglePasswordVisibility('confirmPassword')"
                  >
                    <EyeIcon v-if="!confirmPasswordVisible" class="size-5 text-gray_3" />
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
                <span class="text-xs text-gray_3">I Agree with all of your</span>
                <RouterLink to="/terms-conditions">
                  <span class="text-secondary font-medium hover:underline">
                    Terms & Conditions
                  </span>
                </RouterLink>
              </label>
              <IceButton
                :priority="1"
                :size="1"
                :icon="ArrowRightIcon"
                icon_position="right"
                text="Create Account"
                class="lg:h-10"
              />
            </div>
          </form>
          <!-- Divider -->
          <div
            class="text-xs lg:text-sm text-gray_2 font-medium flex items-center justify-center gap-2"
          >
            <span class="flex-1 h-[1px] bg-tertiary"></span> SIGN UP WITH
            <span class="flex-1 h-[1px] bg-tertiary"></span>
          </div>

          <!-- Social Login Buttons -->
          <div
            class="flex flex-col lg:flex-row lg:w-full mb-6 lg:mb-0 gap-4 px-4 lg:px-12 justify-center items-center text-xs lg:text-sm text-font font-primary font-medium"
          >
            <!-- Google Button -->
            <button
              class="flex justify-center items-center gap-2 border w-48 lg:w-1/2 hover:bg-fourth border-primary rounded-full transition-shadow hover:shadow-xl ease-in duration-200"
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
              class="flex justify-center items-center gap-2 border w-48 lg:w-1/2 hover:bg-secondary_trans border-secondary rounded-full transition-shadow hover:shadow-xl ease-in duration-200"
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
            <p class="text-sm font-medium text-gray_1">Already have an account?</p>
            <router-link to="/sign-in" class="cta" href="#">
              <IceButton :priority="2" :size="1" text="Sign In" class="px-4" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
