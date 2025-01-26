<script setup>
import UploadImage from '../UploadImage.vue'
import IceButton from '../ui elements/IceButton.vue'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import axios from 'axios'

const userStore = useUserStore()
const toast = useToast()

const nameRegex = /^[A-Za-z]+([- ]?[A-Za-z]+)+$/
const usernameRegex = /^[a-z0-9_.-]+$/

const nameWarning = ref('')
const usernameWarning = ref('')
const canChangeUsername = ref(false)

const firstName = ref(userStore.user.firstName)
const lastName = ref(userStore.user.lastName)
const userName = ref(userStore.user.userName)
const biography = ref(userStore.user.biography)

let oldFirstName = userStore.user.firstName
let oldLastName = userStore.user.lastName
let oldUsername = userStore.user.userName

const validName = ref(false)
const validUsername = ref(false)
const validBiography = ref(false)

const oldPasswordVisible = ref(false)
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

const oldPassword = ref('')
const password = ref('')
const password_ = ref('')

const passwordWarning = ref('')
const oldPasswordWarning = ref('')
const passwordStrength = ref(0)
const passwordMatch = ref(false)
const validPassword = ref(false)
const validOldPassword = ref(false)

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
  } else if (firstName.value == oldFirstName && lastName.value == oldLastName) {
    nameWarning.value = 'Your first name and last name match the old ones.'
    validName.value = false
  } else {
    nameWarning.value = ''
    validName.value = true
  }
}

function checkUsername() {
  if (canChangeUsername) {
    if (!userName.value) {
      usernameWarning.value = 'Username can not be an empty string.'
      validUsername.value = false
    } else if (!usernameRegex.test(userName.value)) {
      usernameWarning.value = 'Username can only contain English characters, digits and . - _'
      validUsername.value = false
    } else if (userName.value == oldUsername) {
      usernameWarning.value = 'This username matches the old one.'
      validUsername.value = false
    } else {
      usernameWarning.value = ''
      validUsername.value = true
    }
  }
}

function checkBiography() {
  if (biography.value.length > 50) {
    biography.value = biography.value.slice(0, 50)
  }
  if (!validBiography.value) {
    validBiography.value = true
  }
}

const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    passwordVisible.value = !passwordVisible.value
  } else if (field === 'confirmPassword') {
    confirmPasswordVisible.value = !confirmPasswordVisible.value
  } else {
    oldPasswordVisible.value = !oldPasswordVisible.value
  }
}

