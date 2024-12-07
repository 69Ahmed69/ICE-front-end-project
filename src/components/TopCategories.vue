<template>
  <section class="py-10 lg:py-12 px-6 lg:px-32 bg-white">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-xl lg:text-3xl font-primary font-black text-font">Browse Top Categories</h2>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 px-4">
      <CategoryCard
        v-for="(category, index) in categories"
        :key="index"
        :categoryName="category.name"
        :numberOfCourses="category.courses"
        :icon="category.icon"
        :link="category.link"
        :bg_color="colors[index % colors.length].bg_color"
        :icon_color="colors[index % colors.length].icon_color"
      />
    </div>
    <div
      class="text-font gap-2 text-sm lg:text-lg flex font-medium font-sans justify-center items-center mt-6 lg:mt-12"
    >
      <p>We have even more categories for you!</p>
      <RouterLink to="/courses/" class="flex items-center gap-1">
        <p class="text-primary">Browse All</p>
        <ArrowRightIcon class="w-4 lg:w-6 text-primary" />
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
const colors = [
  { bg_color: 'bg-secondary_trans', icon_color: 'text-secondary' },
  { bg_color: 'bg-success_trans', icon_color: 'text-success' },
  { bg_color: 'bg-warning_trans', icon_color: 'text-warning' },
  { bg_color: 'bg-danger_trans', icon_color: 'text-danger' },
  { bg_color: 'bg-tertiary', icon_color: 'text-primary' },
  { bg_color: 'bg-purple-200', icon_color: 'text-purple-900' },
]
import CategoryCard from './CategoryCard.vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  TableCellsIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
  CircleStackIcon,
  WifiIcon,
  CpuChipIcon,
  CommandLineIcon,
  ChartBarIcon,
  CalculatorIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'

const categories = [
  {
    name: 'Data Science',
    courses: 45,
    icon: TableCellsIcon,
    link: '/courses/Data%20Science',
  },
  {
    name: 'Cyber Security',
    courses: 69,
    icon: ShieldCheckIcon,
    link: '/courses/Cyber%20Security',
  },
  {
    name: 'Front-end Web',
    courses: 21,
    icon: ComputerDesktopIcon,
    link: '/courses/Front-end%20Web',
  },
  {
    name: 'Databases',
    courses: 74,
    icon: CircleStackIcon,
    link: '/courses/Databases',
  },
  {
    name: 'Game Dev',
    courses: 31,
    icon: PuzzlePieceIcon,
    link: '/courses/Game%20Dev',
  },
  {
    name: 'Networks',
    courses: 11,
    icon: WifiIcon,
    link: '/courses/Networks',
  },
  {
    name: 'Mobile Dev',
    courses: 36,
    icon: DevicePhoneMobileIcon,
    link: '/courses/Mobile%20Dev',
  },
  {
    name: 'Software Dev',
    courses: 13,
    icon: CpuChipIcon,
    link: '/courses/Software%20Dev',
  },
  {
    name: 'Back-end Web',
    courses: 89,
    icon: CommandLineIcon,
    link: '/courses/Back-end%20Web',
  },
  {
    name: 'Business Intelligence',
    courses: 6,
    icon: ChartBarIcon,
    link: '/courses/Business%20Intelligence',
  },
  {
    name: 'Artificial Intelligence',
    courses: 24,
    icon: SparklesIcon,
    link: '/courses/Artificial%20Intelligence',
  },
  {
    name: 'Mathematics',
    courses: 14,
    icon: CalculatorIcon,
    link: '/courses/Mathematics',
  },
]
</script>
