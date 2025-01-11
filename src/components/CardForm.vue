<script setup>
import { ref, computed, watch, onMounted, defineProps, defineEmits } from 'vue'
import { Menu, MenuItem, MenuButton, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import Card from './Card.vue'

// Props
const props = defineProps({
  formData: {
    type: Object,
    default: () => ({
      cardName: '',
      cardNumber: '',
      cardNumberNotMask: '',
      cardMonth: '',
      cardYear: '',
      cardCvv: '',
    }),
  },
  cardWarning: String,
  backgroundImage: [String, Object],
  randomBackgrounds: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'input-card-name',
  'input-card-number',
  'input-card-month',
  'input-card-cvv',
  'input-card-year',
])

// State
const fields = ref({
  cardNumber: 'v-card-number',
  cardName: 'v-card-name',
  cardMonth: 'v-card-month',
  cardYear: 'v-card-year',
  cardCvv: 'v-card-cvv',
})

const minCardYear = ref(new Date().getFullYear())
const isCardNumberMasked = ref(true)
const mainCardNumber = ref('  ')
const cardNumberMaxLength = ref(19)

// Computed
const minCardMonth = computed(() => {
  return props.formData.cardYear === minCardYear.value ? new Date().getMonth() + 1 : 1
})

// Watchers
watch(
  () => props.formData.cardYear,
  () => {
    if (props.formData.cardMonth < minCardMonth.value) {
      props.formData.cardMonth = ''
    }
  },
)

// Methods
const generateMonthValue = (n) => (n < 10 ? `0${n}` : n)

const changeName = (e) => {
  props.formData.cardName = e.target.value.replace(/[^a-zA-Z\s]/g, '')
  emit('input-card-name', props.formData.cardName)
}

const changeNumber = (e) => {
  props.formData.cardNumber = e.target.value
  let value = props.formData.cardNumber.replace(/\D/g, '')

  if (/^3[47]\d{0,13}$/.test(value)) {
    props.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
    cardNumberMaxLength.value = 17
  } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
    props.formData.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
    cardNumberMaxLength.value = 16
  } else if (/^\d{0,16}$/.test(value)) {
    props.formData.cardNumber = value
      .replace(/(\d{4})/, '$1 ')
      .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
      .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
    cardNumberMaxLength.value = 19
  }

  if (e.inputType === 'deleteContentBackward') {
    const lastChar = props.formData.cardNumber.slice(-1)
    if (lastChar === ' ') {
      props.formData.cardNumber = props.formData.cardNumber.slice(0, -1)
    }
  }

  emit('input-card-number', props.formData.cardNumber)
}

const changeMonth = (month) => {
  props.formData.cardMonth = month
  emit('input-card-month', props.formData.cardMonth)
}

const changeYear = (year) => {
  props.formData.cardYear = year
  emit('input-card-year', props.formData.cardYear)
}

const changeCvv = (e) => {
  props.formData.cardCvv = e.target.value
  emit('input-card-cvv', props.formData.cardCvv)
}

const blurCardNumber = () => {
  if (isCardNumberMasked.value) {
    maskCardNumber()
  }
}

const maskCardNumber = () => {
  props.formData.cardNumberNotMask = props.formData.cardNumber
  mainCardNumber.value = props.formData.cardNumber
  const arr = props.formData.cardNumber.split('')
  arr.forEach((element, index) => {
    if (index > 4 && index < 14 && element.trim() !== '') {
      arr[index] = '*'
    }
  })
  props.formData.cardNumber = arr.join('')
}

const unMaskCardNumber = () => {
  props.formData.cardNumber = mainCardNumber.value
}

const focusCardNumber = () => {
  unMaskCardNumber()
}

// Lifecycle
onMounted(() => {
  maskCardNumber()
})
</script>

