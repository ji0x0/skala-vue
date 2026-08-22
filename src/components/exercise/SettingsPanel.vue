<script setup>
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <el-popover placement="bottom-end" trigger="click" :width="270">
    <template #reference>
      <el-button class="settings-trigger" size="small" text bg>⚙️ 설정 변경</el-button>
    </template>

    <div class="settings-panel">
      <h4>화면 설정</h4>

      <div class="setting-row">
        <div class="setting-label">
          <strong>화면 테마</strong>
          <small>{{ configStore.themeLabel }}</small>
        </div>
        <el-switch
          :model-value="configStore.isDark"
          active-text="다크"
          inactive-text="라이트"
          inline-prompt
          @change="configStore.toggleTheme"
        />
      </div>

      <el-divider />

      <div class="setting-row">
        <div class="setting-label">
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
    </div>
  </el-popover>
</template>

<style scoped>
.settings-trigger {
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.settings-panel h4 {
  margin: 0 0 12px;
  font-size: 14px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.setting-label {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.setting-label small {
  color: var(--el-text-color-secondary);
}

.settings-panel :deep(.el-divider) {
  margin: 12px 0;
}
</style>
