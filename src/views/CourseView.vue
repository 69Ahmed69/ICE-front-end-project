<script setup>
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import CourseHeader from '@/components/CourseHeader.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import CourseSideBar from '@/components/CourseSideBar.vue'
import CourseMainSection from '@/components/CourseMainSection.vue'
import FooterTop from '@/components/footers/FooterTop.vue'
import FooterBottom from '@/components/footers/FooterBottom.vue'
import BestSellingCourses from '@/components/BestSellingCourses.vue'

import { reactive, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const courseId = route.params.id

const state = reactive({
  course: {},
  isLoading: true,
  instructor: [],
})

const fetchInstructor = async (instructorId) => {
  try {
    const response = await axios.get(`/api/instructors/${instructorId}`)
    state.instructor = response.data
  } catch (error) {
    console.error('Error fetching instructor: ', error)
    toast.error('Failed to fetch instructor details')
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  try {
    await delay(10)
    const courseResponse = await axios.get(`/api/courses/${courseId}`)
    state.course = courseResponse.data
    if (state.course.instructor) {
      await fetchInstructor(state.course.instructor)
    }
  } catch (error) {
    console.error('Error fetching course: ', error)
    toast.error('Failed to fetch course details')
    router.push('/404')
  } finally {
    state.isLoading = false
  }
})
const isAtTop = ref(true)
const isNearPageEnd = ref(false)
const pageEndRef = ref(null)

const handleScroll = () => {
  isAtTop.value = window.scrollY === 0
  if (pageEndRef.value) {
    const pageEndPosition = pageEndRef.value.getBoundingClientRect().top
    isNearPageEnd.value = pageEndPosition <= window.innerHeight
  }
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <NavBarTop />
  <NavBarBottom />
  <section v-if="!state.isLoading">
    <div class="flex flex-wrap bg-gray_4 lg:space-x-12 lg:pt-4 lg:max-h-80 lg:pr-12">
      <CourseHeader :course="state.course" :instructor="state.instructor" />
    </div>
    <transition name="sidebar-fade">
      <CourseSideBar
        v-if="!isNearPageEnd"
        :course="state.course"
        :class="['lg:transition-all lg:overflow-auto', isAtTop ? 'lg:top-[160px]' : 'lg:top-8']"
      />
    </transition>
    <CourseMainSection :course="state.course" :instructor="state.instructor" />
    <div id="pageEnd" ref="pageEndRef" class="bg-gray_4">
      <div class="lg:pt-10">
        <BestSellingCourses :limit="4" title="Related Courses" titlePosition="center" />
      </div>

      <FooterTop />
      <FooterBottom />
    </div>
  </section>
  <div v-else>
    <LoadingAnimation />
  </div>
</template>

<style scoped>
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 1s ease;
}

.sidebar-fade-leave-to {
  opacity: 0;
}
</style>
