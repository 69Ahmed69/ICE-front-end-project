<script setup>
import { reactive, ref, onMounted } from 'vue'
import CardForm from '@/components/CardForm.vue'
import { useUserStore, useCheckoutStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import IceButton from '@/components/ui elements/IceButton.vue'
import LoadingPopup from '@/components/popups/LoadingPopup.vue'
import PaymentSuccessPopup from '@/components/popups/PaymentSuccessPopup.vue'
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import { emptyCart, isInCart } from '@/utils/CartUtils'
import axios from 'axios'

const userStore = useUserStore()
const toast = useToast()
const router = useRouter()
const checkoutStore = useCheckoutStore()

const subtotal = ref(0)
const total = ref(0)
const taxes = ref(0)
const discount = ref(0)

const formData = reactive({
  cardName: '',
  cardNumber: '',
  cardMonth: 'Month',
  cardYear: 'Year',
  cardCvv: '',
})

const state = reactive({
  courses: [],
  isLoading: true,
})

const cardWarning = ref('')
const checkingOut = ref(false)
const paymentSuccess = ref(false)

const updateCardNumber = (val) => {
  formData.cardNumber = val
}

const updateCardName = (val) => {
  formData.cardName = val
}

const updateCardMonth = (val) => {
  formData.cardMonth = val
}

const updateCardYear = (val) => {
  formData.cardYear = val
}

const updateCardCvv = (val) => {
  formData.cardCvv = val
}

function calculateSubtotal() {
  const today = new Date()

  return state.courses.reduce((subtotal, course) => {
    const discountEndDate = new Date(course.discountEnd)

    // Check if the discount is valid
    const finalPrice = today <= discountEndDate ? course.price - course.discount : course.price

    return subtotal + finalPrice
  }, 0)
}
function calculateTaxes() {
  taxes.value = subtotal.value * 0.01
}

function calculateTotal() {
  return subtotal.value + -(discount.value * subtotal.value) / 100 + taxes.value
}

onMounted(async () => {
  localStorage.removeItem('cameFromCart')
  try {
    // Fetch courses in the shopping cart
    const fetchedCourses = []
    for (const courseId of userStore.user.shoppingCart) {
      const response = await axios.get(`/api/courses/${courseId}`)
      fetchedCourses.push(response.data)
    }
    state.courses = fetchedCourses
    if (checkoutStore.coupon) {
      console.log(checkoutStore.coupon)
      discount.value = checkoutStore.coupon.discount
    }
    subtotal.value = calculateSubtotal()
    calculateTaxes()
    total.value = calculateTotal()
  } catch (error) {
    console.error('Error fetching courses: ', error)
    toast.error('Failed to fetch course details')
  } finally {
    state.isLoading = false
  }
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const completePayment = async () => {
  try {
    checkingOut.value = true

    // Validate required fields
    const { cardNumber, cardName, cardMonth, cardYear, cardCvv } = formData
    if (!cardNumber.trim() || !cardName.trim() || !cardMonth || !cardYear || !cardCvv) {
      cardWarning.value = 'Please fill out all the required fields'
      return
    }

    cardWarning.value = '' // Clear warning after validation

    // Update the coupon's remaining uses in the database
    if (checkoutStore.coupon) {
      await axios.patch(`/api/coupons/${checkoutStore.coupon.id}`, {
        uses: checkoutStore.coupon.uses - 1,
      })
      checkoutStore.removeCoupon()
    }

    // Add the courses to the user's state owned courses
    const newCourses = []
    for (const course of state.courses) {
      if (isInCart(course.id, userStore)) {
        newCourses.push({
          courseId: course.id,
          completion: 0,
          chapters: [],
        })
      }
    }
    userStore.user.ownedCourses.push(...newCourses)

    // Update the user's owned courses in the database
    await axios.patch(`/api/users/${userStore.user.id}`, {
      ownedCourses: userStore.user.ownedCourses,
    })

    // Empty the shopping cart
    emptyCart(userStore)

    // Optional delay for UX
    await delay(3000)
  } catch (error) {
    checkingOut.value = false
    toast.error('Payment verification error.')
    router.push('/shopping-cart/')
  } finally {
    checkingOut.value = false
    paymentSuccess.value = true
  }
}

function daysLeft(discountEnd) {
  const today = new Date()
  const endDate = new Date(discountEnd)
  const timeDifference = endDate - today
  const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
  return days > 0
}
</script>

<template>
  <NavBarTop />
  <NavBarBottom />
  <LoadingPopup v-if="checkingOut" text="Checking out..." />
  <PaymentSuccessPopup v-if="paymentSuccess" />
  <section
    class="flex justify-center items-center gap-2 lg:gap-4 flex-col lg:flex-row lg:px-16 py-6 lg:py-0 bg-gray_4 min-h-screen"
  >
    <div class="flex flex-col mx-4 my-4 lg:w-1/2">
      <CardForm
        :form-data="formData"
        :cardWarning="cardWarning"
        @input-card-number="updateCardNumber"
        @input-card-name="updateCardName"
        @input-card-month="updateCardMonth"
        @input-card-year="updateCardYear"
        @input-card-cvv="updateCardCvv"
      />
    </div>
    <div
      class="flex flex-col lg:mt-36 bg-background border-2 border-fourth rounded-3xl mx-4 lg:w-1/2 shadow-md hover:shadow-2xl ease-in transition-shadow duration-200 divide-y-2 divide-fourth"
    >
      <div class="flex flex-col px-4 lg:px-6 pt-4">
        <h1 class="font-primary text-font font-bold text-base lg:text-lg">
          Courses ({{ state.courses.length }})
        </h1>
        <div
          v-for="course in state.courses"
          :key="course.id"
          class="flex items-center py-2 lg:py-4 pr-2 space-x-3"
        >
          <!-- Course Details -->

          <!-- Course Image -->
          <div class="w-1/3 shadow-lg rounded-3xl">
            <img
              :src="course.image"
              alt="Course-image"
              class="rounded-3xl object-cover lg:min-h-24 h-full"
            />
          </div>

          <!-- Course Info -->
          <div class="flex flex-col">
            <div class="flex gap-1 text-xs lg:text-sm mb-2">
              <span class="text-gray_2 font-medium">Course by: </span>
              <RouterLink :to="`/instructor/${course.instructor}`">
                <span class="text-gray_1 font-medium hover:underline">
                  {{ course.instructorName }}
                </span>
              </RouterLink>
            </div>

            <!-- Title -->
            <h2 class="text-font font-primary font-medium line-clamp-2 mb-2 text-sm lg:text-lg">
              {{ course.title }}
            </h2>

            <div class="flex space-x-2 items-center">
              <div class="space-x-1">
                <span
                  v-if="course.price - course.discount > 0 && daysLeft(course.discountEnd)"
                  class="text-primary font-medium font-primary text-base lg:text-xl"
                >
                  ${{ (course.price - course.discount).toFixed(2) }}
                </span>
                <span
                  v-else-if="!daysLeft(course.discountEnd)"
                  class="text-primary font-medium font-primary text-base lg:text-xl"
                  >${{ course.price.toFixed(2) }}</span
                >
                <span v-else class="text-danger font-primary text-base lg:text-xl font-medium"
                  >FREE</span
                >
                <span
                  v-if="course.discount > 0 && daysLeft(course.discountEnd)"
                  class="text-gray_3 line-through font-primary text-sm"
                >
                  ${{ course.price.toFixed(2) }}
                </span>
              </div>
              <span
                v-if="course.discount > 0 && daysLeft(course.discountEnd)"
                class="bg-fourth rounded-3xl px-2 py-1 text-primary font-medium font-primary text-sm"
                >{{ ((course.discount * 100) / course.price).toFixed(0) }}% OFF</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col px-4 lg:px-6 py-4 divide-y-2 divide-tertiary">
        <div class="flex flex-col gap-2 mb-3">
          <h2 class="text-font font-medium text-base lg:text-lg">Order Summary</h2>
          <div class="flex items-center justify-between px-2">
            <span class="text-gray_2 font-medium text-sm lg:text-base">Subtotal</span>
            <span class="text-font font-medium text-base lg:text-lg font-primary"
              >{{ subtotal.toFixed(2) }} USD</span
            >
          </div>
          <div class="flex items-center justify-between px-2">
            <span class="text-gray_2 font-medium text-sm lg:text-base">Taxes</span>
            <span class="text-font font-medium text-base lg:text-lg font-primary"
              >{{ taxes.toFixed(2) }} USD</span
            >
          </div>
          <div class="flex items-center justify-between px-2">
            <span class="text-gray_2 font-medium text-sm lg:text-base">Discount</span>
            <span class="text-font font-medium text-base lg:text-lg font-primary"
              >{{ discount }}%</span
            >
          </div>
        </div>
        <div class="flex flex-col gap-3 py-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray_1 font-medium text-base lg:text-lg">Total:</span>
            <span class="text-font text-lg lg:text-2xl font-semibold font-primary"
              >{{ total.toFixed(2) }} USD</span
            >
          </div>
          <IceButton
            text="Complete Payment"
            :size="4"
            :priority="1"
            class="w-full py-4"
            @click="completePayment"
          />
        </div>
      </div>
    </div>
  </section>
</template>
