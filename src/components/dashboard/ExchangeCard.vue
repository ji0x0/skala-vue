<script setup>
import { useExchangeStore } from '@/stores/exchangeStore.js'

const exchangeStore = useExchangeStore()

const formatKrw = (value) =>
  new Intl.NumberFormat('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    value,
  )

const sparklinePoints = (list, range) => {
  if (list.length < 2) return ''

  const span = range.max - range.min || 1

  return list
    .map((item, index) => {
      const x = (index / (list.length - 1)) * 100
      const y = 30 - ((item.value - range.min) / span) * 26

      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
</script>

<template>
  <el-card
    v-loading="exchangeStore.isLoading"
    class="briefing-card"
    shadow="hover"
    element-loading-text="환율 데이터를 불러오는 중입니다..."
  >
    <template #header>
      <div class="card-header">
        <strong>💱 비용 변수 — 주요 통화 환율</strong>
        <el-tag :type="exchangeStore.changeRate > 0 ? 'danger' : 'success'" size="small">
          원/달러 {{ exchangeStore.changeRate > 0 ? '+' : '' }}{{ exchangeStore.changeRate }}%
        </el-tag>
      </div>
    </template>

    <p v-if="exchangeStore.loadError" class="api-message error">{{ exchangeStore.loadError }}</p>

    <template v-else>
      <p class="headline">{{ exchangeStore.costComment }}</p>

      <div class="rate-grid">
        <div v-for="item in exchangeStore.majorRates" :key="item.code" class="rate-item">
          <span class="rate-flag">{{ item.flag }}</span>
          <div class="rate-body">
            <small>{{ item.unit }} · {{ item.label }}</small>
            <strong>{{ formatKrw(item.krw) }}원</strong>
            <small class="rate-note">{{ item.note }}</small>
          </div>
        </div>
      </div>

      <div v-if="exchangeStore.history.length > 1" class="trend-box">
        <div class="trend-head">
          <span>원/달러 최근 30일 추이</span>
          <strong :class="{ up: exchangeStore.changeAmount > 0, down: exchangeStore.changeAmount < 0 }">
            30일 전 대비 {{ formatKrw(Math.abs(exchangeStore.changeAmount)) }}원
            {{ exchangeStore.changeAmount > 0 ? '증가' : exchangeStore.changeAmount < 0 ? '감소' : '변동 없음' }}
          </strong>
        </div>
        <svg class="sparkline" viewBox="0 0 100 32" preserveAspectRatio="none">
          <polyline
            :points="sparklinePoints(exchangeStore.history, exchangeStore.historyRange)"
          />
        </svg>
        <div class="trend-axis">
          <small>{{ exchangeStore.history[0].date }}</small>
          <small>{{ exchangeStore.history[exchangeStore.history.length - 1].date }}</small>
        </div>
      </div>

      <small class="hint">
        자료: Frankfurter · 유럽중앙은행 고시 기준 ({{ exchangeStore.baseDate }})
      </small>
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

.rate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.rate-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
}

.rate-flag {
  font-size: 20px;
}

.rate-body {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.rate-body strong {
  font-size: 15px;
}

.rate-note {
  color: var(--el-text-color-secondary);
}

.trend-box {
  padding: 12px;
  border-radius: 8px;
  background-color: var(--el-color-primary-light-9);
}

.trend-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 13px;
}

.trend-head .up {
  color: var(--el-color-danger);
}

.trend-head .down {
  color: var(--el-color-success);
}

.sparkline {
  width: 100%;
  height: 40px;
}

.sparkline polyline {
  fill: none;
  stroke: var(--el-color-primary);
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
}

.trend-axis {
  display: flex;
  justify-content: space-between;
  color: var(--el-text-color-secondary);
}

.hint {
  display: block;
  margin-top: 10px;
  color: var(--el-text-color-secondary);
}
</style>
