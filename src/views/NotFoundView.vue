<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <el-result
    icon="warning"
    title="404 — 페이지를 찾을 수 없습니다"
    sub-title="요청하신 주소가 존재하지 않거나 아직 준비되지 않은 화면입니다."
  >
    <template #extra>
      <div class="actions">
        <el-button type="primary" @click="router.push('/')">브리핑 화면으로 이동</el-button>
        <el-button @click="router.back()">이전 화면으로</el-button>
      </div>
    </template>
  </el-result>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
