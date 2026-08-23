<script setup>
import { computed, onMounted, watch } from 'vue'
import WeatherSummaryCard from '@/components/dashboard/WeatherSummaryCard.vue'
import SolarCard from '@/components/dashboard/SolarCard.vue'
import FuelPriceCard from '@/components/dashboard/FuelPriceCard.vue'
import ExchangeCard from '@/components/dashboard/ExchangeCard.vue'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useSolarStore } from '@/stores/solarStore.js'
import { useFuelStore } from '@/stores/fuelStore.js'
import { useExchangeStore } from '@/stores/exchangeStore.js'

const weatherStore = useWeatherStore()
const solarStore = useSolarStore()
const fuelStore = useFuelStore()
const exchangeStore = useExchangeStore()

const today = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

/** 세 가지 지표를 한 문장으로 요약한 오늘의 브리핑 */
const briefingLines = computed(() => {
  const lines = []

  if (weatherStore.summary.count > 0) {
    lines.push(
      weatherStore.summary.riskCount > 0
        ? `공정 점검이 필요한 사업장이 ${weatherStore.summary.riskCount}곳 있습니다.`
        : '전 사업장 환경 조건이 정상 범위입니다.',
    )
  }

  if (solarStore.bestSite) {
    lines.push(
      `오늘 태양광 예상 발전량은 ${new Intl.NumberFormat('ko-KR').format(
        solarStore.totalGenerationToday,
      )}kWh입니다.`,
    )
  }

  if (fuelStore.trend.length > 1) {
    lines.push(fuelStore.costComment)
  }

  if (exchangeStore.history.length > 1) {
    lines.push(exchangeStore.costComment)
  }

  return lines
})

const isAnyLoading = computed(
  () =>
    weatherStore.isLoading ||
    solarStore.isLoading ||
    fuelStore.isLoading ||
    exchangeStore.isLoading,
)

const refreshAll = () => {
  weatherStore.fetchAllSites()
  solarStore.fetchAllSites({ force: true })
  fuelStore.fetchFuelPrices()
  exchangeStore.fetchRates()
}

const loadAll = () => {
  weatherStore.fetchAllSites()
  solarStore.fetchAllSites()
  fuelStore.fetchFuelPrices()
  exchangeStore.fetchRates()
}

watch(
  () => weatherStore.summary.riskCount,
  (newCount, oldCount) => {
    console.log(`[브리핑] 공정 점검 대상 사업장 ${oldCount}곳 -> ${newCount}곳`)
  },
)

onMounted(loadAll)
</script>

<template>
  <div class="briefing-view">
    <section class="briefing-head">
      <div>
        <h2>오늘의 운영 브리핑</h2>
        <small>{{ today }}</small>
      </div>
      <el-button type="primary" plain :loading="isAnyLoading" @click="refreshAll">
        새로고침
      </el-button>
    </section>

    <el-alert v-if="briefingLines.length" type="info" :closable="false" class="briefing-alert">
      <ul class="briefing-list">
        <li v-for="line in briefingLines" :key="line">{{ line }}</li>
      </ul>
    </el-alert>

    <div class="briefing-grid">
      <WeatherSummaryCard class="span-2" />
      <SolarCard class="span-2" />
      <FuelPriceCard />
      <ExchangeCard />
    </div>
  </div>
</template>

<style scoped>
.briefing-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.briefing-head h2 {
  margin: 0 0 2px;
  /* 라이트 모드에서는 검정에 가깝게, 다크 모드에서는 밝은 글자색을 쓴다. */
  color: #1a1a1a;
  font-weight: 700;
}

html.dark .briefing-head h2 {
  color: var(--el-text-color-primary);
}

.briefing-head small {
  color: var(--el-text-color-secondary);
}

.briefing-alert {
  margin-bottom: 20px;
}

.briefing-list {
  margin: 0;
  padding-left: 18px;
  color: #1a1a1a;
  line-height: 1.7;
}

html.dark .briefing-list {
  color: var(--el-text-color-primary);
}

.briefing-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.span-2 {
  grid-column: span 2;
}

@media (max-width: 820px) {
  .briefing-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .span-2 {
    grid-column: span 1;
  }
}
</style>
