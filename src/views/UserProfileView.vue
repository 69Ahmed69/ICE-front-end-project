<script setup>
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import FooterTop from '@/components/footers/FooterTop.vue'
import FooterBottom from '@/components/footers/FooterBottom.vue'
import IceButton from '@/components/ui elements/IceButton.vue'
import UserDashboard from '@/components/user pages/UserDashboard.vue'
import UserWishlist from '@/components/user pages/UserWishlist.vue'
import UserSettings from '@/components/user pages/UserSettings.vue'
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { ArrowRightIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import axios from 'axios'

const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const pages = ['Dashboard', 'Courses', 'Wishlist', 'Settings']

const selectedPage = ref('Dashboard')

const state = reactive({
  isLoading: false,
  courses: [],
  instructors: [],
  request: null,
})

onMounted(async () => {
  try {
    const fetchedCourses = await Promise.all(
      userStore.user.ownedCourses.map(async (course) => {
        const response = await axios.get(`/api/courses/${course.courseId}`)
        return response.data
      }),
    )
    state.courses = fetchedCourses
  } catch (error) {
    console.error('Error fetching courses: ', error)
    toast.error('Failed to fetch course details.')
  }

  try {
    const response = await axios.get(`/api/requests/${userStore.user.id}`)
    state.request = response.data
    const days = countDays(state.request)
    if (!days) {
      state.request = null
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn('No request found for this user.')
      state.request = null
    } else {
      console.error('Error fetching request: ', error)
    }
  }

  try {
    const fetchedInstructors = await Promise.all(
      state.courses.map(async (course) => {
        const response = await axios.get(`/api/instructors/${course.instructor}`)
        return response.data
      }),
    )
    state.instructors = fetchedInstructors
  } catch (error) {
    console.error('Error fetching instructors: ', error)
    toast.error('Failed to fetch instructor details.')
  }
})

const getCookie = (name) => {
  const cookies = document.cookie.split('; ')
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`))
  return cookie ? cookie.split('=')[1] : null
}

const signOut = async () => {
  const token = getCookie('ice-token')
  const username = getCookie('username')

  if (token && username) {
    const response = await axios.get(`/api/users?userName=${username}`)
    if (response.data.length > 0) {
      const user = response.data[0]

      // Invalidate the token in the database
      await axios.patch(`/api/users/${user.id}`, {
        authentication: {
          token: null,
          expires: null,
        },
      })
    }
  }

  // Clear cookies
  document.cookie = 'ice-token=; path=/; max-age=0'
  document.cookie = 'username=; path=/; max-age=0'

  // Reset user store
  userStore.signOut()
  userStore.removeInstructor()

  // Redirect to the login page
  router.push('/')
  toast.success('You have successfully signed out.')
}

function countDays(request) {
  const lastChanged = dayjs(request.submitted)
  const now = dayjs()
  const diffDays = now.diff(lastChanged, 'day')
  if (30 - diffDays > 0) {
    console.log('HI')
    return 30 - diffDays
  } else return null
}
</script>

<template>
  <NavBarTop />
  <NavBarBottom />
  <section v-if="!state.isLoading">
    <div class="flex flex-col bg-gray_4 lg:pt-4">
      <div
        class="flex flex-col space-y-2 lg:space-y-0 items-center justify-center mt-2 p-4 lg:p-8 lg:px-12 mx-6 lg:mx-36 lg:flex-row lg:justify-between rounded-t-3xl bg-background shadow-md ease-in duration-300 hover:shadow-xl transition-shadow"
      >
        <div class="flex space-x-4 lg:space-x-6">
          <div>
            <img
              :src="userStore.user.profilePicture"
              alt="Instructor avatar"
              class="rounded-full size-24 lg:size-40 object-cover"
            />
          </div>
          <div class="flex justify-center flex-col space-y-2">
            <h1 class="font-primary text-font font-bold text-xl lg:text-2xl">
              {{ userStore.user.firstName }} {{ userStore.user.lastName }}
            </h1>
            <h2 class="font-sans text-gray_2 text-sm lg:text-base font-medium mb-3 lg:mb-4">
              {{ userStore.user.biography }}
            </h2>
          </div>
        </div>
        <div
          class="flex px-4 lg:px-0 w-full lg:justify-center flex-row lg:flex-col lg:items-center lg:w-1/4 space-x-2 lg:space-y-2"
        >
          <IceButton
            v-if="!state.request"
            text="Become Instructor"
            :priority="1"
            :size="1"
            :icon="ArrowRightIcon"
            icon-position="right"
            class="basis-1/2 lg:basis-auto lg:w-full"
            :onClick="
              () => {
                router.push('/become-an-instructor/')
              }
            "
          />
          <div
            v-else-if="state.request.status == 'Pending'"
            class="flex gap-1 items-center text-sm lg:text-base font-medium mb-2"
          >
            <span class="text-gray_1">Your request is </span>
            <span class="text-warning">Pending...</span>
          </div>
          <div
            v-else-if="state.request.status == 'Rejected'"
            class="flex flex-col gap-2 text-sm lg:text-base font-medium mb-2"
          >
            <div class="flex items-center gap-1">
              <span class="text-gray_1">Your request was: </span>
              <span class="text-danger">Rejected</span>
            </div>
            <span class="text-xs lg:text-sm text-gray_2 text-center"
              >You can try again in <b>{{ countDays(state.request) }}</b> days.</span
            >
          </div>
          <IceButton
            text="Log out"
            :priority="4"
            :size="1"
            :onClick="signOut"
            :icon="ArrowLeftEndOnRectangleIcon"
            icon-position="right"
            class="basis-1/2 lg:basis-auto lg:w-full"
          />
        </div>
      </div>
      <div
        class="flex flex-wrap justify-between items-stretch mb-6 mx-6 lg:mx-36 border-t-2 border-tertiary bg-background text-font text-sm font-medium lg:text-base shadow-md rounded-b-3xl"
      >
        <button
          v-for="(page, index) in pages"
          :key="page"
          class="flex-1 text-center px-2 py-4 hover:bg-fourth"
          :class="{
            'border-b-2 border-primary bg-fourth': selectedPage === page,
            'rounded-bl-3xl': index === 0,
            'rounded-br-3xl': index === pages.length - 1,
          }"
          @click="selectedPage = page"
        >
          {{ page }}
        </button>
      </div>
      <div class="mx-6 lg:mx-36">
        <UserDashboard
          v-if="selectedPage == 'Dashboard'"
          :courses="state.courses"
          :instructors="state.instructors.length"
        />
        <div v-else-if="selectedPage == 'Courses'">THIS IS COURSES</div>
        <UserWishlist v-else-if="selectedPage == 'Wishlist'" />
        <div v-else>
          <UserSettings />
        </div>
      </div>
    </div>

    <div class="bg-gray_4">
      <FooterTop />
      <FooterBottom />
    </div>
  </section>
  <div v-else>
    <LoadingAnimation />
  </div>
</template>
