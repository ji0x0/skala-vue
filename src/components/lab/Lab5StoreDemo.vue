<script setup>
import { computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useSolarStore } from '@/stores/solarStore.js'
import { useFuelStore } from '@/stores/fuelStore.js'
import { useExchangeStore } from '@/stores/exchangeStore.js'

const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const solarStore = useSolarStore()
const fuelStore = useFuelStore()
const exchangeStore = useExchangeStore()

/** 단위 변환을 눈으로 확인할 샘플 기온 */
const sampleTemp = ref(25)

const convertedTemp = computed(() => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((sampleTemp.value * 9) / 5 + 32)
  }

  return sampleTemp.value
})

/** 각 Store가 지금 어떤 데이터를 들고 있는지 요약한다. */
const storeStates = computed(() => [
  {
    name: 'configStore',
    role: '단위·테마 설정 (과제 5 기본 요구사항)',
    state: `unit: '${configStore.unit}' / theme: '${configStore.theme}'`,
    getter: `unitSymbol: '${configStore.unitSymbol}' / isDark: ${configStore.isDark}`,
    loaded: true,
  },
  {
    name: 'weatherStore',
    role: '사업장 날씨와 공정 위험 요약',
    state: `weatherList: ${weatherStore.weatherList.length}건`,
    getter: `summary.riskCount: ${weatherStore.summary.riskCount}`,
    loaded: weatherStore.weatherList.length > 0,
  },
  {
    name: 'solarStore',
    role: '일사량 예측과 실측 발전량',
    state: `solarList: ${solarStore.solarList.length}건 / actualList: ${solarStore.actualList.length}건`,
    getter: `totalGenerationToday: ${solarStore.totalGenerationToday}kWh`,
    loaded: solarStore.solarList.length > 0,
  },
  {
    name: 'fuelStore',
    role: '전국·지역 유가',
    state: `nationalPrices: ${fuelStore.nationalPrices.length}건`,
    getter: `dieselPrice: ${fuelStore.dieselPrice}원`,
    loaded: fuelStore.nationalPrices.length > 0,
  },
  {
    name: 'exchangeStore',
    role: '주요 통화 환율',
    state: `history: ${exchangeStore.history.length}건`,
    getter: `usdKrw: ${Math.round(exchangeStore.usdKrw)}원`,
    loaded: exchangeStore.history.length > 0,
  },
])

const loadAll = () => {
  weatherStore.fetchAllSites()
  solarStore.fetchAllSites()
  fuelStore.fetchFuelPrices()
  exchangeStore.fetchRates()
}
</script>

<template>
  <div class="store-demo">
    <el-alert type="info" :closable="false" class="intro">
      Store는 컴포넌트 밖에 있는 전역 상태입니다. 아래 값은 이 화면이 직접 가진 데이터가 아니라
      브리핑 화면과 <strong>같은 Store 인스턴스</strong>를 그대로 읽은 것입니다.
      상단 내비게이션의 설정 변경 버튼을 눌러도 아래 값이 함께 바뀝니다.
    </el-alert>

    <h4>단위 설정 Store 동작 확인</h4>
    <div class="unit-box">
      <div class="unit-line">
        <span>샘플 기온</span>
        <el-input-number v-model="sampleTemp" size="small" :min="-30" :max="50" />
        <span>℃ (원본 데이터)</span>
      </div>

      <el-divider direction="vertical" />

      <div class="unit-result">
        <small>화면 표시값</small>
        <strong>{{ convertedTemp }}{{ configStore.unitSymbol }}</strong>
      </div>

      <el-button type="primary" size="small" @click="configStore.toggleUnit">
        toggleUnit() 실행
      </el-button>
    </div>

    <p class="note">
      현재 state는 <code>unit: '{{ configStore.unit }}'</code>,
      getter는 <code>unitSymbol: '{{ configStore.unitSymbol }}'</code> 입니다.
      섭씨일 때는 원본을 그대로, 화씨일 때는 <code>(원본 × 9 / 5) + 32</code>로 변환합니다.
    </p>

    <h4>이 앱에 등록된 Store 5종</h4>
    <el-table :data="storeStates" size="small" style="width: 100%">
      <el-table-column prop="name" label="Store" min-width="115" />
      <el-table-column prop="role" label="역할" min-width="180" />
      <el-table-column prop="state" label="현재 state" min-width="170" />
      <el-table-column prop="getter" label="getter 값" min-width="150" />
      <el-table-column label="상태" min-width="80">
        <template #default="{ row }">
          <el-tag :type="row.loaded ? 'success' : 'info'" size="small">
            {{ row.loaded ? '로드됨' : '비어 있음' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="actions">
      <el-button size="small" type="primary" plain @click="loadAll">
        모든 Store의 action 실행
      </el-button>
      <small>
        브리핑 화면을 이미 방문했다면 데이터가 남아 있습니다. Store가 화면 밖에서 상태를 유지하기 때문입니다.
      </small>
    </div>
  </div>
</template>

<style scoped>
.intro {
  margin-bottom: 16px;
}

h4 {
  margin: 20px 0 8px;
  padding-left: 8px;
  border-left: 3px solid var(--el-color-primary);
  font-size: 14px;
}

h4:first-of-type {
  margin-top: 0;
}

.unit-box {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
}

.unit-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit-result {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.unit-result small {
  color: var(--el-text-color-secondary);
}

.unit-result strong {
  font-size: 20px;
  color: var(--el-color-primary);
}

.note {
  margin: 10px 0 0;
  color: var(--el-text-color-regular);
  line-height: 1.7;
}

code {
  padding: 1px 5px;
  border-radius: 4px;
  background-color: var(--el-fill-color-light);
  font-size: 12px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.actions small {
  color: var(--el-text-color-secondary);
}
</style>