const checkPasswordLength = () => {
  if (oldPassword.value.length < 8) {
    validOldPassword.value = false
    oldPasswordWarning.value = 'Password must be longer than 8 characters.'
  } else {
    validOldPassword.value = true
    oldPasswordWarning.value = ''
  }
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

function checkLastChanged() {
  const lastChanged = dayjs(userStore.user.lastChanged)
  const now = dayjs()
  const diffDays = now.diff(lastChanged, 'day')

  if (diffDays >= 60) {
    canChangeUsername.value = true
  } else {
    canChangeUsername.value = false
    const remainingDays = 60 - diffDays
    usernameWarning.value = `You can change your username in ${remainingDays} days.`
  }
}

onMounted(() => {
  checkLastChanged()
})

const updateUser = async () => {
  try {
    if (validName || validBiography) {
      userStore.user.firstName = firstName.value
      userStore.user.lastName = lastName.value
      userStore.user.biography = biography.value
      await axios.patch(`/api/users/${userStore.user.id}`, {
        firstName: firstName.value,
        lastName: lastName.value,
        biography: biography.value,
      })
      toast.success('Personal details were updated successfully!')
    }

    if (canChangeUsername.value && validUsername.value) {
      userStore.user.userName = userName.value
      userStore.user.lastChanged = dayjs().toISOString()
      await axios.patch(`/api/users/${userStore.user.id}`, {
        userName: userName.value,
        lastChanged: dayjs().toISOString(),
      })
      toast.success('Username was changed successfully!')
    }

    canChangeUsername.value = false
  } catch (error) {
    console.error('Failed to update personal data:', error)
    warningMessage.value = 'Failed to update your personal data. Please try again.'
  } finally {
    checkLastChanged()
    nameWarning.value = ''
    usernameWarning.value = ''
    canChangeUsername.value = false
    firstName.value = userStore.user.firstName
    lastName.value = userStore.user.lastName
    userName.value = userStore.user.userName
    biography.value = userStore.user.biography
    oldFirstName = userStore.user.firstName
    oldLastName = userStore.user.lastName
    oldUsername = userStore.user.userName
    validName.value = false
    validUsername.value = false
    validBiography.value = false
  }
}

const updatePassword = async () => {
  if (validOldPassword && validPassword && passwordMatch) {
    try {
      if (oldPassword.value == userStore.user.password) {
        userStore.user.password = password.value

        await axios.patch(`/api/users/${userStore.user.id}`, {
          password: password.value,
        })

        toast.success('Password changed successfully!')
      } else {
        toast.error('Wrong password!!')
      }
    } catch (error) {
      toast.error('Something went wrong. please try again later.')
      console.error('Error:', error)
    } finally {
      oldPasswordVisible.value = false
      passwordVisible.value = false
      confirmPasswordVisible.value = false

      oldPassword.value = ''
      password.value = ''
      password_.value = ''

      passwordWarning.value = ''
      oldPasswordWarning.value = ''
      passwordStrength.value = 0
      passwordMatch.value = false
      validPassword.value = false
      validOldPassword.value = false
    }
  } else {
    toast.error('Check your input and try again.')
  }
}
</script>

<template>
  <section class="flex flex-col space-y-2 lg:space-y-4 mb-4 lg:mb-6">
    <div class="flex flex-col p-4 rounded-3xl shadow-lg bg-background space-y-2 lg:space-y-4">
      <h2 class="font-primary text-font font-semibold text-base lg:text-xl px-2">
        Account Settings
      </h2>
      <div class="flex gap-4">
        <div class="w-1/4 flex flex-col gap-2 p-4">
          <UploadImage />
          <p class="text-xs lg:text-sm font-sans text-gray_1 text-center">
            It's recommended to use a 1:1 image<br />Image size should be under 1 MB.
          </p>
        </div>
        <div class="flex flex-col gap-2 w-3/4">
          <div class="flex flex-col w-full gap-2">
            <div class="flex items-center gap-2">
              <label class="text-font text-xs lg:text-sm font-medium">Full Name</label>
            </div>
            <div class="flex gap-4">
              <input
                type="text"
                v-model="firstName"
                placeholder="First name..."
                @input="checkName"
                class="py-1 w-1/2 text-font lg:py-2 rounded-full border-2 border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
              />
              <input
                type="text"
                v-model="lastName"
                placeholder="Last name (Optional)"
                @input="checkName"
                class="py-1 w-1/2 text-font lg:py-2 rounded-full border-2 border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
              />
            </div>
            <span class="text-danger text-xs lg:text-sm">{{ nameWarning }}</span>
          </div>

          <!-- User Name Input -->
          <div class="flex flex-col w-full gap-2">
            <div class="flex items-center gap-2">
              <label class="text-font text-xs lg:text-sm font-medium">Username</label>
            </div>
            <input
              type="text"
              v-model="userName"
              @input="checkUsername"
              :disabled="!canChangeUsername"
              placeholder="Username..."
              class="py-1 text-font lg:py-2 rounded-full border-2 border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth disabled:bg-gray_4 disabled:border-gray_3 disabled:cursor-not-allowed"
            />
            <span class="text-danger text-xs lg:text-sm">{{ usernameWarning }}</span>
          </div>

          <!-- Biography Input -->
          <div class="flex flex-col w-full gap-2">
            <div class="flex items-center gap-2">
              <label class="text-font text-xs lg:text-sm font-medium">Biography</label>
            </div>
            <div class="flex gap-2 items-center">
              <input
                type="text"
                v-model="biography"
                @input="checkBiography"
                placeholder="Write something about you..."
                class="py-1 w-full text-font lg:py-2 rounded-full border-2 border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
              />
              <span class="text-font text-sm lg:text-base">{{ biography.length }}/50</span>
            </div>
          </div>
          <IceButton
            :priority="1"
            :size="1"
            :disabled="!validName && !validUsername && !validBiography"
            text="Save Changes"
            class="w-1/5 mt-4 disabled:bg-gray_2 disabled:cursor-not-allowed disabled:border-gray_2"
            @click="updateUser"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col mt-4 lg:mt-8 gap-2 p-4 rounded-3xl shadow-lg bg-background">
      <h2 class="font-primary text-font font-semibold text-base lg:text-xl px-2">
        Change password
      </h2>

      <div class="flex flex-col flex-1 gap-2 lg:ml-4">
        <label class="text-font text-xs lg:text-sm font-medium">Current password</label>
        <div class="relative w-1/2">
          <input
            :type="oldPasswordVisible ? 'text' : 'password'"
            v-model="oldPassword"
            @input="checkPasswordLength"
            placeholder="Your current password..."
            class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth w-full"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-3 flex items-center"
            @click="togglePasswordVisibility('oldPassword')"
          >
            <EyeIcon v-if="!passwordVisible" class="size-5 text-gray_3" />
            <EyeSlashIcon v-else class="size-5 text-gray_3" />
          </button>
        </div>
        <span class="text-danger text-xs lg:text-sm">{{ oldPasswordWarning }}</span>
      </div>

      <div class="flex flex-col flex-1 gap-2 lg:ml-4">
        <label class="text-font text-xs lg:text-sm font-medium">Password</label>
        <div class="relative w-1/2">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="password"
            @input="ratePassword"
            placeholder="New password..."
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
      <div class="flex flex-col flex-1 gap-2 lg:ml-4">
        <label class="text-font text-xs lg:text-sm font-medium">Confirm Password</label>
        <div class="relative w-1/2">
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
      <span class="text-danger text-xs lg:text-sm lg:ml-4">{{ passwordWarning }}</span>
      <IceButton
        :priority="1"
        :size="1"
        :disabled="!validOldPassword || !validPassword || !passwordMatch"
        text="Change password"
        class="w-1/5 mt-2 lg:ml-4 disabled:bg-gray_2 disabled:cursor-not-allowed disabled:border-gray_2"
        @click="updatePassword"
      />
    </div>
  </section>
</template>
