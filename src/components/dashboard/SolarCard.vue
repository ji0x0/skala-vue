<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSolarStore } from '@/stores/solarStore.js'

const router = useRouter()
const solarStore = useSolarStore()

const formatNumber = (value) => new Intl.NumberFormat('ko-KR').format(Math.round(value))

/** 설비용량 대비 발전 효율을 막대 비율로 환산한다. */
const utilization = (item) => {
  const maxPossible = item.capacityKw * 5 * 0.8
  if (maxPossible === 0) return 0

  return Math.min(100, Math.round((item.generationToday / maxPossible) * 100))
}

const headline = computed(() => {
  if (!solarStore.bestSite) return '태양광 발전 여건을 계산하는 중입니다.'

  return `오늘은 ${solarStore.bestSite.siteName}의 발전 여건이 가장 좋습니다.`
})
</script>

<template>
  <el-card
    v-loading="solarStore.isLoading"
    class="briefing-card"
    shadow="hover"
    element-loading-text="일사량 데이터를 불러오는 중입니다..."
  >
    <template #header>
      <div class="card-header">
        <strong>☀️ 에너지 기회 — 오늘의 태양광 자가발전</strong>
        <el-tag type="success" size="small">
          {{ formatNumber(solarStore.totalGenerationToday) }} kWh
        </el-tag>
      </div>
    </template>

    <p v-if="solarStore.loadError" class="api-message error">{{ solarStore.loadError }}</p>

    <template v-else>
      <p class="headline">{{ headline }}</p>

      <div class="stat-row">
        <el-statistic
          title="오늘 예상 발전량"
          :value="solarStore.totalGenerationToday"
          suffix="kWh"
        />
        <el-statistic
          title="기대 전력비 절감"
          :value="Math.round(solarStore.expectedSavingToday / 10000)"
          suffix="만원"
        />
      </div>

      <div v-for="item in solarStore.solarList" :key="item.region" class="solar-row">
        <div class="solar-label">
          <strong>{{ item.siteName }}</strong>
          <small>{{ item.capacityKw }}kWp · 일조 {{ item.sunshineHours }}h</small>
        </div>
        <el-progress
          :percentage="utilization(item)"
          :stroke-width="14"
          :format="() => `${formatNumber(item.generationToday)}kWh`"
        />
        <el-button link type="primary" @click="router.push(`/solar/${item.region}`)">
          상세
        </el-button>
      </div>

      <small class="hint">
        발전량은 Open-Meteo 일사량 예보에 설비용량과 성능비(0.8)를 적용한 추정치입니다.
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
  color: #303133;
  font-weight: 600;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: #fdf6ec;
}

.solar-row {
  display: grid;
  grid-template-columns: 170px 1fr 56px;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
}

.solar-label {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.solar-label small {
  color: #909399;
}

.hint {
  display: block;
  margin-top: 10px;
  color: #909399;
}
</style>
