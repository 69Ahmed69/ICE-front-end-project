<template>
  <div class="answer-form">
    <h3 class="title">Post Your Answer</h3>
    <textarea placeholder="Write a detailed answer..."></textarea>
    <div class="actions">
      <button class="submit-btn">Post Answer</button>
    </div>
  </div>
</template>

<style scoped>
.answer-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.title {
  color: #023e8a;
  margin-bottom: 1.5rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #9ce0ff;
  border-radius: 8px;
  min-height: 120px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.submit-btn {
  background: #29c8f0;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>
