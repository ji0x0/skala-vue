<script setup>
import UnitToggler from '@/components/exercise/UnitToggler.vue'
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

      <!-- 단위 전환은 과제 5에서 만든 UnitToggler 부품을 그대로 쓴다. -->
      <UnitToggler />
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
