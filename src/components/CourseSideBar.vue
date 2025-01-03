<script setup>
import IceButton from './ui elements/IceButton.vue'
import {
  ClockIcon,
  ChartBarSquareIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  DocumentDuplicateIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  EnvelopeIcon,
  ComputerDesktopIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const courseUrl = ref(window.location.href)

defineProps({
  course: Object,
  ownsCourse: Boolean,
})

function daysLeft(discountEnd) {
  const today = new Date()
  const endDate = new Date(discountEnd)
  const timeDifference = endDate - today
  const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
  return days > 0 ? `${days} days left at this price!!` : ''
}

const textifyLevel = (level) => {
  if (level === 0) {
    return 'Beginner'
  }
  if (level === 1) {
    return 'Intermediate'
  } else return 'Expert'
}

const formatNumber = (number) => {
  const numberString = number.toString()
  const [integerPart, decimalPart] = numberString.split('.')

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (decimalPart) {
    return formattedIntegerPart + '.' + decimalPart
  } else {
    return formattedIntegerPart
  }
}

const copyLink = () => {
  navigator.clipboard
    .writeText(courseUrl.value)
    .then(() => toast.success('Link copied to clipboard!'))
    .catch(() => toast.error('Failed to copy link!'))
}

const shareOnFacebook = () => {
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl.value)}`
  window.open(facebookShareUrl, '_blank')
}

const shareOnTwitter = () => {
  const text = 'Check out this amazing course!'
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(courseUrl.value)}&text=${encodeURIComponent(text)}`
  window.open(twitterShareUrl, '_blank')
}

const shareViaGmail = () => {
  const subject = 'Check out this course'
  const body = `I found this amazing course and thought you might like it. Check it out here: ${courseUrl.value}`

  const gmailShareUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(gmailShareUrl, '_blank')
}

const shareOnWhatsApp = () => {
  const text = `Check out this amazing course: ${courseUrl.value}`
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappShareUrl, '_blank')
}
</script>

