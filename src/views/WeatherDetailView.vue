<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore.js'
import { findSiteById } from '@/data/sites.js'
import { fetchAirQuality, fetchCurrentWeather, fetchForecast } from '@/services/weatherApi.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const forecastList = ref([])
const airQuality = ref(null)
const isLoading = ref(false)
const loadError = ref('')

const site = computed(() => findSiteById(route.params.cityId))

const convertTemp = (temp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32)
  }

  return Math.round(temp * 10) / 10
}

const displayTemp = computed(() => (cityData.value ? convertTemp(cityData.value.temp) : 0))

/** 공정 관점에서 지금 무엇을 신경 써야 하는지 알려준다. */
const processAdvice = computed(() => {
  if (!cityData.value) return []

  const advice = []
  const { temp, humidity, wind } = cityData.value

  if (temp >= 30) advice.push('고온 구간입니다. 설비 과열과 작업자 온열질환에 유의하세요.')
  if (temp <= 0) advice.push('영하 구간입니다. 배관 동결과 저온 취성에 유의하세요.')
  if (humidity >= 80) advice.push('다습 구간입니다. 도장·건조 공정 품질과 결로를 점검하세요.')
  if (humidity <= 30) advice.push('건조 구간입니다. 정전기와 분진 관리를 강화하세요.')
  if (wind >= 10) advice.push('강풍입니다. 옥외 자재 적치와 크레인 작업을 점검하세요.')
  if (advice.length === 0) advice.push('현재 환경 조건은 정상 범위입니다.')

  return advice
})

/** 대기질 지수 등급 */
const aqiLevel = computed(() => {
  if (!airQuality.value) return { type: 'info', label: '측정 중' }

  const aqi = airQuality.value.european_aqi

  if (aqi <= 20) return { type: 'success', label: '좋음' }
  if (aqi <= 40) return { type: 'success', label: '양호' }
  if (aqi <= 60) return { type: 'warning', label: '보통' }
  if (aqi <= 80) return { type: 'warning', label: '나쁨' }

  return { type: 'danger', label: '매우 나쁨' }
})

const formatForecastTime = (dateTime) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
  }).format(new Date(dateTime.replace(' ', 'T')))

