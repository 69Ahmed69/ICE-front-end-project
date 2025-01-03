<script setup>
import { reactive, onMounted, defineProps, ref, watchEffect } from 'vue'
import { useToast } from 'vue-toastification'
import IceButton from './ui elements/IceButton.vue'
import axios from 'axios'
import {
  DocumentTextIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/vue/24/outline'
import { Menu, MenuItem, MenuButton, MenuItems } from '@headlessui/vue'
import { useUserStore } from '@/stores/user'

const toast = useToast()
const userStore = useUserStore()

const props = defineProps({
  chapter: {
    type: Object,
    required: true,
  },
  video: {
    type: Number,
    required: true,
  },
  ownedVideo: {
    type: Object,
    required: true,
  },
  instructor: {
    type: Object,
    required: true,
  },
  files: {
    type: Array,
  },
  comments: {
    type: Array,
  },
})

const state = reactive({
  isLoading: true,
  replyTo: null, // Tracks the comment being replied to
  replyText: '', // The reply text input
})

function formatStudentsCount(students) {
  if (students >= 1_000_000) {
    return (students / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm'
  } else if (students >= 1_000) {
    return (students / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return students.toString()
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const beautifyDescription = (description) => {
  return description
    .replace(/\n/g, '<br>') // Replace newlines with <br>
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>') // Replace **text** with <b>text</b>
    .replace(/\*/g, '•') // Replace * with •
}

const newComment = ref('')

// Function to cancel the comment
const cancelComment = () => {
  newComment.value = ''
}

const timeAgo = (timestamp) => {
  const now = new Date()
  const then = new Date(timestamp)
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365
  const elapsed = now - then
  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago'
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago'
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago'
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago'
  }
}

const itemsPerPage = 10
const currentPage = ref(1)
const displayedComments = ref([])

watchEffect(() => {
  currentPage.value = 1
  displayedComments.value = props.comments.slice(0, itemsPerPage)
})

const loadMore = () => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  displayedComments.value.push(...props.comments.slice(start, end))
  currentPage.value++
}

const sortByVotes = () => {
  props.comments.sort((a, b) => parseInt(b.votes) - parseInt(a.votes))
}

const sortByMostRecent = () => {
  props.comments.sort((a, b) => new Date(b.time) - new Date(a.time))
}

const handleSort = (type) => {
  if (type === 'recent') {
    sortByMostRecent()
  } else if (type === 'votes') {
    sortByVotes()
  }
}

const isFilled = ref(false)

function toggleHeart() {
  isFilled.value = !isFilled.value
}

const toggleReplies = (comment) => {
  comment.showReplies = !comment.showReplies
}

const toggleReply = (commentId, commentor = null) => {
  if (state.replyTo === commentId) {
    // Close the reply input if it's already open for this comment
    state.replyTo = null
    state.replyText = ''
  } else {
    // Open the reply input for the selected comment
    state.replyTo = commentId
    state.replyText = `@${commentor}`
  }
}

// Function to post the comment
const postComment = async () => {
  if (!newComment.value.trim()) {
    toast.error('Comment cannot be empty')
    return
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let commentId = ''

  for (let i = 0; i < 26; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    commentId += characters[randomIndex]
  }

  const commentData = {
    cid: commentId,
    text: newComment.value.trim(),
    time: new Date().toISOString(),
    author: userStore.user.userName,
    votes: '0',
    replies: '0',
    photo: userStore.user.profilePicture,
    heart: false,
    reply: false,
  }

  try {
    // Fetch the current chapter's comments
    const response = await axios.get(`/api/comments/${props.chapter.chapterId}`)
    const chapterData = response.data

    // Append the new comment to the existing content array
    const updatedContent = [...chapterData.content, commentData]

    // Patch the chapter with the updated content
    await axios.patch(`/api/comments/${props.chapter.chapterId}`, {
      content: updatedContent,
    })

    // Update local state
    props.comments.push(commentData)

    toast.success('Comment posted successfully')
    newComment.value = '' // Clear the input field
  } catch (error) {
    console.error('Error posting comment:', error)
    toast.error('Failed to post comment')
  }
}

const submitReply = async (parentCommentId) => {
  if (!state.replyText.trim()) {
    toast.error('Comment cannot be empty')
    return
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let replyId = ''

  for (let i = 0; i < 26; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    replyId += characters[randomIndex]
  }

  const newReply = {
    cid: `${parentCommentId}.${replyId}`, // Unique reply ID
    text: state.replyText,
    time: new Date().toISOString(),
    author: userStore.user.userName, // Replace with actual user data
    votes: '0',
    replies: '',
    photo: userStore.user.profilePicture, // Replace with user profile picture
    heart: false,
    reply: true,
  }

  try {
    const response = await axios.get(`/api/comments/${props.chapter.chapterId}`)
    const chapterData = response.data

    // Append the new comment to the existing content array
    const updatedContent = [...chapterData.content, newReply]

    // Patch the chapter with the updated content
    await axios.patch(`/api/comments/${props.chapter.chapterId}`, {
      content: updatedContent,
    })

    // Update local state
    props.comments.push(newReply)
    // Clear reply input and close it
    state.replyTo = null
    state.replyText = ''
  } catch (error) {
    console.error('Failed to submit reply:', error)
  }
}
</script>

<template>
  <section class="flex flex-col space-y-4 p-6 lg:w-3/5">
    <div class="bg-background rounded-t-3xl">
      <div class="relative w-full overflow-hidden rounded-t-3xl" style="padding-top: 56.25%">
        <iframe
          class="absolute top-0 left-0 w-full h-full"
          :src="`https://www.youtube.com/embed/${props.chapter.files[video].link}`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    <h1 class="font-primary font-semibold text-font text-base lg:text-xl">
      {{ props.chapter.files[video].name }}
    </h1>
    <div class="flex justify-between items-center">
      <div class="flex space-x-2">
        <RouterLink :to="{ path: `/instructor/${instructor.id}` }"
          ><img
            :src="instructor.image"
            alt="instructor-image"
            class="rounded-full border-2 object-cover border-tertiary size-12 lg:size-14 hover:border-primary"
        /></RouterLink>
        <div class="flex flex-col py-1 text-xs lg:text-sm">
          <RouterLink :to="{ path: `/instructor/${instructor.id}` }">
            <span class="text-font font-primary font-bold text-sm lg:text-base hover:underline"
              >{{ instructor.firstName }} {{ instructor.lastName }}</span
            >
          </RouterLink>
          <div class="flex gap-1 text-sm lg:text-base">
            <span class="text-gray_1 font-medium">{{
              formatStudentsCount(instructor.students)
            }}</span>
            <span class="text-gray_2">students</span>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <div class="flex gap-1 text-sm lg:text-base">
          <span class="text-gray_2">Last update:</span>
          <span class="text-gray_1 font-medium">{{ formatTimestamp(chapter.lastUpdate) }}</span>
        </div>
        <div class="flex gap-1 text-sm lg:text-base">
          <span class="text-gray_2">Comments:</span>
          <span class="text-gray_1 font-medium">{{ props.comments.length }}</span>
        </div>
      </div>
    </div>
    <div class="flex rounded-3xl border-b-2 border-primary text-gray_1 text-sans">
      <button
        class="flex-1 rounded-bl-3xl p-4 font-medium hover:text-font hover:bg-fourth text-center"
        @click="scrollTo('Description')"
      >
        Description
      </button>
      <button
        class="flex-1 p-4 font-medium hover:bg-fourth hover:text-font text-center"
        @click="scrollTo('Lecture Notes')"
      >
        Lecture Notes
      </button>
      <button
        class="flex-1 p-4 font-medium hover:bg-fourth hover:text-font text-center"
        @click="scrollTo('Attached Files')"
      >
        Attached Files
        <span class="bg-fourth p-1 font-bold text-primary">{{ files.length }}</span>
      </button>

      <button
        class="flex-1 rounded-br-3xl p-4 font-medium hover:bg-fourth hover:text-font text-center"
        @click="scrollTo('Comments')"
      >
        Comments
      </button>
    </div>
    <div id="Description" class="flex flex-col space-y-4">
      <h1 class="font-primary font-semibold text-font text-base lg:text-xl">Description</h1>
      <p
        class="text-sm lg:text-base text-font ml-4"
        v-html="beautifyDescription(chapter.lectureDescription)"
      ></p>
    </div>
    <div id="Lecture Notes" class="flex flex-col space-y-4">
      <h1 class="font-primary font-semibold text-font text-base lg:text-xl">Lecture Notes</h1>
      <p
        class="text-sm lg:text-base text-font ml-4"
        v-html="beautifyDescription(chapter.lectureNotes)"
      ></p>
    </div>
    <div id="Attached Files" class="flex flex-col space-y-4 mb-4">
      <h1 class="font-primary font-semibold text-font text-base lg:text-xl">
        Attached Files ({{ files.length }})
      </h1>
      <div
        v-for="(file, fileIndex) in files"
        :key="fileIndex"
        class="flex justify-between items-center gap-2 bg-fourth rounded-3xl lg:px-6 p-3"
      >
        <div class="flex gap-1">
          <DocumentTextIcon class="size-10 lg:size-12 text-primary" />
          <div class="flex justify-center flex-col">
            <h1 class="font-sans font-medium text-font text-sm lg:text-base hover:underline">
              {{ file.name }}
            </h1>
            <span class="text-sm lg:text-base font-medium text-gray_2">{{ file.size }} MB</span>
          </div>
        </div>
        <a :href="file.link" target="_blank" rel="noopener noreferrer">
          <IceButton text="Download File" :priority="1" :size="1" />
        </a>
      </div>
    </div>
    <div id="Comments" class="flex flex-col space-y-4">
      <div class="flex justify-between items-center">
        <h1 class="font-primary font-semibold text-font text-base lg:text-xl">
          Comments ({{ props.comments.length }})
        </h1>
        <Menu as="div" class="relative">
          <MenuButton
            class="flex justify-between w-full px-4 items-center gap-x-1.5 py-2 text-sm lg:text-base font-semibold shadow-md ring-1 ring-inset rounded-3xl bg-background text-font hover:bg-fourth ring-tertiary"
          >
            Sort By
            <ChevronDownIcon class="size-3 lg:size-5 text-font" aria-hidden="true" />
          </MenuButton>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="absolute right-0 z-20 mt-2 w-56 origin-top-right shadow-lg ring-1 ring-tertiary focus:outline-none bg-background rounded-3xl"
            >
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    @click="handleSort('recent')"
                    :class="[
                      active ? 'bg-fourth text-font' : 'text-gray_1 bg-white',
                      'block w-full px-4 py-2 text-left text-xs lg:text-sm hover:bg-fourth rounded-3xl',
                    ]"
                  >
                    Most Recent
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    @click="handleSort('votes')"
                    :class="[
                      active ? 'bg-fourth text-font' : 'text-gray_1 bg-white',
                      'block w-full px-4 py-2 text-left text-xs lg:text-sm hover:bg-fourth rounded-3xl',
                    ]"
                  >
                    Top Comments
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
      <div class="flex flex-col lg:flex-row items-center gap-2 p-4 bg-transparent rounded-3xl">
        <!-- Profile Picture -->
        <div class="flex items-center gap-2 w-full">
          <img
            :src="userStore.user.profilePicture"
            alt="Profile Picture"
            class="size-10 rounded-full"
          />

          <!-- Text Input -->
          <input
            v-model="newComment"
            type="text"
            placeholder="Write something..."
            class="w-full h-10 py-1 text-font lg:py-2 rounded-full border-2 border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
          />
        </div>

        <!-- Cancel Button -->
        <button
          title="Cancel"
          @click="cancelComment"
          class="flex items-center justify-center p-1 text-white bg-danger rounded-full size-8 shadow-md hover:bg-primary-dark hover:shadow-xl transition-shadow duration-200 ease-in"
        >
          <XMarkIcon class="size-8" />
        </button>

        <!-- Post Button -->
        <button
          title="Post"
          @click="postComment"
          class="flex items-center justify-center p-1 text-white bg-primary rounded-full size-8 shadow-md hover:bg-primary-dark hover:shadow-xl transition-shadow duration-200 ease-in"
        >
          <PaperAirplaneIcon class="size-8" />
        </button>
      </div>
      <div class="flex flex-col space-y-2 w-full px-4">
        <div v-for="comment in displayedComments" :key="comment.cid" class="py-2">
          <div class="flex space-x-4">
            <img
              :src="comment.photo"
              alt="User Avatar"
              class="mt-4 size-6 lg:size-10 rounded-full object-cover"
            />
            <div class="flex flex-col w-full">
              <div class="flex justify-between items-end mb-2">
                <div class="flex items-center gap-2">
                  <span class="font-primary text-base text-font font-medium">
                    {{ comment.author }}
                  </span>
                  <span class="text-sm text-gray_2"> • </span>
                  <span class="text-sm text-gray_2">
                    {{ timeAgo(comment.time) }}
                  </span>
                </div>

                <button
                  @click="toggleHeart"
                  class="flex items-center justify-center p-2 transition-colors duration-200"
                >
                  <HeartIcon
                    :class="[
                      'size-4 lg:size-5 cursor-pointer transition-all duration-300',
                      isFilled ? 'text-danger fill-danger' : 'text-gray_3',
                    ]"
                  />
                </button>
              </div>
              <div class="mb-2">
                <p
                  class="text-sm lg:text-base text-gray_1 font-medium"
                  v-html="beautifyDescription(comment.text)"
                ></p>
              </div>
              <div class="flex items-center justify-between mb-2">
                <button
                  @click="toggleReply(comment.cid, comment.author)"
                  :class="[
                    'flex gap-1 text-gray_2 hover:text-primary',
                    { 'text-primary': state.replyTo === comment.cid },
                  ]"
                >
                  <ChatBubbleOvalLeftIcon class="size-4 lg:size-5" />
                  <span class="text-xs lg:text-sm font-medium">Reply</span>
                </button>
                <span v-if="comment.votes > 0" class="text-xs lg:text-sm text-gray_2 font-medium">
                  {{ comment.votes }} students found this helpful.
                </span>
              </div>
              <div class="flex">
                <button
                  v-if="comment.replies.length > 0"
                  @click="toggleReplies(comment)"
                  class="flex gap-1 text-primary rounded-3xl hover:bg-fourth p-2 px-4"
                >
                  <ChevronDownIcon v-if="!comment.showReplies" class="size-5 lg:size-6" />
                  <ChevronUpIcon v-else class="size-5 lg:size-6" />
                  <span class="font-medium">
                    {{ comment.showReplies ? 'Hide replies' : comment.replies.length + ' replies' }}
                  </span>
                </button>
              </div>
              <div
                v-if="state.replyTo === comment.cid"
                class="flex flex-col lg:flex-row items-center gap-2 p-4 bg-transparent rounded-3xl mt-2"
              >
                <!-- Profile Picture -->
                <div class="flex items-center gap-2 w-full">
                  <img
                    :src="userStore.user.profilePicture"
                    alt="Profile Picture"
                    class="size-10 rounded-full"
                  />

                  <!-- Text Input -->
                  <input
                    v-model="state.replyText"
                    type="text"
                    placeholder="Write something..."
                    class="w-full h-10 py-1 text-font lg:py-2 rounded-full border-2 border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
                  />
                </div>

                <!-- Cancel Button -->
                <button
                  title="Cancel"
                  @click="toggleReply(comment.cid)"
                  class="flex items-center justify-center p-1 text-white bg-danger rounded-full size-8 shadow-md hover:bg-primary-dark hover:shadow-xl transition-shadow duration-200 ease-in"
                >
                  <XMarkIcon class="size-8" />
                </button>

                <!-- Post Button -->
                <button
                  title="Post"
                  @click="submitReply(comment.cid)"
                  class="flex items-center justify-center p-1 text-white bg-primary rounded-full size-8 shadow-md hover:bg-primary-dark hover:shadow-xl transition-shadow duration-200 ease-in"
                >
                  <PaperAirplaneIcon class="size-8" />
                </button>
              </div>
              <div
                v-if="comment.showReplies"
                class="ml-2 lg:ml-4 pl-2 mt-2 space-y-2 border-l-2 border-tertiary"
              >
                <div v-for="reply in comment.replies" :key="reply.cid" class="flex space-x-4">
                  <img
                    :src="reply.photo || comment.photo"
                    alt="Reply Avatar"
                    class="size-6 lg:size-8 rounded-full object-cover"
                  />
                  <div class="flex flex-col w-full">
                    <div class="flex items-center gap-2">
                      <span class="font-primary text-sm text-font font-medium">
                        {{ reply.author }}
                      </span>
                      <span class="text-xs text-gray_2"> • </span>
                      <span class="text-xs text-gray_2">{{ timeAgo(reply.time) }}</span>
                    </div>
                    <div class="mb-2">
                      <p
                        class="text-sm lg:text-base text-gray_1 font-medium"
                        v-html="beautifyDescription(reply.text)"
                      ></p>
                    </div>
                    <div class="flex items-center justify-between mb-2">
                      <button
                        @click="toggleReply(comment.cid, comment.author)"
                        class="flex gap-1 text-gray_2 hover:text-primary"
                      >
                        <ChatBubbleOvalLeftIcon class="size-4 lg:size-5" />
                        <span class="text-xs lg:text-sm font-medium">Reply</span>
                      </button>
                      <span
                        v-if="reply.votes > 0"
                        class="text-xs lg:text-sm text-gray_2 font-medium"
                      >
                        {{ reply.votes }} students found this helpful.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="displayedComments.length === 0" class="text-center text-gray-500">
          Be the first to comment on this lecture.
        </div>
      </div>

      <!-- Load More Button -->
      <IceButton
        v-if="displayedComments.length < props.comments.length"
        text="Load More"
        :size="1"
        :priority="4"
        class="w-1/3 lg:w-1/5 self-left"
        @click="loadMore"
      />
    </div>
  </section>
</template>
