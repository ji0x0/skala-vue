<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="about-container">
    <h3>ℹ️ 서비스 소개</h3>
    <hr />

    <div class="description-box">
      <p>
        본 앱은 <strong>Vue 3</strong> 및 <strong>Vue Router</strong>를 기반으로 제작한
        실습용 기상 관측 대시보드입니다.
      </p>
      <ul>
        <li>독립적인 날씨 컴포넌트 연동</li>
        <li>클라이언트 사이드 라우팅을 통한 화면 전환</li>
        <li>URL 쿼리 스트링을 활용한 검색 상태 동기화</li>
      </ul>
    </div>

    <button class="home-btn" @click="handleGoHome">대시보드 홈으로 이동</button>
  </div>
</template>

<style scoped>
.description-box {
  padding: 12px;
  border-radius: 6px;
  background-color: #f8f9fa;
  line-height: 1.5;
}

.home-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  border: 0;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>
