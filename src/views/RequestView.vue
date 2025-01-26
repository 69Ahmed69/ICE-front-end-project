<script setup>
import NavBarTop from '@/components/navbars/NavBarTop.vue'
import NavBarBottom from '@/components/navbars/NavBarBottom.vue'
import IceButton from '@/components/ui elements/IceButton.vue'
import LoadingPopup from '@/components/popups/LoadingPopup.vue'
import { useUserStore } from '@/stores/user'
import { ref, onMounted } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import axios from 'axios'

const toast = useToast()
const userStore = useUserStore()
const router = useRouter()
const fullName = ref('')
const phoneNumber = ref('')
const cv = ref(null)
const idCard = ref(null)
const selfie = ref(null)

const uploading = ref(false)
const validName = ref(false)
const validPhone = ref(false)

const nameWarning = ref('')
const phoneWarning = ref('')

const filesWarning = ref('')

const nameRegex = /^[a-zA-Z\s]{3,100}$/
const phoneRegex = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/

function checkName() {
  if (!fullName.value) {
    nameWarning.value = 'First name is required.'
    validName.value = false
  } else if (!nameRegex.test(fullName.value)) {
    nameWarning.value = "Your name can't contain digits or special characters."
    validName.value = false
  } else {
    nameWarning.value = ''
    validName.value = true
  }
  sessionStorage.setItem('fullName', fullName.value)
}

function checkPhone() {
  if (!phoneNumber.value) {
    phoneWarning.value = 'Phone number is required.'
    validPhone.value = false
  } else if (!phoneRegex.test(phoneNumber.value)) {
    phoneWarning.value = 'Please enter a valid Algerian phone number without spaces.'
    validPhone.value = false
  } else {
    phoneWarning.value = ''
    validPhone.value = true
  }
  sessionStorage.setItem('phoneNumber', phoneNumber.value)
}

const handleFileChange = (event, field) => {
  const file = event.target.files[0]
  if (field == 'cv') {
    cv.value = file
    sessionStorage.setItem('cv', cv.value)
  }
  if (field == 'idCard') {
    idCard.value = file
    sessionStorage.setItem('idCard', idCard.value)
  }
  if (field == 'selfie') {
    selfie.value = file
    sessionStorage.setItem('selfie', selfie.value)
  }
}

const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
    params: {
      key: '52ce43b89966292e7c8f4938665bc355',
    },
  })

  return response.data.data.url
}

const submitForm = async () => {
  if (!cv.value || !idCard.value || !selfie.value) {
    filesWarning.value = 'Please upload all three files to continue.'
    return
  }
  try {
    uploading.value = true
    const cvUrl = await uploadFile(cv.value)
    const idCardUrl = await uploadFile(idCard.value)
    const selfieUrl = await uploadFile(selfie.value)

    const requestData = {
      id: userStore.user.id,
      fullName: fullName.value,
      phoneNumber: phoneNumber.value,
      cv: cvUrl,
      idCard: idCardUrl,
      selfie: selfieUrl,
      status: 'Pending',
      submitted: new Date().toISOString(),
    }

    const response = await axios.post('/api/requests', requestData)

    if (response.status === 201) {
      router.push('/')
      toast.success(`Your request was submitted successfully.`)
    } else {
      toast.error('Failed to submit request. Please try again.')
    }
  } catch (error) {
    console.error('Submission failed:', error)
    toast.error('An error occurred. Please try again later.')
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  if (sessionStorage.getItem('fullName')) {
    fullName.value = sessionStorage.getItem('fullName') || ''
    checkName()
  }
  if (sessionStorage.getItem('phoneNumber')) {
    phoneNumber.value = sessionStorage.getItem('phoneNumber')
    checkPhone()
  }
  if (sessionStorage.getItem('cv')) {
    cv.value = sessionStorage.getItem('cv')
  }
  if (sessionStorage.getItem('idCard')) {
    idCard.value = sessionStorage.getItem('idCard')
  }
  if (sessionStorage.getItem('selfie')) {
    selfie.value = sessionStorage.getItem('selfie')
  }
})
</script>

