<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['filter', 'minprice', 'maxprice','add']);

const isMenuOpen = ref(false);
const selectedIndex = ref(null);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function selectItem(index, label) {
  selectedIndex.value = index;
  let y = props.label;
  let x = { label, y };
  emit('filter', x);
  emit('add')
}

const minLimit = 0;
const maxLimit = 1000;

const minValue = ref(minLimit);
const maxValue = ref(maxLimit);

function calculateThumbPosition(value) {
  return ((value - minLimit) / (maxLimit - minLimit)) * 100;
}

// Emit maxValue and ensure it's greater than minValue
function xp(value) {
  maxValue.value = Math.max(value, minValue.value + 1); // Ensure maxValue is at least 1 unit greater than minValue
  emit('maxprice', maxValue.value ,minValue.value);
  emit('add')
}

// Emit minValue and ensure it's less than maxValue
function mp(value) {
  minValue.value = Math.min(value, maxValue.value - 1); // Ensure minValue is at least 1 unit less than maxValue
  emit('minprice', minValue.value ,maxValue.value);
  emit('add')
}
</script>

<template>
  <div class="menu">
    <!-- Dropdown Button -->
    <div
      @click="toggleMenu"
      :class="{'open-menu': isMenuOpen}"
      style="border-bottom: solid 1px #9CE0FF; padding: 10px 0; cursor: pointer;"
      class="w-full"
    >
      <div class="flex flex-row justify-between w-full rounded-3xl">
        <p class="px-2">{{ label }}</p>
        <div class="px-2">
          <ChevronDownIcon
            class="-mr-1 h-5 w-5 text-gray_3"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>

    <!-- Dropdown Menu Items -->
    <div v-if="isMenuOpen" class="menuitems" style="padding: 10px;">
      <div v-if="label === 'Price'" class="Prix">
        <div class="range-slider-container">
          <!-- Range Slider -->
          <div class="slider-wrapper">
            <input
              type="range"
              class="range-slider"
              v-model="minValue"
              :min="minLimit"
              :max="maxLimit"
              step="1"
              :style="{ '--thumb-position': `${calculateThumbPosition(minValue)}%` }"
              @input="mp(minValue)"
            />
            <input
              type="range"
              class="range-slider"
              v-model="maxValue"
              :min="minLimit"
              :max="maxLimit"
              step="1"
              :style="{ '--thumb-position': `${calculateThumbPosition(maxValue)}%` }"
              @input="xp(maxValue)"
            />
          </div>

          <div class="prc">
            <div class="min">
              <label for="mini">$ min:</label>
              <input
                type="number"
                v-model="minValue"
                :min="minLimit"
                :max="maxValue - 1"
                class="min-input"
                id="mini"
                @input="mp(minValue)"
              />
            </div>

            <div class="max">
              <label for="maxi">$ max:</label>
              <input
                type="number"
                v-model="maxValue"
                :min="minValue + 1"
                :max="maxLimit"
                class="max-input"
                id="maxi"
                @input="xp(maxValue)"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="menuitem">
        <div
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(index, item)"
          class="menu-item-button"
          style="cursor: pointer; width: 100%; padding: 5px 0;"
        >
          <div class="flex gap-10 justify-between">
            <!-- Radio and Label -->
            <div class="flex gap-2">
              <input
                type="radio"
                :id="'radio-' + uniqueId + '-' + index"
                :name="'radio-' + uniqueId"
                class="radio"
                :checked="selectedIndex === index"
                @input="selectItem(index, item.label)"
              />
              <div class="flex gap-3 items-center">
                <img
                  v-if="label === 'Rating'"
                  src="/src/assets/img/Star.png"
                  alt="Star"
                  class="h-5 w-5"
                />
                <p style="font-size: 14px; min-width: 60px;">
                  {{ item.label }}
                </p>
              </div>
            </div>
            <!-- Number Count -->
            <p v-if="label !='categorys'" style="font-size: 14px; color: #3B444AB2;">
              {{ item.number }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.menu {
  width: 300px;
  border: solid 1px #9ce0ff;
  border-radius: 25px;
  background-color: #f2fdff;
}
.open-menu {
  border-bottom: solid 1px #9ce0ff;
}
.menuitem {
  margin: 5px 0;
}

.radio {
  margin-right: 8px;
}

.menu-item-button:hover {
  background-color: #F2FDFF;
  border-radius: 25px;
}
.prc , .mini , .maxi
{
  display: flex;flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.min , .max{
  border: solid 1px #9CE0FF;
  border-radius: 25px;
  background-color: inherit;
  padding:5px  ;
  display: flex;
  align-items: center;
}
.prc input {
  width: 75px;
  border-radius: 25px;
  background-color: inherit;
}

</style>
