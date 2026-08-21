<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore.js'
import { fetchAirQuality, fetchCurrentWeather, fetchForecast } from '@/services/weatherApi.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const forecastList = ref([])
const airQuality = ref(null)
const isLoading = ref(false)
const loadError = ref('')

const cityMapping = {
  city_01: { query: 'Seoul,KR', city: '서울' },
  city_02: { query: 'Busan,KR', city: '부산' },
  city_03: { query: 'Daegu,KR', city: '대구' },
  city_04: { query: 'Gwangju,KR', city: '광주' },
  city_05: { query: 'Daejeon,KR', city: '대전' },
  city_06: { query: 'Ulsan,KR', city: '울산' },
}

onMounted(async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id]

  if (!targetCity) {
    loadError.value = '해당 도시 정보를 찾을 수 없습니다.'
    return
  }

  isLoading.value = true
  loadError.value = ''

  try {
    const response = await fetchCurrentWeather(targetCity.query)

    const raw = response.data
    cityData.value = {
      city: targetCity.city,
      temp: raw.main.temp,
      condition: raw.weather[0].description,
      humidity: raw.main.humidity,
      wind: raw.wind.speed,
    }

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

const displayTemp = computed(() => {
  if (!cityData.value) return 0

  const rawTemp = cityData.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

const convertTemp = (temp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32)
  }

  return Math.round(temp)
}

const formatForecastTime = (dateTime) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
  }).format(new Date(dateTime.replace(' ', 'T')))
</script>

<template>
  <div
    v-loading="isLoading"
    class="detail-container"
    element-loading-text="상세 날씨를 불러오는 중입니다..."
  >
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />

    <p v-if="isLoading" class="api-message">상세 날씨 데이터를 불러오는 중입니다...</p>
    <p v-else-if="loadError" class="api-message error">{{ loadError }}</p>

    <el-card v-else-if="cityData" class="info-card" shadow="hover">
      <h4>📍 지정 지역: {{ cityData.city }}</h4>
      <p>
        실시간 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
      </p>
      <p>기상 현황: {{ cityData.condition }}</p>
      <p>대기 습도: {{ cityData.humidity }}%</p>
      <p>현재 풍속: {{ cityData.wind }}m/s</p>
    </el-card>

    <section v-if="forecastList.length" class="forecast-section">
      <h3>🗓️ OpenWeather 단기 예보</h3>
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
      <template #header><strong>🌿 Open-Meteo 실시간 대기질</strong></template>
      <p>유럽 대기질 지수: {{ airQuality.european_aqi }}</p>
      <p>미세먼지(PM10): {{ airQuality.pm10 }}㎍/㎥</p>
      <p>초미세먼지(PM2.5): {{ airQuality.pm2_5 }}㎍/㎥</p>
      <small>대기질 데이터 제공: Open-Meteo / CAMS</small>
    </el-card>

    <el-button type="primary" plain @click="router.push('/')">
      ← 메인 대시보드로 돌아가기
    </el-button>
  </div>
</template>
