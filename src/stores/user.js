import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isSignedIn: true, // Tracks if the user is signed in
    isInstuctor: false,
    userName: null,
  }),
  actions: {
    signIn(userName) {
      this.isSignedIn = true
      this.userName = userName // Set user details
    },
    signOut() {
      this.isSignedIn = false
      this.userName = null // Clear user details
    },
    makeInstructor() {
      this.isInstuctor = true
    },
    removeInstructor() {
      this.isInstuctor = false
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