onMounted(async () => {
  if (!site.value) {
    loadError.value = '해당 사업장 정보를 찾을 수 없습니다.'
    return
  }

  isLoading.value = true
  loadError.value = ''

  try {
    // 예보와 대기질 조회에는 좌표가 필요하므로 현재 날씨를 먼저 기다린다.
    const response = await fetchCurrentWeather(site.value.query)
    const raw = response.data

    cityData.value = {
      city: site.value.city,
      temp: raw.main.temp,
      feelsLike: raw.main.feels_like,
      condition: raw.weather[0].description,
      icon: raw.weather[0].icon,
      humidity: raw.main.humidity,
      wind: raw.wind.speed,
      pressure: raw.main.pressure,
    }

    // 서로 독립적인 두 요청만 병렬로 처리한다.
    const [forecastResponse, airQualityResponse] = await Promise.all([
      fetchForecast(raw.coord.lat, raw.coord.lon),
      fetchAirQuality(raw.coord.lat, raw.coord.lon),
    ])

    forecastList.value = forecastResponse.data.list.slice(0, 8).map((item) => ({
      time: item.dt_txt,
      temp: item.main.temp,
      condition: item.weather[0].description,
      icon: item.weather[0].icon,
    }))

    airQuality.value = airQualityResponse.data.current
  } catch (error) {
    console.error('상세 날씨 API 연동 실패:', error)
    loadError.value = '상세 날씨 데이터를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div
    v-loading="isLoading"
    class="detail-container"
    element-loading-text="상세 기상 정보를 불러오는 중입니다..."
  >
    <el-page-header @back="router.push('/')">
      <template #content>
        <strong>📊 {{ site ? site.siteName : '사업장' }} 기상 상세</strong>
      </template>
    </el-page-header>

    <el-result
      v-if="!site"
      icon="warning"
      title="사업장을 찾을 수 없습니다"
      sub-title="주소의 사업장 코드를 확인해 주세요."
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/')">브리핑으로 돌아가기</el-button>
      </template>
    </el-result>

    <template v-else>
      <p v-if="loadError" class="api-message error">{{ loadError }}</p>

      <el-card v-if="cityData" class="info-card" shadow="hover">
        <div class="current-head">
          <img
            :src="`https://openweathermap.org/img/wn/${cityData.icon}@2x.png`"
            :alt="cityData.condition"
          />
          <div>
            <h3>{{ displayTemp }}{{ configStore.unitSymbol }}</h3>
            <p>{{ cityData.condition }} · {{ site.city }} · {{ site.process }} 공정</p>
          </div>
        </div>

        <el-divider />

        <div class="stat-row">
          <el-statistic
            title="체감 기온"
            :value="convertTemp(cityData.feelsLike)"
            :precision="1"
            :suffix="configStore.unitSymbol"
          />
          <el-statistic title="대기 습도" :value="cityData.humidity" suffix="%" />
          <el-statistic title="현재 풍속" :value="cityData.wind" :precision="1" suffix="m/s" />
          <el-statistic title="기압" :value="cityData.pressure" suffix="hPa" />
        </div>
      </el-card>

      <el-card v-if="cityData" class="advice-card" shadow="hover">
        <template #header><strong>🧭 공정 운영 참고사항</strong></template>
        <ul class="advice-list">
          <li v-for="(item, index) in processAdvice" :key="index">{{ item }}</li>
        </ul>
      </el-card>

      <section v-if="forecastList.length" class="forecast-section">
        <h3>🗓️ 단기 예보 (OpenWeather 3시간 간격)</h3>
        <div class="forecast-list">
          <el-card v-for="forecast in forecastList" :key="forecast.time" shadow="hover">
            <strong>{{ formatForecastTime(forecast.time) }}</strong>
            <img
              :src="`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`"
              :alt="forecast.condition"
            />
            <span>{{ convertTemp(forecast.temp) }}{{ configStore.unitSymbol }}</span>
            <small>{{ forecast.condition }}</small>
          </el-card>
        </div>
      </section>

      <el-card v-if="airQuality" class="air-quality-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <strong>🌿 실시간 대기질 (Open-Meteo / CAMS)</strong>
            <el-tag :type="aqiLevel.type" size="small">{{ aqiLevel.label }}</el-tag>
          </div>
        </template>
        <div class="stat-row">
          <el-statistic title="유럽 대기질 지수" :value="airQuality.european_aqi" />
          <el-statistic title="미세먼지 PM10" :value="airQuality.pm10" suffix="㎍/㎥" />
          <el-statistic title="초미세먼지 PM2.5" :value="airQuality.pm2_5" suffix="㎍/㎥" />
        </div>
        <small class="hint">클린룸·도장 공정은 외기 유입 필터 관리에 참고하세요.</small>
      </el-card>

      <div class="actions">
        <el-button type="primary" plain @click="router.push('/')">← 브리핑으로 돌아가기</el-button>
        <el-button @click="router.push(`/solar/${site.region}`)">
          이 사업장 태양광 발전 보기
        </el-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-container {
  min-height: 260px;
}

.info-card,
.advice-card,
.forecast-section,
.air-quality-card {
  margin-top: 18px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.current-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-head img {
  width: 72px;
  height: 72px;
}

.current-head h3 {
  margin: 0;
  font-size: 30px;
}

.current-head p {
  margin: 2px 0 0;
  color: var(--el-text-color-secondary);
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 14px;
}

.advice-list {
  margin: 0;
  padding-left: 18px;
  line-height: 1.8;
}

.forecast-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
}

/* el-card 내부 요소는 scoped 범위를 넘어가므로 :deep()으로 선택한다. */
.forecast-list :deep(.el-card__body) {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  text-align: center;
}

.forecast-list img {
  width: 64px;
  height: 64px;
}

.forecast-list small {
  color: var(--el-text-color-regular);
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
