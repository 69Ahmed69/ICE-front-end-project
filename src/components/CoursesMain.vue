<script setup>
import LoadingAnimation from '@/components/LoadingAnimation.vue'

import { useUserStore } from '@/stores/user'
import { reactive, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()
</script>

<template>
  <section v-if="!state.isLoading" class="my-2 lg:my-10"></section>
</template>
