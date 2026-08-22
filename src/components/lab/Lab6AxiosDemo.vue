<script setup>
import { ref } from 'vue'
import { fetchAirQuality, fetchCurrentWeather, fetchForecast } from '@/services/weatherApi.js'
import { fetchNationalPvActual, fetchSolarForecast } from '@/services/solarApi.js'
import { fetchNationalFuelPrice } from '@/services/fuelApi.js'
import { fetchLatestRates } from '@/services/exchangeApi.js'

/** 서울 좌표. 좌표 기반 API 시연에 사용한다. */
const SEOUL = { lat: 37.5665, lon: 126.978 }

const API_LIST = [
  {
    id: 'weather',
    label: 'OpenWeather 현재 날씨',
    needsKey: true,
    call: () => fetchCurrentWeather('Seoul,KR'),
  },
  {
    id: 'forecast',
    label: 'OpenWeather 단기 예보',
    needsKey: true,
    call: () => fetchForecast(SEOUL.lat, SEOUL.lon),
  },
  {
    id: 'air',
    label: 'Open-Meteo 대기질',
    needsKey: false,
    call: () => fetchAirQuality(SEOUL.lat, SEOUL.lon),
  },
  {
    id: 'solar',
    label: 'Open-Meteo 일사량',
    needsKey: false,
    call: () => fetchSolarForecast(SEOUL.lat, SEOUL.lon),
  },
  {
    id: 'kpx',
    label: '전력거래소 태양광 실측',
    needsKey: true,
    call: () => fetchNationalPvActual(),
  },
  {
    id: 'fuel',
    label: '오피넷 유가 (프록시 경유)',
    needsKey: true,
    call: () => fetchNationalFuelPrice(),
  },
  {
    id: 'rate',
    label: 'Frankfurter 환율',
    needsKey: false,
    call: () => fetchLatestRates(),
  },
]

const selectedId = ref('weather')
const isLoading = ref(false)
const result = ref(null)
const errorMessage = ref('')

const run = async () => {
  const target = API_LIST.find((api) => api.id === selectedId.value)
  if (!target) return

  isLoading.value = true
  result.value = null
  errorMessage.value = ''

  const startedAt = performance.now()

  try {
    const response = await target.call()

    result.value = {
      status: response.status,
      elapsed: Math.round(performance.now() - startedAt),
      // 응답이 큰 API가 있어 앞부분만 잘라서 보여준다.
      body: JSON.stringify(response.data, null, 2).slice(0, 1200),
    }
  } catch (error) {
    errorMessage.value = `${error.message} (status: ${error.response?.status ?? '없음'})`
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="axios-demo">
    <el-alert type="info" :closable="false" class="intro">
      아래 버튼은 실제로 외부 API를 호출합니다. 응답 상태 코드와 소요 시간, 원본 JSON을 그대로 보여줍니다.
      로딩·성공·오류 세 가지 상태를 화면에서 확인할 수 있습니다.
    </el-alert>

    <h4>호출할 API 선택</h4>
    <el-radio-group v-model="selectedId" size="small" class="api-group">
      <el-radio-button v-for="api in API_LIST" :key="api.id" :value="api.id">
        {{ api.label }}
      </el-radio-button>
    </el-radio-group>

    <div class="run-row">
      <el-button type="primary" size="small" :loading="isLoading" @click="run">
        요청 보내기
      </el-button>
      <el-tag
        v-if="API_LIST.find((api) => api.id === selectedId)?.needsKey"
        size="small"
        type="warning"
      >
        API 키 필요
      </el-tag>
      <el-tag v-else size="small" type="success">키 불필요</el-tag>
    </div>

    <el-alert v-if="errorMessage" type="error" :closable="false" class="result-alert">
      요청 실패: {{ errorMessage }}
    </el-alert>

    <div v-else-if="isLoading" class="loading-box">응답을 기다리는 중입니다...</div>

    <div v-else-if="result" class="result-box">
      <div class="result-head">
        <el-tag type="success" size="small">HTTP {{ result.status }}</el-tag>
        <el-tag type="info" size="small">{{ result.elapsed }}ms</el-tag>
        <small>응답 앞부분만 표시합니다.</small>
      </div>
      <pre><code>{{ result.body }}</code></pre>
    </div>

    <p class="note">
      화면 코드에서 <code>axios</code>를 직접 부르지 않고
      <code>src/services/</code> 의 함수를 호출합니다. 통신 코드와 화면 코드를 나누면
      같은 요청을 여러 화면에서 재사용할 수 있고, 파라미터가 바뀔 때 한 곳만 고치면 됩니다.
    </p>
  </div>
</template>

<style scoped>
.intro {
  margin-bottom: 16px;
}

h4 {
  margin: 0 0 8px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
  font-size: 14px;
}

.api-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.api-group :deep(.el-radio-button__inner) {
  border-radius: 4px;
  border-left: 1px solid #dcdfe6;
}

.run-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0;
}

.result-alert,
.loading-box,
.result-box {
  margin-top: 12px;
}

.loading-box {
  padding: 20px;
  border-radius: 8px;
  background-color: #f5f7fa;
  color: #409eff;
  text-align: center;
  font-weight: 600;
}

.result-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.result-head small {
  color: #909399;
}

pre {
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background-color: #f5f7fa;
  max-height: 300px;
  overflow: auto;
  font-size: 11px;
  line-height: 1.5;
}

.note {
  margin: 16px 0 0;
  color: #606266;
  line-height: 1.7;
}

code {
  padding: 1px 5px;
  border-radius: 4px;
  background-color: #f5f7fa;
  font-size: 12px;
}

pre code {
  padding: 0;
  background: none;
}
</style>
