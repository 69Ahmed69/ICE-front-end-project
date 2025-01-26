<script setup>
import { defineProps, defineEmits } from 'vue'
import DropDownFilter from './DropDownFilter.vue'

defineProps({
  categories: {
    type: Array,
  },
  ratings: {
    require: true,
  },
  CoursesLevel: {
    require: true,
  },
  duration: {
    require: true,
  },
  price: {
    require: true,
  },
  tools: {},
})
const emit = defineEmits(['filtercourseshere', 'minpricee', 'maxpricee'])
function filtercourses(x) {
  emit('filtercourseshere', x)
}

function minpriceee(minValue, max) {
  console.log(minValue)
  emit('minpricee', minValue, max)
}
function maxpriceee(maxValue, min) {
  console.log(maxValue)
  emit('maxpricee', maxValue, min)
}
</script>
<template>
  <section>
    <div class="py-2 categorys">
      <DropDownFilter
        @add="$emit('incr')"
        @filter="filtercourses"
        label="categorys"
        :items="categorys"
        uniqueId="dropdown3"
      ></DropDownFilter>
    </div>
    <div class="py-2 tools"></div>
    <div class="py-2 ratings">
      <DropDownFilter
        @add="$emit('incr')"
        @filter="filtercourses"
        label="Rating"
        :items="ratings"
        uniqueId="dropdown3"
      ></DropDownFilter>
    </div>
    <div class="py-2 courseslevel">
      <DropDownFilter
        @add="$emit('incr')"
        @filter="filtercourses"
        label="Courses Level"
        :items="CoursesLevel"
        uniqueId="dropdown4"
      ></DropDownFilter>
    </div>
    <div class="py-2 price">
      <DropDownFilter
        @add="$emit('incr')"
        @minprice="minpriceee"
        @maxprice="maxpriceee"
        label="Price"
        :items="price"
        uniqueId="dropdown5"
      ></DropDownFilter>
    </div>
    <div class="py-2 duration">
      <DropDownFilter
        @add="$emit('incr')"
        @filter="filtercourses"
        label="duration"
        :items="duration"
        uniqueId="dropdown6"
      ></DropDownFilter>
    </div>
  </section>
</template>
<style scoped>
.cont {
  border-radius: 25px;
  border: solid 1px #9ce0ff;
  background-color: #f2fdff;
  margin-bottom: 20px;
}
.cont .header {
  border-bottom: solid 1px #9ce0ff;
  padding-bottom: 10px;
  padding-left: 15px;
  font-size: 20px;
  color: #09314a;
}
.category {
  display: flex;
  flex-direction: column;
}
select {
  margin: 10px;
  background-color: #f2fdff;
}
img {
  height: 20px;
  width: 20px;
}
</style>
