<script setup>
// 1. 상위 컴포넌트로부터 주입받을 데이터의 자료형 및 필수 여부 정의
defineProps({
  parentData: {
    type: String,
    required: true,
  },
  parentNumberdata: {
    type: Number,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
  },
  fruitList: {
    type: Array,
    required: true,
  }
})

// 2. 상위 컴포넌트로 송신할 커스텀 이벤트 식별자 등록
const emit = defineEmits(['update-request', 'select-fruit'])

// 3. 내부 이벤트 발생 시 페이로드를 실어 상위로 이벤트를 디스패치하는 함수
const sendNotification = () => {
  const payload = {
    message: 'Child에서 가공한 새로운 데이터 입니다.',
    number: 987654321,
  }
  emit('update-request', payload)
}
const selectFruit = (fruit) => {
  emit('select-fruit', fruit)
}
</script>

<template>
  <div class="child-container">
    <h2>하위 컴포넌트 (Child)</h2>
    <p>
      수신된 Props 데이터: <strong>{{ parentData }} , {{ parentNumberdata }}</strong>
    </p>
    <p>
      수신된 user 데이터: <strong>{{ userData.id }} , {{ userData.pw }}</strong>
    </p>
    <p>수신된 fruit 데이터:</p>
      <ul>
        <li v-for="fruit in fruitList" :key="fruit.id">
          {{ fruit.name }} - {{ fruit.price }}원
        <button @click="selectFruit(fruit)">선택</button>
        </li>
      </ul>
    <br />
    <button @click="sendNotification">상위 컴포넌트로 갱신 요청 (Emit)</button>
  </div>
</template>

<style scoped>
.child-container {
  border: 2px dashed #3498db;
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
}
</style>
