<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { ArrowUpTrayIcon } from '@heroicons/vue/20/solid'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const userStore = useUserStore()
const toast = useToast()
const isUploading = ref(false)

const validateImage = (file) => {
  return new Promise((resolve, reject) => {
    const maxSize = 1 * 1024 * 1024 // 1 MB
    if (file.size > maxSize) {
      reject(new Error('Image size exceeds 1 MB.'))
      return
    }

    const img = new Image()
    img.onload = () => {
      if (img.height > 1.5 * img.width) {
        reject(new Error('Image is too long compared to its width.'))
      } else if (img.width > 1.5 * img.height) {
        reject(new Error('Image is too wide compared to its height.'))
      } else {
        resolve()
      }
    }

    img.onerror = () => reject(new Error('Invalid image file.'))
    img.src = URL.createObjectURL(file)
  })
}
const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true

  try {
    // Validate image
    await validateImage(file)

    // Upload to ImgBB
    const formData = new FormData()
    formData.append('image', file)
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      params: {
        key: '52ce43b89966292e7c8f4938665bc355',
      },
    })

    const newImageUrl = response.data.data.url

    // Update userStore
    userStore.user.profilePicture = newImageUrl

    // Patch to API
    await axios.patch(`/api/users/${userStore.user.id}`, {
      profilePicture: newImageUrl,
    })

    toast.success('Image updated successfully!')
  } catch (error) {
    toast.error(error.message || 'Error uploading image.')
    console.error('Error:', error)
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="relative rounded-3xl max-h-72 overflow-hidden group">
    <!-- Profile Picture -->
    <img
      :src="userStore.user.profilePicture"
      alt="Profile Picture"
      class="w-full h-full object-cover"
    />

    <!-- Upload Button -->
    <label
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-medium cursor-pointer transition-opacity duration-300 opacity-0 group-hover:opacity-100"
      :class="{ 'cursor-not-allowed opacity-50': isUploading }"
    >
      <input
        type="file"
        accept="image/*"
        class="hidden"
        @change="uploadImage"
        :disabled="isUploading"
      />
      <div v-if="!isUploading" class="flex gap-2 items-center">
        <ArrowUpTrayIcon class="w-5 h-5" />
        <span class="text-xs lg:text-sm">Upload</span>
      </div>
      <span v-else>Uploading...</span>
    </label>
  </div>
</template>
