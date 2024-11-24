<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import IceButton from '../ui elements/IceButton.vue'
import { useUserStore } from '@/stores/user'
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ShoppingCartIcon,
  HeartIcon,
} from '@heroicons/vue/24/outline'

const menuItems = ref([
  { name: 'Web Development', to: '/courses/category=Web%20Development' },
  { name: 'Cyber Security', to: '/courses/category=Cyber%20Security' },
  { name: 'Data Science', to: '/courses/category=Data%20Science' },
  { name: 'UI-UX Development', to: '/courses/category=UI-UX%20Development' },
])

const userStore = useUserStore()
const userState = computed(() => userStore.isSignedIn)
</script>

<template>
  <section
    class="bg-background text-nowrap fixed w-full shadow-md py-4 px-8 min-h-12 font-sans z-10 top-[50px]"
  >
    <div class="mx-auto px-2 sm:px-2 lg:px-4">
      <div class="flex flex-wrap h-15 items-center justify-between">
        <!-- Left Section: Logo, Browse and Search -->
        <div class="flex items-center space-x-2">
          <RouterLink to="/" class="flex items-center">
            <img class="h-14 min-w-24 w-auto" src="../../assets/img/logo.png" alt="ICE" />
          </RouterLink>
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                class="w-48 inline-flex text-base text-start justify-between min-w-36 min-h-8 gap-x-1.5 rounded-full bg-transparent px-4 py-3 font-semibold text-gray_2 shadow-lg ring-1 ring-inset ring-gray_3 hover:bg-fourth hover:ring-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Browse
                <ChevronDownIcon class="size-5 top-1 text-gray_2 relative" aria-hidden="true" />
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
                class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-3xl bg-background shadow-lg shadow-primary_trans ring-1 ring-tertiary focus:outline-none"
              >
                <div class="py-1">
                  <!-- Dynamic rendering of menu items -->
                  <MenuItem v-for="(item, index) in menuItems" :key="index" v-slot="{ active }">
                    <RouterLink
                      :to="item.to"
                      :class="[
                        active ? 'bg-fourth text-font outline-none' : 'text-gray-700',
                        'block px-4 py-2 text-sm',
                        index === 0 ? 'rounded-t-3xl' : '',
                        index === menuItems.length - 1 ? 'rounded-b-3xl' : '',
                      ]"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
          <div class="relative max-w-64">
            <MagnifyingGlassIcon
              class="size-6 text-gray_2 absolute left-2 top-1/2 transform -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="What do you want to learn..."
              class="rounded-full bg-transparent px-10 py-3 font-regular text-gray_1 shadow-lg ring-1 ring-gray_3 hover:bg-fourth hover:ring-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <!-- Right Section: User buttons -->
        <div v-if="userState" class="flex items-center space-x-4 bg-transparent py-2">
          <button class="relative">
            <BellIcon class="icon size-6 text-font" />
            <div class="absolute bottom-4 left-3 w-2.5 h-2.5 bg-primary rounded-full"></div>
          </button>
          <button><HeartIcon class="icon size-6 text-font" /></button>
          <button>
            <ShoppingCartIcon class="icon size-6 text-font" />
          </button>
          <button>
            <img class="h-12 min-w-12 w-auto" src="../../assets/img/avatar.png" alt="avatar" />
          </button>
        </div>
        <div v-else class="flex space-x-4 bg-transparent py-2">
          <RouterLink to="/sing-up">
            <IceButton text="Create Account" :priority="4" :size="1"
          /></RouterLink>

          <RouterLink to="/sing-in">
            <IceButton text="Sign-in" :priority="1" :size="1"
          /></RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
