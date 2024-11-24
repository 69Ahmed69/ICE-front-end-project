<script setup>
import { RouterLink, useRoute } from 'vue-router'
import DropDown from '../ui elements/DropDownMenu.vue'

import { usePrefrencesStore } from '@/stores/user'

const preferncesStore = usePrefrencesStore()
const language = preferncesStore.language
const currency = preferncesStore.currency

const links = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Become an Instructor', path: '/become-an-instructor' },
]
const languageItems = [{ label: 'English' }, { label: 'French' }, { label: 'العربية' }]
const currencyItems = [{ label: 'USD' }, { label: 'Euro' }, { label: 'DA' }, { label: 'Bitcoin' }]
const route = useRoute()
const isActiveLink = (routePath) => route.path === routePath

const linkClass = (path) =>
  [
    'bg-font',
    'text-gray_3',
    'px-3',
    'py-2',
    isActiveLink(path) ? 'text-white border-t-4 border-primary' : 'bg-font',
  ].join(' ')
</script>

<template>
  <section class="bg-font items-start fixed w-full shadow-md px-8 max-h-14 font-sans z-20">
    <div class="mx-auto px-2 sm:px-2 lg:px-2">
      <div class="flex items-start justify-between">
        <!-- Left Section: Navigation Links -->
        <div class="flex text-nowrap max-h-14 space-x-2 pb-2">
          <RouterLink
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            :class="linkClass(link.path)"
          >
            {{ link.name }}
          </RouterLink>
        </div>
        <!-- Right Section: Dropdowns -->
        <div class="flex text-nowrap max-h-14 space-x-2 pt-1">
          <DropDown type="lang" :label="language" :items="languageItems" :transparent="true" />
          <DropDown type="curr" :label="currency" :items="currencyItems" :transparent="true" />
        </div>
      </div>
    </div>
  </section>
</template>
