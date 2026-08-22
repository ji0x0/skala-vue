<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSolarStore } from '@/stores/solarStore.js'
import { findSiteByRegion } from '@/data/sites.js'

const route = useRoute()
const router = useRouter()
const solarStore = useSolarStore()

const region = computed(() => route.params.region)
const site = computed(() => findSiteByRegion(region.value))
const solar = computed(() => solarStore.getSolarByRegion(region.value))
const actual = computed(() => solarStore.getActualByRegion(region.value))

const formatNumber = (value) => new Intl.NumberFormat('ko-KR').format(Math.round(value))

/** 낮 시간대만 잘라 시간별 일사량을 보여준다. */
const daylightHours = computed(() => {
  if (!solar.value) return []

  return solar.value.hourly
    .filter((item) => {
      const hour = Number(item.time.slice(11, 13))

      return hour >= 5 && hour <= 20
    })
    .map((item) => ({
      hour: `${Number(item.time.slice(11, 13))}시`,
      radiation: Math.round(item.radiation),
      cloudCover: item.cloudCover,
    }))
})

const maxRadiation = computed(() => {
  const values = daylightHours.value.map((item) => item.radiation)

  return values.length ? Math.max(...values, 1) : 1
})

const maxActual = computed(() => {
  const values = actual.value.map((item) => item.amount)

  return values.length ? Math.max(...values, 0.0001) : 1
})

const formatActualDate = computed(() => {
  const date = solarStore.actualDate

  if (!date || date.length !== 8) return ''

  return `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`
})

onMounted(() => {
  solarStore.fetchOneRegion(region.value)
  solarStore.fetchActual()
})
</script>

<template>
  <div v-loading="solarStore.isLoading" class="solar-detail">
    <el-page-header @back="router.push('/')">
      <template #content>
        <strong>☀️ {{ site ? site.siteName : '사업장' }} 태양광 상세</strong>
      </template>
    </el-page-header>

    <el-result
      v-if="!site"
      icon="warning"
      title="사업장을 찾을 수 없습니다"
      sub-title="주소의 지역 코드를 확인해 주세요."
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/')">브리핑으로 돌아가기</el-button>
      </template>
    </el-result>

    <template v-else>
      <p v-if="solarStore.loadError" class="api-message error">{{ solarStore.loadError }}</p>

      <el-card v-if="solar" class="summary-card" shadow="hover">
        <div class="stat-row">
          <el-statistic title="설비 용량" :value="solar.capacityKw" suffix="kWp" />
          <el-statistic
            title="오늘 일사량"
            :value="solar.radiationToday"
            :precision="2"
            suffix="kWh/m²"
          />
          <el-statistic
            title="예상 일조시간"
            :value="solar.sunshineHours"
            :precision="1"
            suffix="시간"
          />
          <el-statistic title="예상 발전량" :value="solar.generationToday" suffix="kWh" />
        </div>
        <el-divider />
        <p class="comment">
          오늘 예상 발전량 기준 약
          <strong>
            {{ formatNumber((solar.generationToday * solarStore.powerUnitPrice) / 10000) }}만원
          </strong>
          의 전력비 절감이 기대됩니다. (산업용 {{ solarStore.powerUnitPrice }}원/kWh 가정)
        </p>
      </el-card>

      <el-card v-if="daylightHours.length" class="chart-card" shadow="hover">
        <template #header>
          <strong>🔆 시간대별 일사량 예보 (Open-Meteo)</strong>
        </template>
        <div class="bar-chart">
          <div v-for="item in daylightHours" :key="item.hour" class="bar-column">
            <div class="bar-track">
              <div
                class="bar-fill forecast"
                :style="{ height: `${(item.radiation / maxRadiation) * 100}%` }"
              />
            </div>
            <small class="bar-value">{{ item.radiation }}</small>
            <small class="bar-label">{{ item.hour }}</small>
          </div>
        </div>
        <small class="hint">단위: W/m² · 막대가 높을수록 발전 여건이 좋습니다.</small>
      </el-card>

      <el-card v-if="actual.length" class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <strong>📈 지역 실측 발전량 (한국전력거래소)</strong>
            <el-tag size="small" type="info">{{ formatActualDate }} 기준</el-tag>
          </div>
        </template>
        <div class="bar-chart">
          <div v-for="item in actual" :key="item.hour" class="bar-column">
            <div class="bar-track">
              <div
                class="bar-fill actual"
                :style="{ height: `${(item.amount / maxActual) * 100}%` }"
              />
            </div>
            <small class="bar-label">{{ item.hour }}시</small>
          </div>
        </div>
        <small class="hint">
          같은 지역 전체 태양광 설비의 시간대별 실제 발전 실적(MWh)입니다.
          개발계정은 최신 데이터가 지연 제공되어 과거 일자 기준으로 표시됩니다.
        </small>
      </el-card>

      <p v-else-if="solarStore.actualError" class="api-message error">
        {{ solarStore.actualError }}
      </p>

      <div class="actions">
        <el-button type="primary" plain @click="router.push('/')">← 브리핑으로 돌아가기</el-button>
        <el-button v-if="site" @click="router.push(`/weather/${site.id}`)">
          이 사업장 기상 상세 보기
        </el-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.solar-detail {
  min-height: 260px;
}

.summary-card,
.chart-card {
  margin-top: 18px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 14px;
}

.comment {
  margin: 0;
  color: var(--el-text-color-regular);
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 190px;
  overflow-x: auto;
}

.bar-column {
  display: flex;
  align-items: center;
  flex: 1;
  flex-direction: column;
  min-width: 30px;
}

.bar-track {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 140px;
  border-radius: 4px;
  background-color: var(--el-fill-color-light);
}

.bar-fill {
  width: 100%;
  border-radius: 4px;
  transition: height 0.3s ease;
}

.bar-fill.forecast {
  background: linear-gradient(180deg, #ffd666, var(--el-color-warning));
}

.bar-fill.actual {
  background: linear-gradient(180deg, #79bbff, var(--el-color-primary));
}

.bar-value,
.bar-label {
  margin-top: 3px;
  color: var(--el-text-color-secondary);
  font-size: 10px;
  white-space: nowrap;
}

.hint {
  display: block;
  margin-top: 10px;
  color: var(--el-text-color-secondary);
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>
