<script setup>
import IceButton from './ui elements/IceButton.vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  GlobeEuropeAfricaIcon,
  CheckBadgeIcon,
  Square3Stack3DIcon,
  GlobeAltIcon,
  DocumentCheckIcon,
  IdentificationIcon,
  PlayCircleIcon,
  BanknotesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon, BoltIcon, ChartPieIcon } from '@heroicons/vue/20/solid'

const reviews = ref([
  'No problems whatsoever in my 3 years of working with ICE. Amazing team and a great platform.',
  'ICE has transformed my teaching experience, providing me with incredible tools and support.',
  'I recommend ICE to every instructor looking for a reliable and feature-rich platform.',
  'ICE has been a game-changer for my online courses. The user interface is intuitive and the customer support is top-notch.',
  "I've been using ICE for years and I'm always impressed by the constant improvements and new features.",
  'The live chat feature is a lifesaver, allowing me to interact with students in real-time and answer their questions promptly.',
  'ICE has helped me increase my student engagement and improve my overall teaching effectiveness.',
  'I appreciate the flexibility of ICE, allowing me to customize my courses to fit my specific needs and teaching style.',
  'The reporting and analytics features provide valuable insights into student performance and course effectiveness.',
  'I highly recommend ICE to any educator looking for a powerful and user-friendly learning platform.',
])

const currentReview = ref(0)

const prevReview = () => {
  if (currentReview.value > 0) {
    currentReview.value -= 1
  }
}

const nextReview = () => {
  if (currentReview.value < reviews.value.length - 1) {
    currentReview.value += 1
  }
}
</script>

