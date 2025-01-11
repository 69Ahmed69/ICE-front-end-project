import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isSignedIn: false, // Tracks if the user is signed in
    isInstuctor: false,
    user: null,
  }),
  actions: {
    signIn(user) {
      this.isSignedIn = true
      this.user = user // Set user details
    },
    signOut() {
      this.isSignedIn = false
      this.user = null // Clear user details
    },
    makeInstructor() {
      this.isInstuctor = true
    },
    removeInstructor() {
      this.isInstuctor = false
    },
  },
})

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    total: 0,
    subtotal: 0,
    coupon: null,
  }),
  actions: {
    changeTotal(total, subtotal) {
      ;(this.total = total), (this.subtotal = subtotal)
    },
    applyCoupon(coupon) {
      this.coupon = coupon
    },
    removeCoupon() {
      this.coupon = null
    },
  },
})

export const usePrefrencesStore = defineStore('prefrences', {
  state: () => ({
    language: 'English',
    currency: 'USD',
  }),
  actions: {
    setLanguage(language) {
      this.language = language
    },
    setCurrency(currency) {
      this.currency = currency
    },
  },
})