<template>
  <LoadingPopup v-if="uploading" text="We're uploading your request... please be patient." />
  <NavBarTop />
  <NavBarBottom />
  <div class="min-h-screen flex items-center justify-center bg-gray_4">
    <div class="bg-background shadow-lg rounded-3xl p-6 lg:p-12 w-1/2">
      <h2 class="text-2xl font-bold text-font font-primary mb-4">Become an Instructor</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="flex flex-col w-full gap-2">
          <div class="flex items-center gap-2">
            <label class="text-font text-xs lg:text-base font-medium"
              >Full name (name on the ID card)</label
            >
            <span class="text-danger text-xs lg:text-sm">{{ nameWarning }}</span>
          </div>
          <input
            type="text"
            v-model="fullName"
            placeholder="Full name..."
            @input="checkName"
            class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
          />
        </div>

        <div class="flex flex-col w-full gap-2">
          <div class="flex items-center gap-2">
            <label class="text-font text-xs lg:text-base font-medium">Phone number</label>
            <span class="text-danger text-xs lg:text-sm">{{ phoneWarning }}</span>
          </div>

          <input
            type="text"
            v-model="phoneNumber"
            placeholder="0555666777"
            @input="checkPhone"
            class="py-1 text-font lg:py-2 rounded-full border border-tertiary px-4 text-sm lg:text-base focus:outline-1 focus:outline-primary hover:bg-fourth"
          />
        </div>

        <div>
          <label for="cv" class="block text-sm lg:text-base font-medium text-font"
            >CV (High quality PNG or JPG)</label
          >
          <input
            @change="handleFileChange($event, 'cv')"
            type="file"
            id="cv"
            accept="image/*"
            class="mt-2 block w-full text-sm text-gray_2 file:mr-4 file:py-3 file:px-6 file:rounded-3xl file:border-0 file:text-sm file:font-semibold file:bg-fourth file:text-font hover:file:text-white hover:file:bg-secondary file:cursor-pointer"
          />
        </div>

        <div>
          <label for="idCard" class="block text-sm lg:text-base font-medium text-font"
            >ID Card (High quality PNG or JPG)</label
          >
          <input
            @change="handleFileChange($event, 'idCard')"
            type="file"
            id="idCard"
            accept="image/*"
            class="mt-2 block w-full text-sm text-gray_2 file:mr-4 file:py-3 file:px-6 file:rounded-3xl file:border-0 file:text-sm file:font-semibold file:bg-fourth file:text-font hover:file:text-white hover:file:bg-secondary file:cursor-pointer"
          />
        </div>

        <div>
          <label for="selfie" class="block text-sm lg:text-base font-medium text-font"
            >Selfie (Max size 5 MB)</label
          >
          <input
            @change="handleFileChange($event, 'selfie')"
            type="file"
            id="selfie"
            accept="image/*"
            class="mt-2 block w-full text-sm text-gray_2 file:mr-4 file:py-3 file:px-6 file:rounded-3xl file:border-0 file:text-sm file:font-semibold file:bg-fourth file:text-font hover:file:text-white hover:file:bg-secondary file:cursor-pointer"
          />
        </div>
        <span class="text-danger text-xs lg:text-sm">{{ filesWarning }}</span>
        <div class="flex items-center justify-center">
          <IceButton
            :priority="1"
            :size="4"
            :icon="ArrowRightIcon"
            icon_position="right"
            :disabled="!validName || !validPhone"
            text="Sumbit request"
            class="lg:h-12 w-1/2 disabled:bg-gray_2 disabled:cursor-not-allowed disabled:border-gray_2"
            type="submit"
          />
        </div>
      </form>
    </div>
  </div>
</template>
