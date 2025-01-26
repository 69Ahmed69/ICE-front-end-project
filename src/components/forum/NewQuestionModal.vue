<script setup>
import { ref, defineProps } from 'vue'

const emit = defineEmits(['close', 'submit'])
defineProps({
  show: Boolean,
})

const form = ref({
  title: '',
  description: '',
  section: '',
  lecture: '',
})

const files = ref([])
const fileInput = ref(null)

const close = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    section: '',
    lecture: '',
  }
  files.value = []
}

const triggerFileUpload = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  files.value = Array.from(event.target.files)
}

const handleSubmit = () => {
  const questionData = {
    ...form.value,
    attachments: files.value,
  }
  emit('submit', questionData)
  close()
}
</script>

<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-content">
      <div class="header">
        <h3 class="title">New Question</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input
            type="text"
            class="form-input"
            placeholder="Enter question title"
            v-model="form.title"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            class="form-input"
            rows="4"
            placeholder="Describe your question in detail"
            v-model="form.description"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Section</label>
          <select class="form-input" v-model="form.section" required>
            <option value="">Select Section</option>
            <option>Section 3.2</option>
            <option>Section 4.1</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Lecture</label>
          <select class="form-input" v-model="form.lecture" required>
            <option value="">Select Lecture</option>
            <option>Lecture 5</option>
            <option>Lecture 8</option>
          </select>
        </div>

        <div class="file-input" @click="triggerFileUpload">
          <input type="file" multiple hidden ref="fileInput" @change="handleFileUpload" />
          <span>📎 Attach Files ({{ files.length }} selected)</span>
        </div>

        <button type="submit" class="submit-btn">Post Question</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  color: #023e8a;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #3b444a;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  color: #09314a;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #9ce0ff;
  border-radius: 8px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #29c8f0;
  box-shadow: 0 0 0 2px rgba(41, 200, 240, 0.2);
}

.file-input {
  background: rgba(156, 224, 255, 0.1);
  border: 2px dashed #9ce0ff;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  margin: 1rem 0;
}

.file-input:hover {
  background: rgba(156, 224, 255, 0.2);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #29c8f0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}
</style>
