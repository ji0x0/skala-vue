import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SITES } from '@/data/sites.js'
import { fetchCurrentWeather } from '@/services/weatherApi.js'

/**
 * 사업장별 실시간 날씨를 보관하는 Store.
 * 여러 화면이 같은 날씨 데이터를 쓰기 때문에 컴포넌트가 아닌 Store에서 관리한다.
 */
export const useWeatherStore = defineStore('weather', () => {
  // ===== state =====
  const weatherList = ref([])
  const isLoading = ref(false)
  const loadError = ref('')
  const lastUpdated = ref(null)

  // 공정 경보 기준 온도·습도 (사용자가 조정 가능)
  const tempThreshold = ref(30)
  const humidityThreshold = ref(80)

  // ===== getters =====
  /** 기온 또는 습도가 기준을 넘어 공정 점검이 필요한 사업장 */
  const riskySites = computed(() =>
    weatherList.value.filter(
      (item) => item.temp >= tempThreshold.value || item.humidity >= humidityThreshold.value,
    ),
  )

  /** 전 사업장 평균 기온·습도 요약 */
  const summary = computed(() => {
    const list = weatherList.value

    if (list.length === 0) {
      return { count: 0, avgTemp: 0, avgHumidity: 0, riskCount: 0 }
    }

    const sum = (key) => list.reduce((acc, item) => acc + item[key], 0)

    return {
      count: list.length,
      avgTemp: Math.round((sum('temp') / list.length) * 10) / 10,
      avgHumidity: Math.round(sum('humidity') / list.length),
      riskCount: riskySites.value.length,
    }
  })

  const getWeatherById = computed(() => (id) => weatherList.value.find((item) => item.id === id))

  // ===== actions =====
  async function fetchAllSites() {
    isLoading.value = true
    loadError.value = ''

    try {
      const responses = await Promise.all(SITES.map((site) => fetchCurrentWeather(site.query)))

      weatherList.value = responses.map((response, index) => {
        const site = SITES[index]
        const raw = response.data

        return {
          id: site.id,
          region: site.region,
          city: site.city,
          siteName: site.siteName,
          process: site.process,
          temp: raw.main.temp,
          condition: raw.weather[0].description,
          icon: raw.weather[0].icon,
          humidity: raw.main.humidity,
          wind: raw.wind.speed,
        }
      })

      lastUpdated.value = new Date()
    } catch (error) {
      console.error('날씨 Store 로딩 실패:', error)
      loadError.value = '실시간 날씨 데이터를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  function setTempThreshold(value) {
    tempThreshold.value = value
  }

  return {
    weatherList,
    isLoading,
    loadError,
    lastUpdated,
    tempThreshold,
    humidityThreshold,
    riskySites,
    summary,
    getWeatherById,
    fetchAllSites,
    setTempThreshold,
  }
})