<template>
  <div>
    <div class="-mb-32 rounded-3xl">
      <Card
        :fields="fields"
        :labels="props.formData"
        :isCardNumberMasked="isCardNumberMasked"
        :randomBackgrounds="props.randomBackgrounds"
        :backgroundImage="props.backgroundImage"
      />
    </div>
    <div
      class="bg-background p-8 pt-40 border-2 border-fourth rounded-3xl shadow-md hover:shadow-2xl ease-in transition-shadow duration-200"
    >
      <div class="flex flex-col gap-2 my-2">
        <label for="cardNumber" class="text-gray_1 font-medium text-sm lg:text-base"
          >Card Number</label
        >
        <input
          type="tel"
          :id="fields.cardNumber"
          placeholder="XXXX XXXX XXXX XXXX"
          @input="changeNumber"
          @focus="focusCardNumber"
          @blur="blurCardNumber"
          class="w-full h-12 py-1 text-font lg:py-2 rounded-full border-2 border-fourth px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
          :value="props.formData.cardNumber"
          :maxlength="cardNumberMaxLength"
          data-card-field
        />
      </div>
      <div class="flex flex-col gap-2 my-2">
        <label for="cardName" class="text-gray_1 font-medium text-sm lg:text-base">Card Name</label>
        <input
          type="text"
          :id="fields.cardName"
          placeholder="FULL NAME"
          v-model="props.formData.cardName"
          @input="changeName"
          class="w-full h-12 py-1 text-font lg:py-2 rounded-full border-2 border-fourth px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
          :value="props.formData.cardName"
          data-card-field
        />
      </div>
      <div class="flex items-center lg:gap-8 gap-4">
        <div class="flex flex-col gap-2 w-3/5">
          <label for="cardMonth" class="text-gray_1 font-medium text-sm lg:text-base"
            >Expiration Date</label
          >
          <div class="flex items-center gap-2">
            <Menu as="div" class="relative w-1/2">
              <MenuButton
                class="flex h-12 justify-between w-full px-4 items-center gap-x-1.5 py-2 text-sm lg:text-base font-semibold shadow-md ring-1 ring-inset rounded-3xl bg-background text-font hover:bg-fourth ring-tertiary"
              >
                {{ props.formData.cardMonth }}
                <ChevronDownIcon class="size-3 lg:size-5 text-font" aria-hidden="true" />
              </MenuButton>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-20 bottom-full mt-2 w-56 origin-top-right shadow-lg ring-1 ring-fourth focus:outline-none bg-background rounded-3xl"
                >
                  <div class="py-1">
                    <template v-for="n in 12" :key="n">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="changeMonth(n)"
                          :class="[
                            active ? 'bg-fourth text-font' : 'text-gray_1 bg-white',
                            'block w-full px-4 py-2 text-left text-xs lg:text-sm hover:bg-fourth rounded-3xl',
                          ]"
                        >
                          {{ generateMonthValue(n) }}
                        </button>
                      </MenuItem>
                    </template>
                  </div>
                </MenuItems>
              </transition>
            </Menu>

            <Menu as="div" class="relative w-1/2">
              <MenuButton
                class="flex justify-between h-12 w-full px-4 items-center gap-x-1.5 py-2 text-sm lg:text-base font-semibold shadow-md ring-1 ring-inset rounded-3xl bg-background text-font hover:bg-fourth ring-tertiary"
              >
                {{ props.formData.cardYear }}
                <ChevronDownIcon class="size-3 lg:size-5 text-font" aria-hidden="true" />
              </MenuButton>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute bottom-full right-0 z-20 mt-2 w-56 origin-top-right shadow-lg ring-1 ring-fourth focus:outline-none bg-background rounded-3xl"
                >
                  <div class="py-1">
                    <template v-for="(n, $index) in 12" :key="n">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="changeYear($index + minCardYear)"
                          :class="[
                            active ? 'bg-fourth text-font' : 'text-gray_1 bg-white',
                            'block w-full px-4 py-2 text-left text-xs lg:text-sm hover:bg-fourth rounded-3xl',
                          ]"
                        >
                          {{ $index + minCardYear }}
                        </button>
                      </MenuItem>
                    </template>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div class="flex flex-col gap-1 w-2/5">
          <label for="cardCvv" class="text-gray_1 font-medium text-sm lg:text-base">CVV</label>
          <input
            type="tel"
            class="w-full h-12 py-1 text-font lg:py-2 rounded-full border-2 border-fourth px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
            :id="fields.cardCvv"
            placeholder="XXX"
            maxlength="4"
            :value="props.formData.cardCvv"
            @input="changeCvv"
            data-card-field
          />
        </div>
      </div>
      <div>
        <p
          v-if="props.cardWarning"
          class="my-2 text-danger text-center text-sm lg:text-base font-medium"
        >
          {{ props.cardWarning }}
        </p>
        <p
          v-else
          class="my-2 text-danger text-center text-sm lg:text-base font-medium"
          style="visibility: hidden"
        >
          &nbsp;
        </p>
      </div>
    </div>
  </div>
</template>
