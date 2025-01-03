<script setup>
import { ArrowRightIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { ref, reactive, onMounted } from 'vue'
import IceButton from '@/components/ui elements/IceButton.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

const nameRegex = /^[A-Za-z]+([- ]?[A-Za-z]+)+$/
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const usernameRegex = /^[a-z0-9_.-]+$/

const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    passwordVisible.value = !passwordVisible.value
  } else if (field === 'confirmPassword') {
    confirmPasswordVisible.value = !confirmPasswordVisible.value
  }
}

const toggleCheck = () => {
  isChecked.value = !isChecked.value
  if (isChecked.value) {
    termsWarning.value = ''
  }
}

const state = reactive({
  isLoading: false,
})

const nameWarning = ref('')
const usernameWarning = ref('')
const emailWarning = ref('')
const passwordWarning = ref('')
const termsWarning = ref('')
const passwordStrength = ref(0)
const passwordMatch = ref(true)
const isChecked = ref(false)

const firstName = ref(null)
const lastName = ref(null)
const userName = ref(null)
const email = ref(null)
const password = ref(null)
const password_ = ref(null)

const validName = ref(false)
const validUsername = ref(false)
const validEmail = ref(false)
const validPassword = ref(false)

function checkName() {
  if (!firstName.value) {
    nameWarning.value = 'First name is required.'
    validName.value = false
  } else if (
    !nameRegex.test(firstName.value) ||
    (lastName.value && !nameRegex.test(lastName.value))
  ) {
    nameWarning.value = "Your name can't contain digits or special characters."
    validName.value = false
  } else {
    nameWarning.value = ''
    validName.value = true
  }
  sessionStorage.setItem('firstName', firstName.value)
  sessionStorage.setItem('lastName', lastName.value)
}

function checkUsername() {
  if (!userName.value) {
    usernameWarning.value = 'Username is required.'
    validUsername.value = false
  } else if (!usernameRegex.test(userName.value)) {
    usernameWarning.value = 'Username can only contain English characters, digits and . - _'
    validUsername.value = false
  } else {
    usernameWarning.value = ''
    validUsername.value = true
  }
  sessionStorage.setItem('username', userName.value)
}

function checkEmail() {
  if (!email.value) {
    emailWarning.value = 'Email is required.'
    validEmail.value = false
  } else if (!emailRegex.test(email.value)) {
    emailWarning.value = 'Please enter a valid email.'
    validEmail.value = false
  } else {
    emailWarning.value = ''
    validEmail.value = true
  }
  sessionStorage.setItem('email', email.value)
}

function ratePassword() {
  let rating = 0
  let lengthWeight = 0
  let varietyWeight = 0
  if (password.value.length < 8) {
    passwordStrength.value = 0
    passwordWarning.value = 'Password must be longer than 8 characters.'
    validPassword.value = false
    return
  } else {
    lengthWeight = lengthWeight + Math.ceil((password.value.length - 8) / 4)
    if (lengthWeight > 5) lengthWeight = 5
  }
  if (/[a-z]/.test(password.value)) varietyWeight++
  if (/[A-Z]/.test(password.value)) varietyWeight++
  if (/\d/.test(password.value)) varietyWeight++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) varietyWeight = varietyWeight + 2

  rating = lengthWeight + varietyWeight
  validPassword.value = true
  if (rating <= 3) {
    passwordStrength.value = 1
    passwordWarning.value = `Weak ${rating}/10`
  } else if (rating <= 6) {
    passwordStrength.value = 2
    passwordWarning.value = `Not bad ${rating}/10`
  } else if (rating <= 9) {
    passwordStrength.value = 3
    passwordWarning.value = `Strong ${rating}/10`
  } else if (rating == 10) {
    passwordStrength.value = 4
    passwordWarning.value = `ICE SOLID!! ${rating}/10`
  }
}

function checkPasswordMatch() {
  if (password.value != password_.value) {
    passwordWarning.value = "Passwords don't match."
    passwordMatch.value = false
  } else {
    passwordMatch.value = true
    ratePassword()
  }
}

const handleSubmit = async () => {
  if (!isChecked.value) {
    termsWarning.value = "You didn't agree to our terms and conditions."
    return
  }

  if (
    !validName.value ||
    !validUsername.value ||
    !validEmail.value ||
    !validPassword.value ||
    !passwordMatch.value
  ) {
    termsWarning.value = 'Please make sure to fill out all the required fields correctly.'
    return
  }
  try {
    state.isLoading = true

    // Check email and username concurrently
    const [emailCheck, usernameCheck] = await Promise.all([
      axios.get(`/api/users?email=${email.value}`),
      axios.get(`/api/users?userName=${userName.value}`),
    ])

    let validationFailed = false

    if (emailCheck.data.length > 0) {
      emailWarning.value = 'This email is already in use.'
      validationFailed = true
    } else {
      emailWarning.value = ''
    }

    if (usernameCheck.data.length > 0) {
      usernameWarning.value = 'This username is already taken.'
      validationFailed = true
    } else {
      usernameWarning.value = ''
    }

    if (validationFailed) return

    // Generate token and expiry
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''

    // Generate a random 32-character token
    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      token += characters[randomIndex]
    }
    const expiryTimestamp = Date.now() + 3 * 60 * 60 * 1000

    // Register user
    await axios.post('/api/users', {
      authentication: {
        token: token,
        expires: expiryTimestamp,
      },
      userName: userName.value,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      profilePicture: 'https://i.imgur.com/X6SlXuE.jpeg',
      biography: '',
      password: password.value,
      isInstructor: false,
      ownedCourses: [],
    })

    // Fetch user details
    const response = await axios.get(`/api/users?userName=${userName.value}`)
    const user = response.data[0]

    // Set cookies
    document.cookie = `ice-token=${token}; path=/; max-age=${60 * 60 * 3}` // 3 hours
    document.cookie = `username=${user.userName}; path=/; max-age=${60 * 60 * 3}` // 3 hours

    // Update user store
    userStore.signIn(user)
    userStore.removeInstructor()

    // Success message and navigation
    router.push('/')
    toast.success(`You were registered successfully, ${firstName.value}.`)
    state.isLoading = false
  } catch (error) {
    console.error(error)
    toast.error('Oops. Something went wrong, please try again later.')
  } finally {
    state.isLoading = false
  }
}

