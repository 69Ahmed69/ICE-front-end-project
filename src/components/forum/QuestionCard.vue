<script setup>
import { defineProps } from 'vue'
import VotingSection from './VotingSection.vue'
defineProps({
  detailed: Boolean,
  title: String,
  metas: Array,
  body: String,
  votes: Number,
  views: Number,
  answers: Number,
})
</script>
<template>
  <div class="question-card">
    <div v-if="detailed" class="voting-absolute">
      <VotingSection :count="votes" size="md" />
    </div>
    <div v-else class="voting-inline">
      <VotingSection :count="votes" size="sm" />
    </div>

    <h1 v-if="detailed" class="title-detailed">{{ title }}</h1>
    <h3 v-else class="title">{{ title }}</h3>

    <div class="meta-section">
      <template v-if="detailed">
        <div v-for="(meta, index) in metas" :key="index" class="meta-chip">
          {{ meta }}
        </div>
      </template>
      <template v-else>
        <span v-for="(meta, index) in metas" :key="index">{{ meta }}</span>
      </template>
    </div>

    <p v-if="detailed" class="body">{{ body }}</p>

    <div v-if="detailed" class="attachments">
      <a href="#" style="color: #023e8a">auth-middleware.js</a>
    </div>

    <div v-if="!detailed" class="stats">
      <span>👁 {{ views }} views</span>
      <span>💬 {{ answers }} answers</span>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 24px rgba(41, 200, 240, 0.08);
  position: relative;
}

.voting-absolute {
  position: absolute;
  left: -50px;
  top: 20px;
}

.voting-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.title-detailed {
  color: #023e8a;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.title {
  color: #023e8a;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.meta-section {
  display: flex;
  gap: 1.5rem;
  color: #3b444a;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.meta-chip {
  background: rgba(156, 224, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.body {
  color: #09314a;
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.stats {
  display: flex;
  gap: 1.5rem;
  color: #79a2a4;
  font-size: 0.9rem;
}
</style>
