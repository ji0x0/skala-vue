<script setup>
import { ref } from 'vue'
import PropsEmitsChild from '@/components/practices/Component/PropsemitsChild.vue'

// 1. 상위 컴포넌트의 로컬 반응형 상태 정의
const message = ref('Parent 초기 메시지')
const likes = ref(0)
const user = ref({
  id: "admin",
  pw: "1234",
})
const fruits = ref([
  { id: 1, name: '사과', price: 2000 },
  { id: 2, name: '바나나', price: 3000 },
  { id: 3, name: '딸기', price: 5000 },
])
const selectedFruit = ref(null)

// 2. 하위 컴포넌트의 커스텀 이벤트를 수신했을 때 실행될 핸들러 함수
// 인자(newValue)로 하위 컴포넌트가 보낸 페이로드가 자동 주입됩니다.
const handleUpdateRequest = (newValue) => {
  message.value = newValue.message
  likes.value = newValue.number
}
const handleSelectFruit = (fruit) => {
  selectedFruit.value = fruit
}
</script>

<template>
  <div class="practice-section">
    <h2>Props & Emits</h2>
    <div class="parent-container">
      <h2>상위 컴포넌트 (Parent)</h2>
      <p>
        현재 로컬 데이터(State): <strong>{{ message }}</strong>
      </p>
      <br />
      <PropsEmitsChild
      :parent-data="message"
      :parent-numberdata="likes"
      :user-data="user"
      :fruit-list="fruits"
      @update-request="handleUpdateRequest"
      @select-fruit="handleSelectFruit" />
    </div>
    <div class="practice-section">
      <h2>과일 선택 실습</h2>

      <p v-if="selectedFruit">
        부모가 받은 과일: {{ selectedFruit.name }}는 {{ selectedFruit.price }}원 입니다
      </p>

      <p v-else>아직 선택한 과일이 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.parent-container {
  border: 2px solid #2ecc71;
  padding: 20px;
  background-color: #f8f9fa;
  margin: 0 auto;
  border-radius: 8px;
}
</style>
