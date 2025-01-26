<script>
export default {
  props: {
    count: Number,
    size: {
      type: String,
      default: 'md',
    },
  },
}
</script>

<template>
  <div class="voting-section" :class="size">
    <button class="vote-btn">▲</button>
    <span class="vote-count">{{ count }}</span>
    <button class="vote-btn">▼</button>
  </div>
</template>

<style scoped>
.voting-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.vote-btn {
  background: #9ce0ff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s;
}

.vote-btn:hover {
  background: #29c8f0;
  transform: scale(1.1);
}

.voting-section.md .vote-btn {
  width: 40px;
  height: 40px;
}

.voting-section.sm .vote-btn {
  width: 32px;
  height: 32px;
}

.vote-count {
  color: #023e8a;
  font-weight: 700;
  font-size: 1.2rem;
}
</style>
