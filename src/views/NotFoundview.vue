<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-icon">☀️❓</div>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나 아직 개발되지 않았습니다.</p>
      <button class="home-button" @click="goHome">날씨 메인으로 이동</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  min-height: 50vh;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
}

.error-icon {
  margin-bottom: 20px;
  font-size: 5rem;
}

.home-button {
  padding: 12px 30px;
  border: 0;
  border-radius: 30px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
</style>
