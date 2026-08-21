<template>
  <el-card class="base-dashboard-card" shadow="hover">
    <slot></slot>
  </el-card>
</template>

<style scoped>
/* 검색 박스와 리스트 박스의 공통 카드 디자인 */
.base-dashboard-card {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #dddddd;
  border-radius: 10px;
  background-color: #f8f9fa;
}
</style>
