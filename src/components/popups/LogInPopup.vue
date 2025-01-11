<script setup>
import { defineEmits } from 'vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import IceButton from '../ui elements/IceButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const emits = defineEmits(['cancel'])

defineProps({
  text: String,
})

function signIn() {
  router.push('/sign-in')
}

function signUp() {
  router.push('/sign-up')
}

function cancel() {
  emits('cancel')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-background shadow-xl rounded-3xl flex flex-col divide-y divide-tertiary w-3/4 lg:w-1/3"
    >
      <div class="flex justify-between px-3 py-2">
        <span class="font-medium text-font text-xs lg:text-sm">Sign-In</span>
        <button @click="cancel">
          <XMarkIcon class="size-6 text-gray_2 hover:text-primary" />
        </button>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center justify-center px-4 py-2">
          <p class="text-wrap text-sm lg:text-base font-sans text-font font-medium text-center">
            {{ text }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex w-full p-3 gap-4">
          <IceButton text="Sign-In" :priority="1" :size="1" @click="signIn" class="w-1/2 py-2" />
          <IceButton
            text="Create an account"
            :priority="4"
            :size="1"
            @click="signUp"
            class="w-1/2 py-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>
