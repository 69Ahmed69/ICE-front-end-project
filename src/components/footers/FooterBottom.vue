<script setup>
import DropDown from '../ui elements/DropDownMenu.vue'
import { usePrefrencesStore } from '@/stores/user'

const preferncesStore = usePrefrencesStore()
const language = preferncesStore.language

const languageItems = [{ label: 'English' }, { label: 'French' }, { label: 'العربية' }]
</script>

<template>
  <div class="mx-auto bg-font border-t-2 border-gray_3 px-36 py-3">
    <div class="flex items-center justify-between">
      <!-- Left Section: Navigation Links -->
      <div class="text-nowrap font-primary text-gray_3 text-sm text-center">
        <p>
          © 2024 - Saad Dahlab Blida-1. Designed by
          <span class="text-background">ICE Team</span>. All rights reserved.
        </p>
      </div>
      <!-- Right Section: Dropdowns -->
      <div class="flex text-nowrap max-h-14 space-x-2 pt-1">
        <DropDown
          class="border-2 border-gray_3 rounded-3xl w-48"
          type="lang"
          :label="language"
          :items="languageItems"
          :transparent="true"
          position="bottom"
        />
      </div>
    </div>
  </div>
</template>
