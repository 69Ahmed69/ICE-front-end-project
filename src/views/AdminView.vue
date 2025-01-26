<script setup>
import { ref, reactive } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import IceButton from '@/components/ui elements/IceButton.vue'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'

const toast = useToast()

const username = ref('')
const password = ref('')
const passwordVisible = ref(false)
const isLoggedIn = ref(false)
const fieldsWarning = ref('')
const expandedRequestId = ref(null)

const state = reactive({
  requests: [],
  isLoading: true,
})

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const handleLogin = async () => {
  if (!username.value || !password.value) {
    fieldsWarning.value = 'Please make sure to fill out all the required fields.'
    return
  }
  try {
    const response = await axios.get(`/api/admins?username=${username.value}`)

    if (response.data.length === 0) {
      fieldsWarning.value = 'Wrong username or password.'
      return
    }

    const user = response.data[0]

    if (user.password !== password.value) {
      fieldsWarning.value = 'Wrong username or password.'
      return
    }
    toast.success('Login successful!')
    isLoggedIn.value = true
    fieldsWarning.value = ''
    fetchRequests()
  } catch (error) {
    console.error('Login failed:', error)
    alert('An error occurred during login.')
  }
}

const fetchRequests = async () => {
  try {
    state.isLoading = true
    const response = await axios.get('/api/requests')
    state.requests = response.data
    console.log(state.requests)
  } catch (error) {
    console.error('Error fetching data: ', error)
  } finally {
    state.isLoading = false
  }
}

const handleDecision = async (request, decision) => {
  try {
    if (decision == 'reject') {
      request.status = 'Rejected'
      await axios.patch(`/api/requests/${request.id}`, {
        status: 'Rejected',
        decisionDate: dayjs().toISOString(),
      })
      toast.success('Request denied successfully!')
    } else {
      request.status = 'Accepted'
      await axios.patch(`/api/requests/${request.id}`, {
        status: 'Accepted',
        decisionDate: dayjs().toISOString(),
      })
      toast.success('Request accpeted successfully!')
      changeUserRole(request.id)
    }
  } catch (error) {
    console.error(`Failed to ${decision} request:`, error)
    toast('An error occurred. Please try again.')
  }
}

const changeUserRole = async (userId) => {
  try {
    await axios.patch(`/api/users/${userId}`, {
      isInstructor: true,
      aboutMe: '',
      rating: 0.0,
      numOfRatings: 0,
      students: 0,
      courses: [],
      website: '',
      twitter: '',
      youtube: '',
      instagram: '',
      github: '',
      linkedIn: '',
      tag: '',
    })
    toast.success("User's role was changed successfully!")
  } catch (error) {
    console.error(`Failed to change user role:`, error)
    toast('An error occurred. Please try again.')
  }
}

const toggleExpand = (requestId) => {
  expandedRequestId.value = expandedRequestId.value === requestId ? null : requestId
}

const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

const filteredRequests = (requests, status) => {
  return requests.filter((request) => request.status === status)
}
</script>

<template>
  <section v-if="!isLoggedIn" class="flex justify-center items-center bg-gray_4 min-h-screen">
    <div
      class="flex flex-col items-center justify-center bg-background shadow-2xl p-6 rounded-3xl w-1/3 h-1/2"
    >
      <div class="flex flex-col gap-4 px-10 lg:px-16 py-4 lg:py-10 w-full h-full">
        <h1 class="text-center text-2xl font-bold mb-4 text-font font-primary">Admin Login</h1>
        <form @submit.prevent="handleLogin" class="flex flex-col items-center w-full h-full gap-4">
          <div class="flex flex-col h-full w-full gap-2">
            <input
              type="text"
              v-model="username"
              placeholder="Username"
              class="text-font py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
            />
          </div>

          <!-- Password Inputs -->
          <div class="flex w-full gap-2">
            <!-- Password Field -->
            <div class="flex flex-col flex-1 gap-2">
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
          <IceButton :priority="1" :size="1" text="Login" type="submit" class="lg:h-10 w-full" />
          <span class="text-danger text-xs lg:text-sm">{{ fieldsWarning }}</span>
        </form>
      </div>
    </div>
  </section>
  <div v-if="isLoggedIn" class="flex bg-gray_4 min-h-screen">
    <div class="flex flex-col bg-background shadow-2xl p-6 rounded-3xl lg:mx-20 lg:my-6 w-full">
      <h2 class="text-2xl font-bold mb-4 font-primary text-font">Requests</h2>

      <div v-if="state.requests.length > 0" class="space-y-8">
        <div>
          <h3 class="text-lg font-medium mb-2 text-gray_1">Pending Requests:</h3>
          <div
            v-for="request in filteredRequests(state.requests, 'Pending')"
            :key="request.id"
            class="border-2 border-tertiary rounded-3xl hover:bg-fourth p-4"
          >
            <div
              @click="toggleExpand(request.id)"
              class="cursor-pointer text-gray_1 text-base text-medium"
            >
              <p><strong>Full Name:</strong> {{ request.fullName }}</p>
              <p><strong>Submitted:</strong> {{ timeAgo(request.submitted) }}</p>
            </div>
            <div
              v-if="expandedRequestId === request.id"
              class="flex justify-between items-center mt-2 cursor-pointer text-gray_1 text-base text-medium"
            >
              <div>
                <p><strong>Phone Number:</strong> {{ request.phoneNumber }}</p>
                <p>
                  <strong>CV: </strong>
                  <a :href="request.cv" target="_blank" class="text-primary hover:underline"
                    >View</a
                  >
                </p>
                <p>
                  <strong>ID Card: </strong>
                  <a :href="request.idCard" target="_blank" class="text-primary hover:underline"
                    >View</a
                  >
                </p>
                <p>
                  <strong>Selfie: </strong>
                  <a :href="request.selfie" target="_blank" class="text-primary hover:underline"
                    >View</a
                  >
                </p>
              </div>

              <div class="mt-4 flex space-x-2">
                <button
                  @click="handleDecision(request, 'accept')"
                  class="bg-success text-white px-4 py-2 rounded-3xl hover:bg-success_dark"
                >
                  Accept
                </button>
                <button
                  @click="handleDecision(request, 'reject')"
                  class="bg-danger text-white px-4 py-2 rounded-3xl hover:bg-danger_dark"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Accepted Requests:</h3>
          <div
            v-for="request in filteredRequests(state.requests, 'Accepted')"
            :key="request.id"
            class="p-4 border rounded"
          >
            <p><strong>Full Name: </strong> {{ request.fullName }}</p>
            <p><strong>Submitted: </strong> {{ timeAgo(request.submitted) }}</p>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Rejected Requests:</h3>
          <div
            v-for="request in filteredRequests(state.requests, 'Rejected')"
            :key="request.id"
            class="p-4 border rounded"
          >
            <p><strong>Full Name: </strong> {{ request.fullName }}</p>
            <p><strong>Submitted: </strong> {{ timeAgo(request.submitted) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center text-2xl font-primary text-font">
    No requests available.
  </div>
</template>
