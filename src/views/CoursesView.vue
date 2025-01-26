<script setup>
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import FooterTop from '@/components/footers/FooterTop.vue'
import FooterBottom from '@/components/footers/FooterBottom.vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import CourseListing from '@/components/course listings/CourseListing3.vue'
import IceButton from '@/components/ui elements/IceButton.vue'
import { useUserStore } from '@/stores/user'
import { reactive, onMounted, ref, computed, defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const state = reactive({
  courses: [],
  filteredCourses: [],
  categories: [],
  isLoading: true,
  currentPage: 1,
  itemsPerPage: 24,
})

const searchQuery = ref('')
const selectedSortType = ref('')
const selectedSortDirection = ref('Ascending')

const totalPages = computed(() => Math.ceil(state.filteredCourses.length / state.itemsPerPage))

const paginatedCourses = computed(() => {
  const start = (state.currentPage - 1) * state.itemsPerPage
  const end = start + state.itemsPerPage
  return state.filteredCourses.slice(start, end)
})

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    state.currentPage = page
    window.scrollTo({
      top: 0,
    })
  }
}

onMounted(async () => {
  try {
    const response = await axios.get('/api/courses')
    state.courses = response.data
    state.filteredCourses = response.data
    const category_response = await axios.get('/api/categories')
    state.categories = category_response.data
  } catch (error) {
    console.error('Error fetching data: ', error)
  } finally {
    state.isLoading = false
  }
})

const filterCourses = () => {
  state.filteredCourses = state.courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
  sortCourses()
  state.currentPage = 1
}

const sortCourses = () => {
  if (selectedSortType.value) {
    state.filteredCourses.sort((a, b) => {
      let valA, valB

      switch (selectedSortType.value) {
        case 'Rating':
          valA = a.rating
          valB = b.rating
          break
        case 'Price':
          valA = a.price
          valB = b.price
          break
        case 'Alphabetic':
          valA = a.title.toLowerCase()
          valB = b.title.toLowerCase()
          break
      }

      if (selectedSortDirection.value === 'Ascending') {
        return valA > valB ? 1 : -1
      } else {
        return valA < valB ? 1 : -1
      }
    })
  }
}

function updateSortType(type) {
  selectedSortType.value = type
  filterCourses()
}

function updateSortDirection(direction) {
  selectedSortDirection.value = direction
  filterCourses()
}

const sortTypes = ['Rating', 'Price', 'Alphabetic']
const sortDirections = ['Ascending', 'Descending']
</script>

<template>
  <NavBarTop />
  <NavBarBottom />
  <section v-if="!state.isLoading" class="flex flex-col my-2 lg:my-6">
    <div class="flex justify-between items-center mx-12">
      <div class="flex gap-2 w-3/5">
        <IceButton
          text="Filter"
          :size="4"
          :priority="7"
          :icon="AdjustmentsVerticalIcon"
          icon-position="left"
          class="w-1/4 h-12"
        />
        <div
          class="flex w-3/4 items-center bg-white rounded-full ring-1 ring-gray_3 hover:ring-tertiary focus-within:ring-2 focus-within:ring-primary"
        >
          <button @click="filterCourses">
            <MagnifyingGlassIcon class="w-5 lg:w-6 text-gray_2 ml-4 hover:text-primary" />
          </button>

          <input
            type="text"
            v-model="searchQuery"
            @input="filterCourses"
            placeholder="What do you want to learn..."
            class="flex-1 h-12 text-xs lg:text-base bg-transparent px-2 lg:px-4 py-2 lg:py-3 rounded-full text-gray_1 focus:outline-none"
          />
        </div>
      </div>

      <!-- Browse Menu -->

      <div class="flex gap-2 items-center">
        <Menu as="div" class="relative">
          <div>
            <MenuButton
              class="text-xs lg:text-sm rounded-3xl bg-white px-4 lg:px-6 py-2 lg:py-3 font-semibold text-gray_2 shadow-md ring-1 ring-gray_3 hover:bg-fourth hover:ring-tertiary focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
            >
              <span>{{ selectedSortType || 'Sort By' }}</span>
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
              class="absolute right-0 mt-2 z-10 w-36 lg:w-56 rounded-3xl bg-white shadow-lg ring-1 ring-gray_3 focus:outline-none"
            >
              <!-- Dynamic rendering of menu items -->
              <MenuItem v-for="(item, index) in sortTypes" :key="index" v-slot="{ active }">
                <button
                  @click="updateSortType(item)"
                  :class="[
                    active ? 'bg-fourth text-font' : 'text-gray_2',
                    'block px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm w-full font-medium',
                    index === 0 ? 'rounded-t-3xl' : '',
                    index === sortTypes.length - 1 ? 'rounded-b-3xl' : '',
                  ]"
                >
                  {{ item }}
                </button>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
        <Menu as="div" class="relative hidden lg:block">
          <div>
            <MenuButton
              class="text-xs lg:text-sm rounded-full bg-white px-4 lg:px-6 py-2 lg:py-3 font-semibold text-gray_2 shadow-md ring-1 ring-gray_3 hover:bg-fourth hover:ring-tertiary focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
            >
              <span>{{ selectedSortDirection || 'Select Direction' }}</span>
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
              class="absolute right-0 mt-2 z-10 w-36 lg:w-56 rounded-3xl bg-white shadow-lg ring-1 ring-gray_3 focus:outline-none"
            >
              <!-- Static menu items for Ascending and Descending -->
              <MenuItem v-slot="{ active }">
                <button
                  @click="updateSortDirection('Ascending')"
                  :class="[
                    active ? 'bg-background text-font' : 'text-gray_2',
                    'w-full px-3 lg:px-4 py-2 font-medium lg:py-3 text-xs lg:text-sm rounded-t-3xl',
                  ]"
                >
                  Ascending
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  @click="updateSortDirection('Descending')"
                  :class="[
                    active ? 'bg-background text-font' : 'text-gray_2',
                    'w-full px-3 lg:px-4 py-2 font-medium lg:py-3 text-xs lg:text-sm rounded-b-3xl',
                  ]"
                >
                  Descending
                </button>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-12 py-6 mx-auto">
      <CourseListing
        v-for="course in paginatedCourses"
        :key="course.id"
        :course="course"
        :category="state.categories[Number(course.category) - 1]"
      />
    </div>

    <div class="flex justify-center items-center gap-4 py-4">
      <button
        :disabled="state.currentPage === 1"
        @click="goToPage(state.currentPage - 1)"
        class="p-2 bg-primary hover:bg-secondary shadow-md transition-shadow hover:shadow-2xl rounded-full disabled:cursor-not-allowed disabled:bg-gray_3"
      >
        <ChevronLeftIcon class="w-5 h-5 text-white" />
      </button>
      <span class="text-base font-medium text-font">
        Page {{ state.currentPage }} of {{ totalPages }}
      </span>
      <button
        :disabled="state.currentPage === totalPages"
        @click="goToPage(state.currentPage + 1)"
        class="p-2 bg-primary hover:bg-secondary shadow-md transition-shadow hover:shadow-2xl rounded-full disabled:cursor-not-allowed disabled:bg-gray_3"
      >
        <ChevronRightIcon class="w-5 h-5 text-white" />
      </button>
    </div>
  </section>
  <div v-else>
    <LoadingAnimation />
  </div>
  <FooterTop />
  <FooterBottom />
</template>
