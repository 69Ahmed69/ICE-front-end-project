<script setup>
import { ref } from 'vue'
import Navbar from '@/components/forum/NavBar.vue'
import QuestionCard from '@/components/forum/QuestionCard.vue'
import AnswerCard from '@/components/forum/AnswerCard.vue'
import AnswerForm from '@/components/forum/AnswerForm.vue'

const question = ref({
  title: 'Advanced JWT Authentication Patterns in Microservices',
  metas: ['Section 3.2', 'Lecture 5', '👁 128 views'],
  votes: 42,
  body: 'What are the current best practices for implementing JWT authentication...',
})

const answers = ref([
  {
    badgeText: 'Instructor',
    badgeColor: '#34c759',
    username: 'Dr. Sarah Johnson',
    time: '2 hours ago',
    content: 'Here are the key recommendations...',
    votes: 15,
    replies: [
      {
        badgeText: 'Student',
        badgeColor: '#29c8f0',
        username: 'John Doe',
        time: '30 mins ago',
        content: 'Thank you! How would you handle token revocation...',
      },
    ],
  },
])
</script>

<template>
  <div>
    <Navbar />
    <div class="container">
      <QuestionCard
        :detailed="true"
        :title="question.title"
        :metas="question.metas"
        :votes="question.votes"
        :body="question.body"
      />

      <div class="answers-section">
        <h2 style="color: #023e8a; margin-bottom: 2rem">{{ answers.length }} Answers</h2>
        <AnswerCard
          v-for="(answer, index) in answers"
          :key="index"
          :detailed="true"
          :badge-text="answer.badgeText"
          :badge-color="answer.badgeColor"
          :username="answer.username"
          :time="answer.time"
          :content="answer.content"
          :votes="answer.votes"
          :replies="answer.replies"
        />
        <AnswerForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.answers-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(156, 224, 255, 0.3);
}
</style>
