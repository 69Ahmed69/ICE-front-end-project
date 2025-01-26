<script setup>
import { ref } from 'vue'
import Navbar from '@/components/forum/NavBar.vue'
import QuestionCard from '@/components/forum/QuestionCard.vue'
import NewQuestionModal from '@/components/forum/NewQuestionModal.vue'

const showModal = ref(false)

const questions = ref([
  {
    id: 1,
    title: 'JWT Authentication Best Practices',
    section: 'Section 3.2',
    lecture: 'Lecture 5',
    votes: 42,
    views: 128,
    answers: 5,
    body: "What's the recommended approach for implementing secure JWT authentication in a Node.js backend service with Redis session storage?",
  },
  // Add more questions
])
</script>

<template>
  <div>
    <Navbar />
    <div class="container">
      <QuestionCard
        v-for="question in questions"
        :key="question.id"
        :detailed="true"
        :title="question.title"
        :metas="[question.section, question.lecture]"
        :votes="question.votes"
        :views="question.views"
        :answers="question.answers"
        :body="question.body"
      />
      <button class="fab" @click="showModal = true">+</button>
      <NewQuestionModal v-if="showModal" @close="showModal = false" :show="true" />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #29c8f0;
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(41, 200, 240, 0.2);
}
</style>