<template>
  <section>
    <div class="flex items-center justify-center flex-col gap-4 px-4 pt-4 lg:px-40 lg:flex-row">
      <div
        class="flex items-center justify-center flex-col gap-2 lg:items-start lg:gap-6 lg:basis-1/2"
      >
        <h1 class="font-primary text-font font-bold text-xl lg:text-5xl">Become an Instructor</h1>
        <p class="font-sans text-center text-gray_1 text-sm lg:text-xl lg:text-left">
          Become an instructor & start teaching with 26k certified <br />
          instructors. Create a success story with 267.1k Students <br />
          — Grow yourself with 71 countries.
        </p>
        <RouterLink to="/become-an-instructor/request" class="w-full">
          <IceButton text="Get Started" :size="2" :priority="1" class="w-1/2" />
        </RouterLink>
      </div>
      <div class="flex items-center justify-center">
        <img
          class="w-1/2 lg:w-3/4 lg:basis-1/2"
          src="@/assets/become-instructor/Image1.png"
          alt=""
        />
      </div>
    </div>
    <div
      class="flex items-center justify-center lg:justify-between bg-fourth flex-wrap py-4 px-4 gap-6 lg:px-48 lg:py-8"
    >
      <div class="flex gap-2 lg:gap-3">
        <UsersIcon class="text-primary size-6 lg:size-8" />
        <div class="flex flex-col gap-1">
          <span class="text-font font-bold font-primary text-base lg:text-2xl">267.1k</span>
          <span class="text-gray_1 font-primary text-xs lg:text-sm">Students</span>
        </div>
      </div>
      <div class="flex gap-2 lg:gap-3">
        <ClipboardDocumentListIcon class="text-secondary size-6 lg:size-8" />
        <div class="flex flex-col gap-1">
          <span class="text-font font-bold font-primary text-base lg:text-2xl">27k</span>
          <span class="text-gray_1 font-primary text-sm hidden lg:block"
            >Certified Instructors</span
          >
          <span class="text-gray_1 font-primary text-xs block lg:hidden">Instructors</span>
        </div>
      </div>
      <div class="flex gap-2 lg:gap-3">
        <GlobeEuropeAfricaIcon class="text-danger size-6 lg:size-8" />
        <div class="flex flex-col gap-1">
          <span class="text-font font-bold font-primary text-base lg:text-2xl">72</span>
          <span class="text-gray_1 font-primary text-xs lg:text-sm">Countries</span>
        </div>
      </div>
      <div class="flex gap-2 lg:gap-3">
        <CheckBadgeIcon class="text-success size-6 lg:size-8" />
        <div class="flex flex-col gap-1">
          <span class="text-font font-bold font-primary text-base lg:text-2xl">99.1%</span>
          <span class="text-gray_1 font-primary text-xs lg:text-sm">Success Rate</span>
        </div>
      </div>
      <div class="flex gap-2 lg:gap-3">
        <Square3Stack3DIcon class="text-warning size-6 lg:size-8" />
        <div class="flex flex-col gap-1">
          <span class="text-font font-bold font-primary text-base lg:text-2xl">57</span>
          <span class="text-gray_1 font-primary text-sm hidden lg:block">Trusted Companies</span>
          <span class="text-gray_1 font-primary text-xs block lg:hidden">Companies</span>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-center flex-col gap-4 px-4 py-4 lg:py-12 lg:px-40 lg:flex-row"
    >
      <div class="flex items-center justify-center">
        <img
          class="w-2/3 lg:w-10/12 lg:basis-5/12"
          src="@/assets/become-instructor/Image2.png"
          alt=""
        />
      </div>
      <div
        class="flex items-center justify-center flex-col gap-2 lg:items-start lg:gap-6 lg:basis-7/12"
      >
        <h1 class="font-primary text-font font-bold text-lg lg:text-3xl tracking-wide">
          Why would you start teaching on ICE?
        </h1>
        <p class="font-sans text-center text-gray_1 font-medium text-sm lg:text-base lg:text-left">
          It's where your passion meets profit, and your knowledge gets the spotlight it deserves,
          <b>Join us Now!!</b> and enjoy our industry-shaping benefits:
        </p>
        <ul class="space-y-4 px-8 py-4 lg:py-2 lg:px-4">
          <li class="flex items-center gap-2">
            <div>
              <BoltIcon class="size-6 lg:size-8 text-warning" />
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-primary font-semibold text-sm lg:text-lg text-font"
                >Lightning Fast Approval.</span
              >
              <span class="font-sans text-sm lg:text-sm text-gray_1"
                >You don't have to wait a month thanks to our dedicated team. you can start teaching
                as soon as today!</span
              >
            </div>
          </li>
          <li class="flex items-center gap-2">
            <div>
              <GlobeAltIcon class="size-6 lg:size-8 text-secondary" />
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-primary font-semibold text-sm lg:text-lg text-font"
                >Worldwide influence.</span
              >
              <span class="font-sans text-sm lg:text-sm text-gray_1"
                >Our platform is approved in <b>72 countries.</b>Your experience will reach students
                in every corner of the globe.</span
              >
            </div>
          </li>
          <li class="flex items-center gap-2">
            <div>
              <ChartPieIcon class="size-6 lg:size-8 text-danger" />
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-primary font-semibold text-sm lg:text-lg text-font"
                >Data-Driven Insights.</span
              >
              <span class="font-sans text-sm lg:text-sm text-gray_1">
                Gain valuable data and analytics to track student progress, identify areas for
                improvement, and optimize your teaching strategies.</span
              >
            </div>
          </li>
          <li class="flex items-center gap-2">
            <div>
              <CheckCircleIcon class="size-6 lg:size-8 text-success" />
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-primary font-semibold text-sm lg:text-lg text-font"
                >Exceptional Support.</span
              >
              <span class="font-sans text-sm lg:text-sm text-gray_1"
                >Benefit from our dedicated support team, providing guidance and assistance whenever
                you need it.
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="flex flex-col items-center justify-center gap-8 px-4 py-4 lg:py-12 lg:px-40 bg-background"
    >
      <h1 class="font-primary text-font font-bold text-xl lg:text-3xl">
        How to become an Instructor on ICE
      </h1>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="flex flex-col items-center justify-center gap-2 bg-fourth rounded-3xl p-4">
          <div
            class="flex items-center justify-center p-3 size-12 lg:p-4 lg:size-16 rounded-full bg-secondary_trans"
          >
            <DocumentCheckIcon class="size-10 text-secondary" />
          </div>
          <h2 class="font-sans font-medium text-center text-font text-sm lg:text-base">
            1. Apply for our program
          </h2>
          <p class="font-sans text-gray_2 text-xs lg:text-sm text-center">
            Upload your CV and qualifications for our team to verify and approve.
          </p>
        </div>
        <div class="flex flex-col items-center justify-center gap-2 bg-fourth rounded-3xl p-4">
          <div
            class="flex items-center justify-center p-3 size-12 lg:p-4 lg:size-16 rounded-full bg-warning_trans"
          >
            <IdentificationIcon class="size-10 text-warning" />
          </div>
          <h2 class="font-sans font-medium text-center text-font text-sm lg:text-base">
            2. Setup your profile
          </h2>
          <p class="font-sans text-gray_2 text-xs lg:text-sm text-center">
            Complete the necessary steps to get your profile setup and going.
          </p>
        </div>
        <div class="flex flex-col items-center justify-center gap-2 bg-fourth rounded-3xl p-4">
          <div
            class="flex items-center justify-center p-3 size-12 lg:p-4 lg:size-16 rounded-full bg-danger_trans"
          >
            <PlayCircleIcon class="size-10 text-danger" />
          </div>
          <h2 class="font-sans font-medium text-center text-font text-sm lg:text-base">
            3. Create your first course
          </h2>
          <p class="font-sans text-gray_2 text-xs lg:text-sm text-center">
            Record lectures and prepare notes then upload them to create your first course.
          </p>
        </div>
        <div class="flex flex-col items-center justify-center gap-2 bg-fourth rounded-3xl p-4">
          <div
            class="flex items-center justify-center p-3 size-12 lg:p-4 lg:size-16 rounded-full bg-success_trans"
          >
            <BanknotesIcon class="size-10 text-success" />
          </div>
          <h2 class="font-sans font-medium text-center text-font text-sm lg:text-base">
            4. Start teaching & earning
          </h2>
          <p class="font-sans text-gray_2 text-xs lg:text-sm text-center">
            Reach thousands of students and answer their questions to earn and grow.
          </p>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-center flex-col gap-4 px-4 py-4 lg:py-12 lg:px-40 lg:flex-row"
    >
      <div
        class="flex items-center justify-center flex-col gap-2 lg:items-start lg:gap-6 lg:basis-7/12"
      >
        <h1 class="font-primary text-font font-bold text-lg lg:text-3xl tracking-wide">
          Instructor's Rules and Regulations
        </h1>
        <p class="font-sans text-center text-gray_1 font-medium text-sm lg:text-lg lg:text-left">
          To ensure a smooth and effective learning experience for all students, instructors are
          expected to adhere to the following rules and regulations:
        </p>

        <ul
          class="font-sans text-center text-gray_1 font-medium text-sm lg:text-base lg:text-left space-y-2 pl-2"
        >
          <li>
            <span class="font-bold text-font">• Maintain consistent communication</span><br />
            Respond to student queries and provide timely feedback on assignments within the
            specified timeframe.
          </li>
          <li>
            <span class="font-bold text-font">• Deliver high-quality content</span> <br />
            Ensure all course materials, including lectures, assignments, and assessments, are
            well-organized, engaging, and free from errors.
          </li>
          <li>
            <span class="font-bold text-font">• Uphold academic integrity</span> <br />
            Promote an honest learning environment and address any instances of plagiarism or
            cheating promptly and fairly.
          </li>
          <li>
            <span class="font-bold text-font">• Adhere to platform policies</span> <br />
            Familiarize yourself with and comply with all platform policies related to course
            design, student interaction, and data privacy.
          </li>
        </ul>
      </div>
      <div class="flex items-center justify-center">
        <img
          class="w-2/3 lg:w-10/12 lg:basis-5/12"
          src="@/assets/become-instructor/Image3.png"
          alt=""
        />
      </div>
    </div>
    <div
      class="flex items-center justify-center flex-col gap-4 px-4 py-4 lg:py-12 lg:px-40 lg:flex-row bg-background"
    >
      <div class="flex items-center justify-center">
        <img
          class="w-2/3 lg:w-10/12 lg:basis-5/12"
          src="@/assets/become-instructor/Image4.png"
          alt=""
        />
      </div>
      <div
        class="flex items-center justify-center flex-col gap-2 lg:items-start lg:gap-6 lg:basis-7/12"
      >
        <h1 class="font-primary text-font font-bold text-xl lg:text-3xl tracking-wide">
          Don't Worry! We Are Always Here to Help
        </h1>
        <p class="font-sans text-center text-gray_2 font-medium text-sm lg:text-lg lg:text-left">
          Please don't hesitate to contact our dedicated support team if you encounter any of the
          following issues:
        </p>

        <ul
          class="font-sans text-center text-font font-medium text-sm lg:text-base lg:text-left space-y-2 pl-2"
        >
          <li class="flex gap-2">
            <ArrowRightIcon class="text-primary size-6" />If you experience any technical
            difficulties with the platform.
          </li>
          <li class="flex gap-2">
            <ArrowRightIcon class="text-primary size-6" />If you have any questions about course
            content.
          </li>
          <li class="flex gap-2">
            <ArrowRightIcon class="text-primary size-6" />If you encounter any issues with students,
            such as harassment
          </li>
          <li class="flex gap-2">
            <ArrowRightIcon class="text-primary size-6" />If you have any other concerns or
            questions.
          </li>
        </ul>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=ice.support@ice.com&su=Ask%20Your%20Question"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="flex gap-3">
            <div
              class="flex items-center justify-center p-2 size-10 lg:p-3 lg:size-12 rounded-full bg-fourth"
            >
              <EnvelopeIcon class="size-10 text-primary" />
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs lg:text-sm font-sans text-gray_2 font-medium"
                >EMAIL US ANYTIME</span
              >
              <span class="text-sm lg:text-base font-primary text-font font-medium"
                >ice.support@ice.com</span
              >
            </div>
          </div>
        </a>
      </div>
    </div>
    <div
      class="flex items-center justify-center flex-col gap-4 px-4 py-4 lg:py-12 lg:px-40 lg:flex-row"
    >
      <div
        class="flex items-center justify-center flex-col gap-2 lg:items-start lg:gap-6 lg:basis-7/12"
      >
        <h1 class="font-primary text-font font-bold text-lg lg:text-3xl tracking-wide">
          +20k Instructors created their success story with ICE.
        </h1>
        <p class="font-sans text-center text-gray_1 font-medium text-sm lg:text-lg lg:text-left">
          Here's what some of our top instructors have to say, after working with us for more than 4
          years
        </p>
        <div class="flex flex-col p-6 gap-2 rounded-3xl bg-background shadow-xl">
          <ChatBubbleOvalLeftEllipsisIcon class="size-8 text-primary" />
          <transition name="fade" mode="out-in">
            <p
              key="review-{{ currentReview }}"
              class="text-sm lg:text-base text-font font-primary text-medium"
            >
              {{ reviews[currentReview] }}
            </p>
          </transition>
        </div>
        <div class="flex gap-4 items-center justify-center w-full">
          <button
            id="scrollBack"
            :class="[
              'rounded-full size-8 flex items-center justify-center shadow-sm hover:shadow-xl transition-shadow ease-in duration-200',
              currentReview === 0 ? 'bg-white text-font' : 'bg-primary text-white',
            ]"
            @click="prevReview"
          >
            <ArrowLeftIcon class="size-6" />
          </button>
          <button
            id="scrollNext"
            :class="[
              'rounded-full size-8 flex items-center justify-center shadow-sm hover:shadow-xl transition-shadow ease-in duration-200',
              currentReview === reviews.length - 1 ? 'bg-white text-font' : 'bg-primary text-white',
            ]"
            @click="nextReview"
          >
            <ArrowRightIcon class="size-6" />
          </button>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <img
          class="w-2/3 lg:w-11/12 lg:basis-5/12"
          src="@/assets/become-instructor/Image5.png"
          alt=""
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Fade transition for reviews */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-leave-from,
.fade-enter-to {
  opacity: 1;
}

/* Button disabled styles */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
