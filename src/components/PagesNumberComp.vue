<script setup>
import { reactive, onMounted } from 'vue'
import { defineProps } from 'vue'
import BestSellingCourses from './BestSellingCourses2.vue'
import axios from 'axios'
import barcourses from './navbars/barcourses.vue'
import FilterComponent from './FilterComponent.vue'
const props = defineProps({
  courses: [],
  bar: {
    default: false,
  },
  catpage: {
    default: false,
  },
  catcoure: {
    type: Array,
  },
})

const state = reactive({
  courses: [],
  currentcourses: 0,
  coursessection: [],
  coursessection2: [],
  sortes: ['most students', 'Z-A', 'A-Z', 'most stars'],
  isLoading: true,
  categorys: null,
  ratings: [],
  courseleve: [],
  duration: [],
  price: [],
  tstudient: Number,
  nbr: 0,
  flt: { default: false },
})
state.flt = false

function chnf() {
  state.flt = !state.flt
}

function chs(getvalue) {
  console.log('Sorting by: ' + getvalue)

  const flattenedCourses = state.coursessection.flat() // [[],, []] => [,,,,,]

  if (getvalue === state.sortes[0]) {
    flattenedCourses.sort((a, b) => b.students - a.students)
  } else if (getvalue === state.sortes[1]) {
    flattenedCourses.sort((a, b) => (b.title.toLowerCase() > a.title.toLowerCase() ? 1 : -1))
  } else if (getvalue === state.sortes[2]) {
    flattenedCourses.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
  } else if (getvalue === state.sortes[3] || getvalue === undefined) {
    flattenedCourses.sort((a, b) => b.rating - a.rating)
  }

  const chunkSize = 24
  state.coursessection = []
  for (let i = 0; i < flattenedCourses.length; i += chunkSize) {
    state.coursessection.push(flattenedCourses.slice(i, i + chunkSize))
  } // [,,,,,] => [[],, []]
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
onMounted(async () => {
  try {
    // Simulated lag
    await delay(5000)
    const response = await axios.get('/api/courses')
    if (props.catpage == true) {
      state.courses = props.catcoure
    } else {
      state.courses = response.data
    }

    for (let x in state.courses) {
      state.ratings.push(state.courses[x].rating)
      state.courseleve.push(state.courses[x].level)
      state.duration.push(state.courses[x].duration)
      state.price.push(state.courses[x].price)
    }
    state.ratings = [
      { label: '5 Star', number: state.ratings.filter((e) => e >= 5).length },
      { label: '4 Star & up', number: state.ratings.filter((e) => e >= 4).length },
      { label: '3 Star & up', number: state.ratings.filter((e) => e >= 3).length },
      { label: '2 Star & up', number: state.ratings.filter((e) => e >= 2).length },
      { label: '1 Star & up', number: state.ratings.filter((e) => e >= 1).length },
    ]
    state.courseleve = [
      { label: 'All', number: state.courseleve.length },
      { label: 'Beginner', number: state.courseleve.filter((e) => e == 0).length },
      { label: 'Intermediate', number: state.courseleve.filter((e) => e == 1).length },
      { label: 'Expert', number: state.courseleve.filter((e) => e == 2).length },
    ]
    state.duration = [
      { label: '6-12 Mounths', number: state.duration.filter((e) => e > 180 && e <= 365).length },
      { label: '3-6 Mounths', number: state.duration.filter((e) => e > 90 && e <= 180).length },
      { label: '1-3 Mounths', number: state.duration.filter((e) => e > 30 && e <= 90).length },
      { label: '1-4 weeks', number: state.duration.filter((e) => e > 7 && e <= 28).length },
      { label: '1-7 Days', number: state.duration.filter((e) => e <= 7).length },
    ]
    state.price = [
      { label: 'paid', number: state.price.filter((e) => e > 0).length },
      { label: 'Free', number: state.price.filter((e) => e == 0).length },
    ]
    state.tstudient = 0
    state.tstudient = [...state.courses].reduce((total, ele) => total + ele.students, 0)
    const y = await axios.get('/api/categories')
    state.categorys = y.data
    state.categorys = [...new Set(state.categorys.map((t) => t.name))]
    state.categorys = state.categorys.map((item) => ({ label: item }))
    //default sor
    state.courses.sort((a, b) => b.rating - a.rating)
    //nbr is the number of page for courses (one page =24courese)
    state.nbr = Math.floor(state.courses.length / 24) + (state.courses.length % 24 > 0 ? 1 : 0)
    let clone = state.courses
    while (clone.length > 0) {
      state.coursessection.push(clone.splice(0, Math.min(24, clone.length)))
    }
    state.coursessection2 = state.coursessection
  } catch (error) {
    console.error('Error fetching courses: ', error)
  } finally {
    state.isLoading = false
  }
})
function filtercourseshere(x) {
  console.log(x)
  let flattenedCourses = state.coursessection2.flat()

  if (x.y === 'Rating') {
    switch (x.label.label) {
      case '5 Star':
        flattenedCourses = flattenedCourses.filter((e) => e.rating >= 5)
        break
      case '4 Star & up':
        flattenedCourses = flattenedCourses.filter((e) => e.rating >= 4)
        break
      case '3 Star & up':
        flattenedCourses = flattenedCourses.filter((e) => e.rating >= 3)
        break
      case '2 Star & up':
        flattenedCourses = flattenedCourses.filter((e) => e.rating >= 2)
        break
      case '1 Star & up':
        flattenedCourses = flattenedCourses.filter((e) => e.rating >= 1)
        break
      default:
        console.log('Error: Unknown rating filter')
        return
    }
  }
  /****************************************************************************************** */
  if (x.y === 'categorys') {
    flattenedCourses = flattenedCourses.filter((e) => e.category == x.label.label)
  }
  /****************************************************************************************** */
  if (x.y === 'tools') {
    console.log('notdone')
  }
  /****************************************************************************************** */
  if (x.y === 'Courses Level') {
    switch (x.label.label) {
      case 'All':
        flattenedCourses = flattenedCourses.filter((e) => e.level >= 0 && e.level < 3)
        break
      case 'Beginner':
        flattenedCourses = flattenedCourses.filter((e) => e.level == 0)
        break
      case 'Intermediate':
        flattenedCourses = flattenedCourses.filter((e) => e.level == 1)
        break
      case 'Expert':
        flattenedCourses = flattenedCourses.filter((e) => e.level == 2)
        break
      default:
        console.log('Error: Unknown rating filter')
        return
    }
  }
  /****************************************************************************************** */
  if (x.y === 'Price') {
    console.log('Error: Unknown rating filter')
  }
  /****************************************************************************************** */
  if (x.y === 'duration') {
    console.log('here')
    switch (x.label.label) {
      case '6-12 Mounths':
        flattenedCourses = flattenedCourses.filter((e) => e.duration > 180 && e.duration <= 365)
        break
      case '3-6 Mounths':
        flattenedCourses = flattenedCourses.filter((e) => e.duration > 90 && e.duration <= 180)
        break
      case '1-3 Mounths':
        flattenedCourses = flattenedCourses.filter((e) => e.duration > 30 && e.duration <= 90)
        break
      case '1-4 weeks':
        flattenedCourses = flattenedCourses.filter((e) => e.duration > 7 && e.duration <= 28)
        break
      case '1-7 Days':
        flattenedCourses = flattenedCourses.filter((e) => e.duration <= 7)
        break
      default:
        console.log('Error: Unknown rating filter')
        return
    }
  }
  /****************************************************************************************** */
  const chunkSize = 24
  state.coursessection = []
  for (let i = 0; i < flattenedCourses.length; i += chunkSize) {
    state.coursessection.push(flattenedCourses.slice(i, i + chunkSize))
  }
}
function forward() {
  changecurrent(state.currentcourses + 1)
  document.querySelector('#forward').classList.add('activearrow')
  document.querySelector('#backward').classList.remove('activearrow')
}
function backward() {
  changecurrent(state.currentcourses - 1)
  document.querySelector('#backward').classList.add('activearrow')
  document.querySelector('#forward').classList.remove('activearrow')
}
// change cuurente
function changecurrent(ine) {
  if (ine >= 0 && ine < state.coursessection.length) {
    state.currentcourses = ine
    let x = document.querySelectorAll('.btn')
    x.forEach((e) => {
      e.classList.remove('active')
    })
    x[ine].classList.add('active')
  }
}

const ste = reactive({
  st: [
    'grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4',
    'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4',
  ],
})

function mine(minValue, max) {
  console.log('Minimum Price Filter:', minValue)

  // Flatten the courses array
  let flattenedCourses = state.coursessection2.flat()
  console.log(flattenedCourses)
  // Filter courses with a price greater than minValue
  flattenedCourses = flattenedCourses.filter(
    (course) => course.price >= minValue && course.price < max,
  )
  console.log(flattenedCourses)
  // Chunk the filtered courses into sections of size 24
  const chunkSize = 24
  state.coursessection = [] // Reset the state

  for (let i = 0; i < flattenedCourses.length; i += chunkSize) {
    state.coursessection.push(flattenedCourses.slice(i, i + chunkSize))
  }

  console.log('Updated Courses Section:', state.coursessection)
}

function maxe(maxValue, min) {
  console.log(maxValue)
  let flattenedCourses = state.coursessection2.flat()
  flattenedCourses = flattenedCourses.filter((e) => e.price <= maxValue && e.price > min)
  const chunkSize = 24
  state.coursessection = []
  for (let i = 0; i < flattenedCourses.length; i += chunkSize) {
    state.coursessection.push(flattenedCourses.slice(i, i + chunkSize))
  }
  console.log(state.coursessection)
}
function Changecourses(x) {
  let flattenedCourses = state.coursessection2.flat()
  flattenedCourses = flattenedCourses.filter((e) =>
    e.title.toLowerCase().startsWith(x.toLowerCase()),
  )
  const chunkSize = 24
  state.coursessection = []
  for (let i = 0; i < flattenedCourses.length; i += chunkSize) {
    state.coursessection.push(flattenedCourses.slice(i, i + chunkSize))
  }
}
var filernbr = reactive()
</script>
<template>
  <section>
    <barcourses
      @changecourses="Changecourses"
      @changeSort="chs"
      @changeFilter="chnf"
      :filernbr="filernbr"
      :courses="state.courses"
      :totalstudient="state.tstudient"
      v-if="bar"
    />
    <div class="filter max-w-7xl mx-auto px-4">
      <FilterComponent
        @incr="filernbr++"
        @maxpricee="maxe"
        @minpricee="mine"
        @filtercourseshere="filtercourseshere"
        v-if="state.flt"
        :categorys="state.categorys"
        :ratings="state.ratings"
        :price="state.price"
        :CoursesLevel="state.courseleve"
        :duration="state.duration"
        class="pt-40"
      />
      <BestSellingCourses
        :stylee="state.flt == true ? ste.st[0] : ste.st[1]"
        :showButton="false"
        class="pt-40"
        :currentcoursea="
          courses != null || undefined ? courses : state.coursessection[state.currentcourses]
        "
      />
    </div>

    <div class="containerr">
      <div class="list">
        <img src="/src/assets/img/ArrowLeftb.png" alt="" id="backward" @click="backward()" />
        <ul style="display: flex; gap: 10px">
          <li
            class="btn"
            style="border-radius: 50%"
            v-for="index in courses != null || undefined
              ? Math.floor(courses.length / 24 + (courses.length % 24 > 0 ? 1 : 0))
              : state.nbr"
            :key="index"
          >
            <button @click="changecurrent(index - 1)" v-if="index < 10">
              <p
                style="
                  height: 30px;
                  width: 30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                0{{ index }}
              </p>
            </button>
            <button @click="changecurrent(index - 1)" v-else>
              <p
                style="
                  height: 30px;
                  width: 30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                {{ index }}
              </p>
            </button>
          </li>
        </ul>
        <img src="/src/assets/img/ArrowRightb.png" alt="" id="forward" @click="forward()" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.containerr {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}
.list {
  display: flex;
  justify-content: space-between;
  align-self: center;
  gap: 20px;
}
.active {
  background-color: #29c8f099;
  color: white;
}
.activearrow {
  background-color: #29c8f040;
}
img {
  border-radius: 50%;
  cursor: pointer;
  padding: 10px;
  width: 50px;
}
.btn {
  padding: 10px;
}
.filter {
  display: flex;
  flex-direction: row;
}
</style>
