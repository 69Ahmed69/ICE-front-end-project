<script setup>
import { defineProps } from 'vue'
import VotingSection from './VotingSection.vue'
const props = defineProps({
  badgeText: String,
  badgeColor: {
    type: String,
    default: '#34c759',
  },
  username: String,
  time: String,
  content: String,
  votes: Number,
  replies: Array,
})
</script>

<template>
  <div class="answer-card">
    <div class="header">
      <div class="user-info">
        <div class="user-badge" :style="{ background: props.badgeColor }">
          {{ props.badgeText }}
        </div>
        <span class="username">{{ props.username }}</span>
        <span class="time">{{ props.time }}</span>
      </div>
      <VotingSection :count="props.votes" size="sm" />
    </div>
    <p class="content">{{ props.content }}</p>
    <div v-for="(reply, index) in props.replies" :key="index" class="reply">
      <ReplyCard v-bind="reply" />
    </div>
  </div>
</template>

<style scoped>
.answer-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-badge {
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.username {
  color: #023e8a;
  font-weight: 500;
}

.time {
  color: #3b444a;
}

.content {
  color: #09314a;
  line-height: 1.6;
}
</style>
