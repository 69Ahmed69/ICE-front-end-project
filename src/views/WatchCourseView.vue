<script setup>
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import FooterTop from '@/components/footers/FooterTop.vue'
import FooterBottom from '@/components/footers/FooterBottom.vue'
import IceButton from '@/components/ui elements/IceButton.vue'
import WatchCourseMainSection from '@/components/WatchCourseMainSection.vue'
import {
  ArrowLeftIcon,
  FolderIcon,
  ClockIcon,
  PlayCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'
import { PauseIcon, PlayIcon } from '@heroicons/vue/20/solid'
import { reactive, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

function goBack() {
  router.go(-1)
}

const courseId = route.params.id

const state = reactive({
  course: {},
  ownedCourse: {},
  ownedVideo: {},
  isLoading: true,
  instructor: {},
  activeVideo: 0,
  files: [],
  comments: [],
})

const fetchInstructor = async (instructorId) => {
  try {
    const response = await axios.get(`/api/instructors/${instructorId}`)
    Object.assign(state.instructor, response.data)
  } catch (error) {
    console.error(`Error fetching instructor with ID ${instructorId}: `, error)
    toast.error(`Failed to fetch instructor details for ID: ${instructorId}`)
  }
}

function groupComments(comments) {
  const commentMap = {}

  // Initialize a map with all comments
  comments.forEach((comment) => {
    if (!comment.cid.includes('.')) {
      // Original comment
      commentMap[comment.cid] = { ...comment, replies: [], showReplies: false }
    }
  })

  // Link replies to their parent comments
  comments.forEach((comment) => {
    if (comment.cid.includes('.')) {
      const parentId = comment.cid.split('.')[0]
      if (commentMap[parentId]) {
        commentMap[parentId].replies.push(comment)
      }
    }
  })

  // Set showReplies to true only for comments with replies
  Object.values(commentMap).forEach((comment) => {
    if (comment.replies.length > 0) {
      comment.showReplies = false // Default to not showing replies
    }
  })

  // Return only the original comments with their replies
  return Object.values(commentMap)
}

onMounted(async () => {
  // Find the owned course
  state.ownedCourse =
    userStore.user.ownedCourses.find((ownedCourse) => courseId == ownedCourse.courseId) || {}
  try {
    const courseResponse = await axios.get(`/api/courses/${courseId}`)
    Object.assign(state.course, courseResponse.data)

    for (const file of state.course.chapters[0].files) {
      if (file.type == 'video') break
      else state.activeVideo++
    }
    for (const file of state.course.chapters[0].files) {
      if (file.type === 'text') {
        state.files.push(file)
      }
    }
    if (state.course.instructor) {
      await fetchInstructor(state.course.instructor)
    }

    for (const chapter of state.course.chapters) {
      const ownedChapter = state.ownedCourse.chapters.find(
        (owned) => owned.chapterId === chapter.chapterId,
      )

      if (!ownedChapter) {
        const videos = chapter.files
          .filter((file) => file.type === 'video')
          .map((file) => ({
            videoId: file.link,
            completion: false,
            stopped: 0,
          }))

        // Create and push the new chapter
        state.ownedCourse.chapters.push({
          chapterId: chapter.chapterId,
          completion: 0,
          videos: videos,
        })
      }
    }
    state.ownedVideo = state.ownedCourse.chapters[0].videos[0]
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}: `, error)
    toast.error(`Failed to fetch course details for ID: ${courseId}`)
  } finally {
    state.isLoading = false
  }

  try {
    const commentsResponse = await axios.get(
      `/api/comments?id=${state.course.chapters[0].chapterId}`,
    )
    const comments = commentsResponse.data[0]
    state.comments = groupComments(comments.content)
  } catch (error) {
    console.error('Error fetching comments: ', error)
    toast.error('Failed to fetch comments details')
  } finally {
    state.isLoading = false
  }
})

const calculateLectures = (chapters) => {
  let count = 0
  chapters.forEach((chapter) => {
    chapter.files.forEach((file) => {
      if (file.type === 'video') {
        count++
      }
    })
  })
  return count
}

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

const openedChapter = ref(null)
const listeningChapter = ref(0)

function nextLecture() {
  let index = state.activeVideo + 1
  let videosLength = state.course.chapters[listeningChapter.value].files.length
  while (index < videosLength) {
    if (state.course.chapters[listeningChapter.value].files[index].type == 'video') {
      changeVideo(index)
      return
    } else index++
  }
  let chapterIndex = listeningChapter.value + 1
  if (chapterIndex < state.course.chapters.length) {
    toggleChapter(chapterIndex)
    index = 0
    videosLength = state.course.chapters[listeningChapter.value].files.length
    while (index < videosLength) {
      if (state.course.chapters[listeningChapter.value].files[index].type == 'video') {
        changeVideo(index)
        return
      } else index++
    }
  } else {
    toast.warning('You are already watching the last video.')
  }
}

const changeVideo = (videoIndex) => {
  state.activeVideo = videoIndex
  for (const video of state.ownedCourse.chapters[listeningChapter].videos) {
    if (video.videoId == state.course.chapters[listeningChapter].files[videoIndex]) {
      state.ownedVideo = video
      break
    }
  }
}

const toggleChapter = async (index) => {
  if (openedChapter.value === index) {
    openedChapter.value = null
  } else {
    openedChapter.value = index
    listeningChapter.value = index

    state.files = []
    for (const file of state.course.chapters[listeningChapter.value].files) {
      if (file.type === 'text') {
        state.files.push(file)
      }
    }
    state.comments = []
    try {
      const commentsResponse = await axios.get(
        `/api/comments?id=${state.course.chapters[listeningChapter.value].chapterId}`,
      )
      const comments = commentsResponse.data[0]
      state.comments = groupComments(comments.content)
    } catch (error) {
      console.error('Error fetching comments: ', error)
      toast.error('Failed to fetch comments details')
    } finally {
      state.isLoading = false
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleVideoCompletion = (link) => {
  const chapter = state.ownedCourse.chapters[listeningChapter.value]
  let completedVideos = 0

  for (const video of chapter.videos) {
    if (video.videoId === link) {
      video.completion = !video.completion
    }
    if (video.completion) {
      completedVideos++
    }
  }

  chapter.completion = (completedVideos / chapter.videos.length) * 100

  // Update course completion directly
  const totalCompletion = state.ownedCourse.chapters.reduce((sum, ch) => sum + ch.completion, 0)
  state.ownedCourse.completion = Math.floor(totalCompletion / state.ownedCourse.chapters.length)
}

const checkVideoCompletion = (link) => {
  const video = state.ownedCourse.chapters[listeningChapter.value].videos.find(
    (v) => v.videoId === link,
  )
  return video ? video.completion : false
}

function formatCompletion(index) {
  const chapter = state.ownedCourse.chapters[index]
  if (!chapter || chapter.videos.length === 0) {
    return '0% (0/0)'
  }
  const completedCount = Math.floor((chapter.completion * chapter.videos.length) / 100)
  return `${chapter.completion}% (${completedCount}/${chapter.videos.length})`
}

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = Math.floor(((minutes % 60) * 10) / 6)
  if (mins == 0) return `${hours}h`
  else return `${hours}.${mins}h`
}

const calculateChapterLectures = (chapter) => {
  let count = 0
  chapter.files.forEach((file) => {
    if (file.type === 'video') {
      count++
    }
  })
  return count
}

const buttonClass = (chapters, index) => {
  if (index === 0) return 'rounded-t-3xl'
  if (index === chapters.length - 1) return 'rounded-b-3xl'
  return 'rounded-none'
}
const beforeEnter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
}

const enter = (el) => {
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
}

const leave = (el) => {
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
  el.style.height = '0'
  el.style.opacity = '0'
}

const updateOwnedCourse = async () => {
  try {
    const response = await axios.get(`/api/users/${userStore.user.id}`)
    const userData = response.data

    // Find and update the specific course
    const courseIndex = userData.ownedCourses.findIndex(
      (course) => course.courseId === state.ownedCourse.courseId,
    )

    if (courseIndex !== -1) {
      userData.ownedCourses[courseIndex] = state.ownedCourse

      // Update the user data in the backend
      await axios.patch(`/api/users/${userStore.user.id}`, {
        ownedCourses: userData.ownedCourses,
      })

      console.log('Course data updated successfully')
    } else {
      console.error('Course not found in user data')
    }
  } catch (error) {
    console.error('Failed to update course data:', error)
  }
}

onUnmounted(() => {
  updateOwnedCourse()
})
</script>

<template>
  <NavBarTop />
  <NavBarBottom />
  <section v-if="!state.isLoading" class="flex flex-col my-4 lg:my-6 mx-4 lg:mx-6">
    <div
      class="flex flex-col gap-2 justify-center px-2 lg:px-4 lg:w-full lg:justify-between items-center lg:flex-row"
    >
      <div class="flex justify-center items-center gap-2 lg:gap-4">
        <button
          @click="goBack"
          class="hidden p-3 size-12 bg-fourth rounded-full text-font hover:bg-primary hover:text-background lg:flex lg:items-center lg:justify-center shadow-md hover:bg-primary-dark hover:shadow-xl transition-shadow duration-200 ease-in"
        >
          <ArrowLeftIcon class="size-8" />
        </button>
        <div class="flex flex-col gap-2">
          <h1 class="font-primary font-semibold text-font text-base lg:text-lg">
            {{ state.course.title }}
          </h1>
          <div class="flex items-center gap-2">
            <div class="flex justify-center items-center gap-1">
              <FolderIcon class="size-3 lg:size-5 text-primary" />
              <span class="text-xs lg:text-sm font-medium text-gray_1"
                >{{ state.course.chapters.length }} Sections</span
              >
            </div>
            <div class="flex justify-center items-center gap-1">
              <PlayCircleIcon class="size-3 lg:size-5 text-secondary" />
              <span class="text-xs lg:text-sm font-medium text-gray_1"
                >{{ calculateLectures(state.course.chapters) }} Lectures</span
              >
            </div>
            <div class="flex justify-center items-center gap-1">
              <ClockIcon class="size-3 lg:size-5 text-warning" />
              <span class="text-xs lg:text-sm font-medium text-gray_1"
                >{{ state.course.duration }} Hours</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="flex px-4 lg:px-0 w-full justify-center items-center lg:w-1/4 space-x-2">
        <IceButton
          text="Write A Review"
          :priority="4"
          :size="1"
          class="basis-1/2 lg:basis-auto lg:w-full"
        />
        <IceButton
          text="Next Lecture"
          :priority="1"
          :size="1"
          class="basis-1/2 lg:basis-auto lg:w-full"
          @click="nextLecture()"
        />
      </div>
    </div>

    <transition name="sidebar-fade">
      <div
        v-if="!isNearPageEnd"
        :class="[
          'lg:transition-all lg:overflow-auto bg-transparent rounded-b-3xl gap-2 lg:gap-6 px-4 lg:py-6 flex flex-col mx-4 lg:mx-0 lg:mt-0 mt-8 md:w-2/5  lg:right-4 lg:z-50  lg:fixed ',
          isAtTop ? 'lg:top-[210px]' : 'lg:top-4',
        ]"
      >
        <div class="flex flex-col gap-2 lg:gap-4">
          <div class="flex justify-between items-center px-2">
            <h3 class="font-primary font-semibold text-font text-base lg:text-lg">
              Course contents
            </h3>
            <span class="font-medium text-success text-base text-nowrap"
              >{{ state.ownedCourse.completion }}% Completed</span
            >
          </div>
          <div class="w-full h-1.5 bg-success_trans rounded-full">
            <div
              class="h-1.5 bg-success rounded-full"
              :style="{ width: state.ownedCourse.completion + '%' }"
            ></div>
          </div>
        </div>
        <ul
          class="text-gray_1 divide-y-2 divide-tertiary bg-background border-2 border-tertiary rounded-3xl shadow-lg hover:shadow-xl transition-shadow hover:shadow-gray_3 ease-in duration-200"
        >
          <li v-for="(chapter, index) in state.course.chapters" :key="index">
            <button
              @click="toggleChapter(index)"
              :class="buttonClass(state.course.chapters, index)"
              class="flex justify-between items-center w-full px-4 py-4 font-medium hover:bg-fourth transition"
            >
              <div class="flex gap-1 justify-center items-center text-left">
                <ChevronDownIcon
                  v-if="openedChapter !== index"
                  class="size-4 lg:size-6 text-gray_2 transition-transform"
                />
                <ChevronUpIcon v-else class="size-4 lg:size-6 text-primary transition-transform" />
                <span
                  :class="
                    openedChapter === index
                      ? 'text-primary text-xs lg:text-sm '
                      : 'text-xs lg:text-sm'
                  "
                >
                  {{ chapter.title }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center gap-1">
                  <PlayCircleIcon class="size-4 lg:size-5 text-secondary" />
                  <span
                    :class="
                      openedChapter === index
                        ? 'text-xs lg:text-sm text-font'
                        : 'text-xs lg:text-sm text-gray_2 '
                    "
                    >{{ calculateChapterLectures(chapter) }} Lec</span
                  >
                </div>
                <div class="flex justify-center items-center gap-1">
                  <ClockIcon class="size-4 lg:size-5 text-warning" />
                  <span
                    :class="
                      openedChapter === index
                        ? 'text-xs lg:text-sm text-font'
                        : 'text-xs lg:text-sm text-gray_2 '
                    "
                    >{{ formatDuration(chapter.duration) }}</span
                  >
                </div>
                <div class="flex justify-center items-center gap-1">
                  <CheckIcon class="size-4 lg:size-5 text-success" />
                  <span
                    :class="
                      openedChapter === index
                        ? 'text-xs lg:text-sm text-font'
                        : 'text-xs lg:text-sm text-gray_2 '
                    "
                    >{{ formatCompletion(index) }}</span
                  >
                </div>
              </div>
            </button>
            <transition name="dropdown" @before-enter="beforeEnter" @enter="enter" @leave="leave">
              <ul v-show="openedChapter === index" class="px-2">
                <li v-for="(file, fileIndex) in chapter.files" :key="fileIndex">
                  <div
                    @click="changeVideo(fileIndex)"
                    v-if="file.type == 'video'"
                    class="flex gap-2 justify-between items-center cursor-pointer w-full py-2 px-4 rounded-lg text-xs lg:text-sm text-gray_1 hover:bg-fourth"
                    :class="fileIndex == state.activeVideo ? 'bg-fourth' : ''"
                  >
                    <div class="flex justify-center items-center gap-2">
                      <label class="flex items-center cursor-pointer text-xs gap-1">
                        <input
                          type="checkbox"
                          class="hidden"
                          @click="toggleVideoCompletion(file.link)"
                        />
                        <span
                          v-if="checkVideoCompletion(file.link)"
                          class="size-4 rounded-full border bg-primary border-primary inline-flex justify-center items-center relative"
                        >
                          <CheckIcon class="size-4 text-white" />
                        </span>
                        <span
                          v-else
                          class="text-white size-4 rounded-full border border-primary inline-flex justify-center items-center relative"
                        >
                        </span>
                      </label>
                      <span class="font-medium line-clamp-1">{{ file.name }}</span>
                    </div>
                    <div class="flex gap-2">
                      <span class="text-gray_2 font-medium text-nowrap"> {{ file.time }} min </span>
                      <PlayIcon v-if="fileIndex == state.activeVideo" class="size-4 text-gray_2" />
                      <PauseIcon v-else class="size-4 text-gray_2" />
                    </div>
                  </div>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>
    </transition>
    <WatchCourseMainSection
      :ownedVideo="state.ownedVideo"
      :chapter="state.course.chapters[listeningChapter]"
      :video="state.activeVideo"
      :instructor="state.instructor"
      :files="state.files"
      :comments="state.comments"
    />
  </section>
  <div v-else>
    <LoadingAnimation />
  </div>
  <div id="pageEnd" ref="pageEndRef">
    <FooterTop />
    <FooterBottom />
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    height 0.3s ease,
    opacity 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  height: 0;
  opacity: 0;
}
</style>
