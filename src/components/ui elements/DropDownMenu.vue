<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { usePrefrencesStore } from '@/stores/user'
import { ref, watch } from 'vue'

const preferencesStore = usePrefrencesStore()

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: 'top',
  },
})

const handleSelect = (type, item) => {
  if (type === 'curr') {
    preferencesStore.setCurrency(item)
  } else if (type === 'language') {
    preferencesStore.setLanguage(item)
  }
  sessionStorage.setItem(type, item)
  window.location.reload()
}

// Dynamically set `menuItemClass` based on `props.position`
const menuItemClass = ref('')
watch(
  () => props.position,
  (newPosition) => {
    menuItemClass.value =
      newPosition === 'top'
        ? 'absolute right-0 z-20 mt-2 w-56 origin-top-right shadow-lg ring-1 ring-tertiary focus:outline-none bg-background rounded-3xl'
        : 'absolute right-0 z-20 bottom-full mb-2 w-56 origin-bottom-right shadow-lg ring-1 ring-tertiary focus:outline-none bg-background rounded-3xl'
  },
  { immediate: true },
)
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        :class="[
          'inline-flex w-full justify-center gap-x-1.5 px-3 py-0 lg:py-2 text-xs lg:text-sm font-semibold shadow-sm ring-1 ring-inset rounded-3xl',
          transparent
            ? 'bg-transparent text-gray_3 ring-transparent'
            : 'bg-background text-font  hover:bg-fourth ring-tertiary',
        ]"
      >
        {{ label }}
        <ChevronDownIcon class="-mr-1 size-5 text-gray_3" aria-hidden="true" />
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
      <MenuItems :class="menuItemClass">
        <div class="py-1">
          <template v-for="(item, index) in items" :key="index">
            <MenuItem v-slot="{ active }">
              <button
                type="button"
                @click="handleSelect(type, item.label)"
                :class="[
                  active ? 'bg-fourth text-font outline-none' : 'text-gray_2',
                  'block w-full px-4 py-2 text-left text-xs lg:text-sm rounded-3xl',
                ]"
              >
                {{ item.label }}
              </button>
            </MenuItem>
          </template>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
