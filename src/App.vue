<script setup>
import NavBar from '@/components/common/NavBar.vue'
</script>

<template>
  <div class="app-container">
    <NavBar />

    <main>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <footer class="app-footer">
      <small>
        제조현장 데일리 운영 브리핑 · SKALA Vue.js 실습 프로젝트 ·
        자료 제공: OpenWeather, Open-Meteo, 한국전력거래소, 오피넷, Frankfurter
      </small>
    </footer>
  </div>
</template>

<style>
@import '@/assets/WeatherStyle.css';
</style>

<style scoped>
.app-footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
  color: #909399;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
