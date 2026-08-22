<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore.js'
import { useWeatherStore } from '@/stores/weatherStore.js'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const convertTemp = (temp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32)
  }

  return Math.round(temp * 10) / 10
}

/** 기온·습도 기준을 넘으면 공정 점검 대상으로 표시한다. */
const riskLevel = (item) => {
  if (item.temp >= weatherStore.tempThreshold && item.humidity >= weatherStore.humidityThreshold) {
    return { type: 'danger', label: '고온·다습' }
  }
  if (item.temp >= weatherStore.tempThreshold) return { type: 'warning', label: '고온' }
  if (item.humidity >= weatherStore.humidityThreshold) return { type: 'warning', label: '다습' }

  return { type: 'success', label: '정상' }
}

const headline = computed(() => {
  const { riskCount, count } = weatherStore.summary

  if (count === 0) return '사업장 환경 데이터를 불러오는 중입니다.'
  if (riskCount === 0) return '전 사업장 환경 조건이 정상 범위입니다.'

  return `${riskCount}개 사업장이 공정 점검 기준을 초과했습니다.`
})
</script>

<template>
  <el-card
    v-loading="weatherStore.isLoading"
    class="briefing-card"
    shadow="hover"
    element-loading-text="사업장 환경 데이터를 불러오는 중입니다..."
  >
    <template #header>
      <div class="card-header">
        <strong>🌡️ 환경 리스크 — 사업장별 기온·습도</strong>
        <el-tag :type="weatherStore.summary.riskCount > 0 ? 'warning' : 'success'" size="small">
          경보 {{ weatherStore.summary.riskCount }}곳
        </el-tag>
      </div>
    </template>

    <p v-if="weatherStore.loadError" class="api-message error">{{ weatherStore.loadError }}</p>

    <template v-else>
      <p class="headline">{{ headline }}</p>

      <div class="stat-row">
        <el-statistic
          title="평균 기온"
          :value="convertTemp(weatherStore.summary.avgTemp)"
          :precision="1"
          :suffix="configStore.unitSymbol"
        />
        <el-statistic title="평균 습도" :value="weatherStore.summary.avgHumidity" suffix="%" />
        <el-statistic title="관측 사업장" :value="weatherStore.summary.count" suffix="곳" />
      </div>

      <el-table
        :data="weatherStore.weatherList"
        size="small"
        style="width: 100%"
        @row-click="(row) => router.push(`/weather/${row.id}`)"
      >
        <el-table-column prop="siteName" label="사업장" min-width="130" />
        <el-table-column prop="process" label="공정" min-width="90" />
        <el-table-column label="기온" min-width="80">
          <template #default="{ row }">
            {{ convertTemp(row.temp) }}{{ configStore.unitSymbol }}
          </template>
        </el-table-column>
        <el-table-column prop="humidity" label="습도(%)" min-width="80" />
        <el-table-column label="상태" min-width="90">
          <template #default="{ row }">
            <el-tag :type="riskLevel(row).type" size="small">{{ riskLevel(row).label }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <small class="hint">행을 클릭하면 사업장 상세 기상 정보로 이동합니다.</small>
    </template>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.headline {
  margin: 0 0 14px;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
}

.hint {
  display: block;
  margin-top: 8px;
  color: var(--el-text-color-secondary);
}

:deep(.el-table__row) {
  cursor: pointer;
}
</style>
