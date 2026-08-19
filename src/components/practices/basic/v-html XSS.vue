<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const message = ref('')

function showMessage() {
message.value = inputValue.value
}
</script>

<template>
    <div class="practice-section">
        <h2>v-html XSS 학습</h2>
        <input v-model="inputValue" placeholder="내용을 입력하세요" />
        <button @click="showMessage">확인</button>
        <div v-html="message"></div>
    </div>
<!-- v<img src="x" onerror="window.location.href='https://google.com'" /> 을 입력 후 클릭하면 다른 사이트로 이동한다.-->
</template>

