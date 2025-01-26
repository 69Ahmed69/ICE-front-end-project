<script>
export default {
  props: {
    badgeText: String,
    badgeColor: String,
    username: String,
    time: String,
    content: String,
  },
}
</script>

<template>
  <div class="reply-card">
    <div class="user-info">
      <div class="user-badge" :style="{ background: badgeColor }">{{ badgeText }}</div>
      <span class="username">{{ username }}</span>
      <span class="time">{{ time }}</span>
    </div>
    <p class="content">{{ content }}</p>
  </div>
</template>

<style scoped>
.reply-card {
  background: rgba(156, 224, 255, 0.05);
  border-left: 3px solid #9ce0ff;
  margin: 1rem 0 1rem 2rem;
  padding: 1rem;
  border-radius: 8px;
}

.user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
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
  font-size: 0.95rem;
}
</style>
