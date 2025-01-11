<script setup>
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import FooterTop from '@/components/footers/FooterTop.vue'
import FooterBottom from '@/components/footers/FooterBottom.vue'
import IceButton from '@/components/ui elements/IceButton.vue'
import { ArrowRightIcon } from '@heroicons/vue/20/solid'
import CourseListingBox from '@/components/course listings/CourseListingBox.vue'
import { reactive, onMounted, ref } from 'vue'
import { useUserStore, useCheckoutStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const checkoutStore = useCheckoutStore()
const couponInput = ref('')
const usedCoupon = ref('')
const couponWarning = ref('')
const subtotal = ref(0)
const total = ref(0)
const taxes = ref(0)
const discount = ref(0)

const state = reactive({
  courses: [],
  isLoading: true,
})

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

function handleCourseDelete(courseId) {
  const index = state.courses.findIndex((course) => course.id == courseId)
  if (index !== -1) {
    state.courses.splice(index, 1)
  }
  subtotal.value = calculateSubtotal()
  calculateTaxes()
  total.value = calculateTotal()
}

async function applyCoupon() {
  try {
    if (!(usedCoupon == couponInput.value)) {
      const response = await axios.get(`/api/coupons/${couponInput.value}`)
      const coupon = response.data

      const today = new Date()
      const expirationDate = new Date(coupon.expires)

      if (today > expirationDate) {
        couponWarning.value = 'This promo code has expired.'
        return
      }

      if (coupon.uses <= 0) {
        couponWarning.value = 'This promo code has been fully used.'
        return
      }

      discount.value = coupon.discount
      usedCoupon.value = couponInput.value
      couponInput.value = ''
      couponWarning.value = ''
      total.value = calculateTotal()
      checkoutStore.applyCoupon(coupon)
      // Update the coupon's remaining uses in the database
      // await axios.patch(`/api/coupons/${promoCodeId}`, {
      //   uses: coupon.uses - 1,
      // })

      toast.success('Coupon applied successfully!')
    } else {
      couponWarning.value = 'This coupon is already in use.'
      return
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      couponWarning.value = 'Invalid coupon code.'
    } else {
      console.error('Error applying promo code: ', error)
      toast.error('Failed to apply promo code. Please try again.')
    }
  }
}

onMounted(async () => {
  try {
    // Fetch courses in the shopping cart
    const fetchedCourses = []
    for (const courseId of userStore.user.shoppingCart) {
      const response = await axios.get(`/api/courses/${courseId}`)
      fetchedCourses.push(response.data)
    }
    state.courses = fetchedCourses
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

const goToCheckout = () => {
  // Set a flag that the user came from the cart
  localStorage.setItem('cameFromCart', 'true')
  router.push('/check-out/')
}
</script>

<template>
  <NavBarTop />
  <NavBarBottom />
  <section v-if="!state.isLoading">
    <div
      v-if="state.courses.length == 0"
      class="flex items-center justify-center bg-gray_4 h-48 px-6"
    >
      <div
        class="flex items-center p-10 justify-center bg-background rounded-full shadow-xl text-font font-primary font-medium text-base lg:text-xl"
      >
        Oops! it looks like there's no items in your shopping cart.
      </div>
    </div>
    <div v-else class="flex flex-col my-4 lg:my-12 mx-6 lg:mx-32 space-y-4">
      <h1 class="font-primary text-font font-bold text-xl lg:text-2xl">
        Shopping Cart ({{ userStore.user.shoppingCart.length }})
      </h1>
      <div
        class="flex flex-col space-y-4 lg:space-y-0 lg:space-x-8 lg:flex-row w-full lg:items-start items-center"
      >
        <CourseListingBox
          :courses="state.courses"
          type="shoppingCart"
          class="lg:w-3/4"
          @delete="handleCourseDelete"
        />
        <div class="flex flex-col w-2/3 lg:w-1/4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray_2 font-medium text-xs lg:text-sm">Subtotal</span>
            <span class="text-gray_1 font-medium text-sm lg:text-base font-primary"
              >${{ subtotal.toFixed(2) }}</span
            >
          </div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray_2 font-medium text-xs lg:text-sm">Coupon Discount</span>
            <span class="text-gray_1 font-medium text-sm lg:text-base font-primary"
              >{{ discount }}%</span
            >
          </div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray_2 font-medium text-xs lg:text-sm">Taxes 1%</span>
            <span class="text-gray_1 font-medium text-sm lg:text-base font-primary"
              >${{ taxes.toFixed(2) }}</span
            >
          </div>
          <div class="border-t-2 w-full border-tertiary my-2"></div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray_1 font-medium text-sm lg:text-base">Total:</span>
            <span class="text-font text-base lg:text-xl font-bold font-primary"
              >${{ total.toFixed(2) }}</span
            >
          </div>
          <IceButton
            text="Checkout"
            :size="4"
            :priority="1"
            :icon="ArrowRightIcon"
            icon-position="right"
            class="w-full mb-2"
            @click="goToCheckout"
          />
          <div class="border-t-2 w-full border-tertiary mt-2 mb-4"></div>
          <span class="text-gray_1 font-medium text-xs lg:text-sm font-primary mb-2"
            >Apply coupon code:</span
          >
          <div class="flex items-center gap-2 w-full mb-2">
            <input
              v-model="couponInput"
              type="text"
              placeholder="Your coupon..."
              class="h-10 py-1 text-font lg:py-2 rounded-full border-2 border-tertiary px-4 text-sm lg:text-base focus:outline-primary hover:bg-fourth font-medium"
            />
            <button
              title="Apply Code"
              @click="applyCoupon"
              class="py-1 px-3 text-white bg-gray_1 rounded-full shadow-md hover:bg-primary-dark hover:shadow-xl transition-shadow duration-200 ease-in"
            >
              Apply
            </button>
          </div>
          <span class="text-danger font-medium text-xs lg:text-sm mb-2">{{ couponWarning }}</span>
        </div>
      </div>
    </div>
  </section>
  <div v-else>
    <LoadingAnimation />
  </div>
  <FooterTop />
  <FooterBottom />
</template>