onMounted(() => {
  if (sessionStorage.getItem('firstName') || sessionStorage.getItem('lastName')) {
    firstName.value = sessionStorage.getItem('firstName') || ''
    lastName.value = sessionStorage.getItem('lastName') || ''
    checkName()
  }
  if (sessionStorage.getItem('email')) {
    email.value = sessionStorage.getItem('email')
    checkEmail()
  }
  if (sessionStorage.getItem('username')) {
    userName.value = sessionStorage.getItem('username')
    checkUsername()
  }
})
</script>

<template>
  <nav class="w-full py-2 lg:py-3 shadow-xl lg:pl-24 lg:pr-12 p-4 bg-white">
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
        <p class="text-xs lg:text-sm text-gray_1">Already have an account?</p>
        <router-link to="/sign-in" class="cta" href="#">
          <IceButton :priority="4" :size="1" text="Sign In" class="w-28 h-10" />
        </router-link>
      </div>
    </div>
  </nav>
  <main v-if="!state.isLoading">
    <div class="flex h-screen lg:h-auto justify-center items-center bg-gray_4">
      <!-- Left Section -->
      <div
        class="lg:w-1/2 h-screen bg-gradient-to-t from-tertiary to-primary hidden lg:flex lg:items-center lg:justify-center"
      >
        <img class="object-cover" src="@/assets/img/Saly.svg" alt="illustration" />
      </div>
      <div
        class="flex bg-white items-center justify-center shadow-xl mx-2 lg:mx-10 my-auto rounded-3xl lg:w-1/2"
      >
        <div class="flex flex-col w-full gap-2 px-10 lg:gap-4 lg:px-16 py-8 lg:py-12">
          <form
            id="signUpForm"
            @submit.prevent="handleSubmit"
            class="flex flex-col items-center w-full gap-2 lg:gap-4"
          >
            <h2 class="text-font font-primary font-semibold text-lg lg:text-2xl">
              Create Your account
            </h2>

            <!-- Full Name Inputs -->
            <div class="flex flex-col w-full gap-2">
              <div class="flex items-center gap-2">
                <label class="text-font text-xs lg:text-sm font-medium">Full Name</label>
                <span class="text-danger text-xs lg:text-sm">{{ nameWarning }}</span>
              </div>
              <div class="flex gap-4">
                <input
                  type="text"
                  v-model="firstName"
                  placeholder="First name..."
                  @input="checkName"
                  class="py-1 w-1/2 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
                />
                <input
                  type="text"
                  v-model="lastName"
                  placeholder="Last name (Optional)"
                  @input="checkName"
                  class="py-1 w-1/2 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
                />
              </div>
            </div>

            <!-- User Name Input -->
            <div class="flex flex-col w-full gap-2">
              <div class="flex items-center gap-2">
                <label class="text-font text-xs lg:text-sm font-medium">Username</label>
                <span class="text-danger text-xs lg:text-sm">{{ usernameWarning }}</span>
              </div>
              <input
                type="text"
                v-model="userName"
                @input="checkUsername"
                placeholder="Username..."
                class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
              />
            </div>

            <!-- Email Input -->
            <div class="flex flex-col w-full gap-2">
              <div class="flex items-center gap-2">
                <label class="text-font text-xs lg:text-sm font-medium">Email</label>
                <span class="text-danger text-xs lg:text-sm">{{ emailWarning }}</span>
              </div>
              <input
                type="email"
                v-model="email"
                @input="checkEmail"
                placeholder="Email address..."
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
                    @input="ratePassword"
                    placeholder="Password..."
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
                    placeholder="Confirm password..."
                    v-model="password_"
                    @input="checkPasswordMatch"
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
            <span
              :class="[
                'text-xs lg:text-sm font-medium',
                { 'text-danger_dark': passwordStrength == 0 },
                { 'text-danger_dark': !passwordMatch },
                { 'text-danger': passwordMatch && passwordStrength == 1 },
                { 'text-warning': passwordMatch && passwordStrength == 2 },
                { 'text-success': passwordMatch && passwordStrength == 3 },
                { 'text-primary': passwordMatch && passwordStrength == 4 },
              ]"
              >{{ passwordWarning }}</span
            >
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
                type="submit"
              />
            </div>
            <span class="text-danger text-xs lg:text-sm">{{ termsWarning }}</span>
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
  <div v-else class="flex items-center justify-center">
    <LoadingAnimation />
  </div>
</template>
