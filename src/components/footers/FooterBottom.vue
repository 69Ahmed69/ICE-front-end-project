<script setup>
import DropDown from '../ui elements/DropDownMenu.vue'
import { usePrefrencesStore } from '@/stores/user'

const preferncesStore = usePrefrencesStore()
const language = preferncesStore.language

const languageItems = [{ label: 'English' }, { label: 'French' }, { label: 'العربية' }]
</script>

<template>
  <div class="bg-font px-4 lg:px-36 py-3">
    <div class="flex items-center justify-center lg:justify-between flex-wrap space-y-2">
      <!-- Left Section: Navigation Links -->
      <div class="text-wrap font-primary text-gray_3 text-xs lg:text-sm text-center">
        <p>
          © 2024 - Saad Dahlab Blida-1. Designed by
          <span class="text-background">ICE Team</span>. All rights reserved.
        </p>
      </div>
      <!-- Right Section: Dropdown -->
      <DropDown
        class="border-2 border-gray_3 rounded-3xl px-2 lg:px-10"
        type="lang"
        :label="language"
        :items="languageItems"
        :transparent="true"
        position="bottom"
      />
    </div>
  </div>
</template>