<template>
  <div
    class="flex flex-col mx-16 lg:mx-0 lg:mt-0 mt-8 divide-y-2 divide-tertiary md:w-1/4 bg-background rounded-3xl border-2 border-tertiary shadow-lg lg:right-16 lg:z-50 ease-in duration-500 lg:fixed hover:shadow-xl transition-shadow hover:shadow-gray_2"
  >
    <div class="space-y-1 p-6 pb-4">
      <div class="flex justify-between items-center">
        <div class="space-x-1">
          <span
            v-if="course.price - course.discount > 0 && daysLeft(course.discountEnd) != ''"
            class="text-font font-bold font-primary text-xl"
          >
            ${{ (course.price - course.discount).toFixed(2) }}
          </span>
          <span
            v-else-if="daysLeft(course.discountEnd) == ''"
            class="text-font font-bold font-primary text-xl"
            >${{ course.price.toFixed(2) }}</span
          >
          <span v-else class="text-danger font-primary text-xl font-bold">FREE</span>
          <span
            v-if="course.discount > 0 && daysLeft(course.discountEnd) != ''"
            class="text-gray_3 line-through font-primary text-sm"
          >
            ${{ course.price.toFixed(2) }}
          </span>
        </div>
        <span
          v-if="course.discount > 0 && daysLeft(course.discountEnd) != ''"
          class="bg-fourth rounded-3xl px-2 py-1 text-primary font-medium font-primary text-sm"
          >{{ ((course.discount * 100) / course.price).toFixed(0) }}% OFF</span
        >
      </div>
      <div
        v-if="course.discount > 0 && daysLeft(course.discountEnd) != ''"
        class="text-danger flex text-xs gap-1 font-medium items-center"
      >
        <ClockIcon class="size-4" />
        {{ daysLeft(course.discountEnd) }}
      </div>
    </div>

    <div class="space-y-2 p-4 pb-4">
      <div class="flex justify-between items-center text-sm">
        <div class="flex gap-1 items-center">
          <ClockIcon class="size-5 text-primary" />
          <span class="text-gray_1">Course Duration</span>
        </div>
        <span class="text-gray_2">{{ course.duration }} hours</span>
      </div>
      <div class="flex justify-between items-center text-sm">
        <div class="flex gap-1 items-center">
          <ChartBarSquareIcon class="size-5 text-primary" />
          <span class="text-gray_1">Course Level</span>
        </div>
        <span class="text-gray_2">{{ textifyLevel(course.level) }}</span>
      </div>
      <div class="flex justify-between items-center text-sm">
        <div class="flex gap-1 items-center">
          <UsersIcon class="size-5 text-primary" />
          <span class="text-gray_1">Students Enrolled</span>
        </div>
        <span class="text-gray_2">{{ formatNumber(course.students) }}</span>
      </div>
      <div class="flex justify-between items-center text-sm">
        <div class="flex gap-1 items-center">
          <LanguageIcon class="size-5 text-primary" />
          <span class="text-gray_1">Language</span>
        </div>
        <span class="text-gray_2">{{ course.language }}</span>
      </div>
      <div class="flex justify-between items-center text-sm">
        <div class="flex gap-1 items-center">
          <DocumentTextIcon class="size-5 text-primary" />
          <span class="text-gray_1">Subtitles</span>
        </div>
        <span class="text-gray_2">English</span>
      </div>
    </div>
    <div v-if="!ownsCourse" class="space-y-2 px-4 py-4 flex flex-col items-center">
      <IceButton
        class="w-full"
        text="Buy Now"
        :priority="1"
        :size="4"
        :icon="BanknotesIcon"
        position="right"
      />
      <IceButton
        class="w-full"
        text="Add to Cart"
        :priority="4"
        :size="4"
        :icon="ShoppingCartIcon"
        position="right"
      />
      <div class="flex justify-stretch space-x-2 w-full">
        <IceButton text="Add to Wishlist" :priority="8" :size="1" class="w-1/2" />
        <IceButton text="Gift Course" :priority="8" :size="1" class="w-1/2" />
      </div>
      <span class="text-xs text-gray_3"
        ><b>Note: </b>all course have 30-days money-back guarantee</span
      >
    </div>
    <div v-else class="px-4 py-4 flex flex-col w-full space-y-2">
      <h2 class="text-lg font-medium text-font text-center">You already own this course</h2>
      <RouterLink :to="`/watch-course/${course.id}`">
        <IceButton text="Watch Lecture" :priority="4" :size="4" class="w-full" />
      </RouterLink>
    </div>
    <div class="space-y-3 px-8 py-4 flex flex-col text-sm">
      <h2 class="text-base font-medium text-font">This course Includes:</h2>
      <div class="flex gap-2 items-center">
        <ClockIcon class="size-5 text-primary" />
        <span class="text-gray_1">Liftime access.</span>
      </div>
      <div class="flex gap-2 items-center">
        <CurrencyDollarIcon class="size-5 text-primary" />
        <span class="text-gray_1">30-days money-back guarantee.</span>
      </div>
      <div class="flex gap-2 items-center">
        <ComputerDesktopIcon class="size-5 text-primary" />
        <span class="text-gray_1">Access on all of your devices.</span>
      </div>
    </div>
    <div class="space-y-2 px-4 py-4 flex flex-col text-sm">
      <h2 class="text-base font-medium text-font">Share this course:</h2>
      <div class="flex gap-2 items-center justify-center">
        <button
          @click="copyLink"
          class="p-3 font-medium bg-fourth rounded-full text-font flex flex-nowrap gap-1 hover:bg-tertiary"
        >
          <DocumentDuplicateIcon class="size-5 text-font" />
          Copy
        </button>

        <button @click="shareOnFacebook" class="p-3 bg-fourth rounded-full hover:bg-tertiary">
          <img src="@/assets/social-media/facebook.svg" alt="facebook" class="size-4" />
        </button>

        <button @click="shareOnTwitter" class="p-3 bg-fourth rounded-full hover:bg-tertiary">
          <img src="@/assets/social-media/twitter.svg" alt="twitter" class="size-4" />
        </button>

        <button @click="shareViaGmail" class="p-3 bg-fourth rounded-full hover:bg-tertiary">
          <EnvelopeIcon class="size-5 text-font" />
        </button>

        <button @click="shareOnWhatsApp" class="p-3 bg-fourth rounded-full hover:bg-tertiary">
          <img src="@/assets/social-media/whatsapp.svg" alt="whatsapp" class="size-5" />
        </button>
      </div>
    </div>
  </div>
</template>
