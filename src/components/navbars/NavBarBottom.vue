<script setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import IceButton from '../ui elements/IceButton.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ShoppingCartIcon,
  HeartIcon,
} from '@heroicons/vue/24/outline'
import axios from 'axios'

const searchQuery = ref('')
const router = useRouter()

const goToCourses = () => {
  router.push({ path: '/courses', query: { search: searchQuery.value } })
}

const state = reactive({
  categories: [],
  isLoading: true,
})

onMounted(async () => {
  try {
    const category_response = await axios.get('/api/categories')
    state.categories = category_response.data
  } catch (error) {
    console.error('Error fetching data: ', error)
  } finally {
    state.isLoading = false
  }
})

const userStore = useUserStore()
const userState = computed(() => userStore.isSignedIn)
</script>

<template>
  <section class="bg-white w-full py-2 px-4 lg:px-8 z-10 shadow-lg">
    <div class="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between">
      <!-- Left Section: Logo, Browse, and Search -->
      <div class="flex items-center space-x-4 w-full lg:w-3/4">
        <!-- Logo -->
        <RouterLink to="/">
          <img class="h-8 lg:h-14 hidden lg:block" src="../../assets/img/logo.png" alt="ICE" />
        </RouterLink>

        <!-- Browse Menu -->
        <Menu as="div" class="relative hidden lg:block">
          <div>
            <MenuButton
              class="text-xs lg:text-base w-36 lg:w-48 rounded-full bg-white px-4 lg:px-6 py-2 lg:py-3 font-semibold text-gray_2 shadow-md ring-1 ring-gray_3 hover:bg-fourth hover:ring-tertiary focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
            >
              <span>Browse</span>
              <ChevronDownIcon class="w-4 lg:w-5 text-gray_2 ml-2" aria-hidden="true" />
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="absolute left-0 lg:right-0 mt-2 z-10 w-36 lg:w-56 rounded-3xl bg-background shadow-lg ring-1 ring-gray_3 focus:outline-none"
            >
              <div class="py-1">
                <!-- Dynamic rendering of menu items -->
                <MenuItem
                  v-for="(category, index) in state.categories"
                  :key="index"
                  v-slot="{ active }"
                >
                  <RouterLink
                    :to="`category/${category.id}`"
                    :class="[
                      active ? 'bg-fourth text-font' : 'text-gray_2',
                      'block px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm',
                      index === 0 ? 'rounded-t-3xl' : '',
                      index === state.categories.length - 1 ? 'rounded-b-3xl' : '',
                    ]"
                  >
                    {{ category.name }}
                  </RouterLink>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>

        <!-- Search Bar -->

        <form
          @submit.prevent="goToCourses"
          class="flex grow items-center w-full lg:w-auto max-w-full lg:max-w-72 bg-white shadow-md rounded-full ring-1 ring-gray_3 hover:ring-tertiary focus-within:ring-2 focus-within:ring-primary"
        >
          <button type="submit">
            <MagnifyingGlassIcon class="w-5 lg:w-6 text-gray_2 ml-4 hover:text-primary" />
          </button>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="What do you want to learn..."
            class="flex-1 text-xs lg:text-base bg-transparent px-2 lg:px-4 py-2 lg:py-3 rounded-full text-gray_1 focus:outline-none"
          />
        </form>
      </div>

      <!-- Right Section: User buttons -->
      <div v-if="userState" class="flex items-center space-x-4 bg-transparent py-2">
        <button class="relative">
          <BellIcon class="icon size-5 lg:size-6 text-font hover:text-primary" />
          <div
            class="absolute bottom-4 left-3 size-1 lg:size-2 bg-primary rounded-full animate-ping"
          ></div>
        </button>
        <RouterLink to="/shopping-cart/" class="relative">
          <ShoppingCartIcon class="icon size-5 lg:size-6 text-font hover:text-primary" />
          <span
            v-if="userStore.user.shoppingCart.length > 0"
            class="absolute top-0 right-0 -mt-1 -mr-1 flex size-3 lg:size-4 items-center justify-center rounded-full bg-danger text-white text-xs font-bold"
          >
            {{ userStore.user.shoppingCart.length }}
          </span>
        </RouterLink>
        <RouterLink to="/profile">
          <img
            class="size-8 lg:size-12 rounded-full object-cover"
            :src="userStore.user.profilePicture"
            alt="user-avatar"
          />
        </RouterLink>
      </div>
      <div v-else class="flex space-x-4 bg-transparent py-2">
        <RouterLink to="/sign-up">
          <IceButton text="Create Account" :priority="4" :size="1" class="py-2"
        /></RouterLink>

        <RouterLink to="/sign-in">
          <IceButton text="Sign-in" :priority="1" :size="1" class="py-2"
        /></RouterLink>
      </div>
    </div>
  </section>
</template>
