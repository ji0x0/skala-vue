<script setup>
import { useConfigStore } from '@/stores/configStore.js'

// 과제 5에서 만든 단위 전환 부품.
// configStore의 unit state와 unitSymbol getter를 읽고 toggleUnit action을 호출한다.
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <div class="unit-label">
      <strong>온도 단위</strong>
      <small>{{ configStore.unitLabel }}</small>
    </div>
    <el-switch
      :model-value="configStore.unit === 'fahrenheit'"
      active-text="℉"
      inactive-text="℃"
      inline-prompt
      @change="configStore.toggleUnit"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.unit-label {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.unit-label small {
  color: var(--el-text-color-secondary);
}
</style>
