<script setup>
import { useFuelStore } from '@/stores/fuelStore.js'

const fuelStore = useFuelStore()

const formatPrice = (value) => new Intl.NumberFormat('ko-KR').format(Math.round(value))

const formatDate = (yyyymmdd) => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return ''

  return `${yyyymmdd.slice(4, 6)}.${yyyymmdd.slice(6, 8)}`
}

/** 스파크라인 폴리라인 좌표를 만든다. */
const sparklinePoints = (list, range) => {
  if (list.length < 2) return ''

  const span = range.max - range.min || 1

  return list
    .map((item, index) => {
      const x = (index / (list.length - 1)) * 100
      const y = 30 - ((item.price - range.min) / span) * 26

      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
</script>

<template>
  <el-card
    v-loading="fuelStore.isLoading"
    class="briefing-card"
    shadow="hover"
    element-loading-text="유가 데이터를 불러오는 중입니다..."
  >
    <template #header>
      <div class="card-header">
        <strong>⛽ 비용 변수 — 전국 평균 유가</strong>
        <el-tag :type="fuelStore.dieselDiff > 0 ? 'danger' : 'success'" size="small">
          경유 {{ fuelStore.dieselDiff > 0 ? '▲' : '▼' }} {{ Math.abs(fuelStore.dieselDiff) }}원
        </el-tag>
      </div>
    </template>

    <p v-if="fuelStore.loadError" class="api-message error">{{ fuelStore.loadError }}</p>

    <template v-else>
      <p class="headline">{{ fuelStore.costComment }}</p>

      <div class="price-grid">
        <div v-for="item in fuelStore.nationalPrices" :key="item.code" class="price-item">
          <span class="price-icon">{{ item.icon }}</span>
          <div class="price-body">
            <small>{{ item.name }}</small>
            <strong>{{ formatPrice(item.price) }}원</strong>
            <small class="price-use">{{ item.use }}</small>
          </div>
        </div>
      </div>

      <div v-if="fuelStore.trend.length > 1" class="trend-box">
        <div class="trend-head">
          <span>자동차용 경유 최근 추이</span>
          <strong :class="fuelStore.trendChangeRate > 0 ? 'up' : 'down'">
            {{ fuelStore.trendChangeRate > 0 ? '+' : '' }}{{ fuelStore.trendChangeRate }}%
          </strong>
        </div>
        <svg class="sparkline" viewBox="0 0 100 32" preserveAspectRatio="none">
          <polyline :points="sparklinePoints(fuelStore.trend, fuelStore.trendRange)" />
        </svg>
        <div class="trend-axis">
          <small>{{ formatDate(fuelStore.trend[0].date) }}</small>
          <small>{{ formatDate(fuelStore.trend[fuelStore.trend.length - 1].date) }}</small>
        </div>
      </div>

      <small class="hint">자료: 한국석유공사 오피넷 · 전국 주유소 평균 판매가</small>
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
  color: #303133;
  font-weight: 600;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.price-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: #f5f7fa;
}

.price-icon {
  font-size: 20px;
}

.price-body {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.price-body strong {
  font-size: 15px;
}

.price-use {
  color: #909399;
}

.trend-box {
  padding: 12px;
  border-radius: 8px;
  background-color: #fef0f0;
}

.trend-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 13px;
}

.trend-head .up {
  color: #f56c6c;
}

.trend-head .down {
  color: #67c23a;
}

.sparkline {
  width: 100%;
  height: 40px;
}

.sparkline polyline {
  fill: none;
  stroke: #e6a23c;
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
}

.trend-axis {
  display: flex;
  justify-content: space-between;
  color: #909399;
}

.hint {
  display: block;
  margin-top: 10px;
  color: #909399;
}
</style>
