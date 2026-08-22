import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SITES, findSiteByRegion } from '@/data/sites.js'
import {
  fetchNationalPvActual,
  fetchSolarForecast,
  fetchSolarForecastBulk,
} from '@/services/solarApi.js'

/** 태양광 시스템 성능비(Performance Ratio). 각종 손실을 반영한 통용 계수. */
const PERFORMANCE_RATIO = 0.8

/** 산업용 전력 단가 가정치 (원/kWh) */
const POWER_UNIT_PRICE = 165

/** 사업장 도시명 → 한국전력거래소 시도명 매핑 */
const REGION_TO_KPX_NAME = {
  seoul: '서울시',
  busan: '부산시',
  daegu: '대구시',
  gwangju: '광주시',
  daejeon: '대전시',
  ulsan: '울산시',
}

/**
 * 일사량(kWh/m²)과 설비용량(kWp)으로 하루 발전량을 추정한다.
 * 설비용량은 일사량 1,000W/m² 기준으로 정의되므로 그대로 곱한다.
 */
export const estimateGeneration = (radiationKwhPerM2, capacityKw) =>
  Math.round(radiationKwhPerM2 * capacityKw * PERFORMANCE_RATIO)

/** Open-Meteo 응답 한 건을 사업장 발전 예측으로 변환한다. */
const toSolarItem = (site, data) => {
  const { daily, hourly } = data

  // Open-Meteo의 일사량 합계 단위는 MJ/m² 이므로 kWh/m² 로 환산한다. (1kWh = 3.6MJ)
  const radiationToday = Math.round((daily.shortwave_radiation_sum[0] / 3.6) * 100) / 100

  return {
    region: site.region,
    city: site.city,
    siteName: site.siteName,
    capacityKw: site.capacityKw,
    radiationToday,
    sunshineHours: Math.round((daily.sunshine_duration[0] / 3600) * 10) / 10,
    generationToday: estimateGeneration(radiationToday, site.capacityKw),
    hourly: hourly.time.slice(0, 24).map((time, index) => ({
      time,
      radiation: hourly.shortwave_radiation[index],
      cloudCover: hourly.cloud_cover[index],
    })),
  }
}

export const useSolarStore = defineStore('solar', () => {
  // ===== state =====
  const solarList = ref([])
  const isLoading = ref(false)
  const loadError = ref('')

  // 한국전력거래소 실측 발전량
  const actualList = ref([])
  const actualDate = ref('')
  const actualError = ref('')

  // ===== getters =====
  /** 전 사업장 오늘 예상 발전량 합계 (kWh) */
  const totalGenerationToday = computed(() =>
    solarList.value.reduce((acc, item) => acc + item.generationToday, 0),
  )

  /** 오늘 발전으로 절감이 기대되는 전력비 (원) */
  const expectedSavingToday = computed(() => totalGenerationToday.value * POWER_UNIT_PRICE)

  /** 오늘 발전 여건이 가장 좋은 사업장 */
  const bestSite = computed(() => {
    if (solarList.value.length === 0) return null

    return [...solarList.value].sort((a, b) => b.generationToday - a.generationToday)[0]
  })

  const getSolarByRegion = computed(
    () => (region) => solarList.value.find((item) => item.region === region),
  )

  /** 지역별 실측 발전량을 시간대 순서로 반환한다. */
  const getActualByRegion = computed(() => (region) => {
    const kpxName = REGION_TO_KPX_NAME[region]
    if (!kpxName) return []

    return actualList.value
      .filter((item) => item.regionName === kpxName)
      .sort((a, b) => a.hour - b.hour)
  })

  /** 실측 기준 전국 일일 발전량 합계 (MWh) */
  const actualNationalTotal = computed(
    () => Math.round(actualList.value.reduce((acc, item) => acc + item.amount, 0) * 10) / 10,
  )

  // ===== actions =====
  async function fetchAllSites() {
    if (isLoading.value) return

    isLoading.value = true
    loadError.value = ''

    try {
      // 사업장마다 따로 부르지 않고 한 번의 요청으로 전부 받아 온다.
      const response = await fetchSolarForecastBulk(SITES)
      const results = Array.isArray(response.data) ? response.data : [response.data]

      solarList.value = results.map((data, index) => toSolarItem(SITES[index], data))
    } catch (error) {
      console.error('태양광 예측 Store 로딩 실패:', error)
      loadError.value = '태양광 일사량 데이터를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  /** 상세 화면에서 특정 지역만 필요할 때 사용한다. */
  async function fetchOneRegion(region) {
    if (getSolarByRegion.value(region)) return

    const site = findSiteByRegion(region)
    if (!site) {
      loadError.value = '해당 사업장 정보를 찾을 수 없습니다.'
      return
    }

    isLoading.value = true
    loadError.value = ''

    try {
      const response = await fetchSolarForecast(site.lat, site.lon)
      solarList.value.push(toSolarItem(site, response.data))
    } catch (error) {
      console.error('태양광 상세 로딩 실패:', error)
      loadError.value = '태양광 일사량 데이터를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  /** 한국전력거래소 지역별 시간별 실측 발전량을 가져온다. */
  async function fetchActual() {
    if (actualList.value.length > 0) return

    actualError.value = ''

    try {
      const response = await fetchNationalPvActual()
      const items = response.data.response.body.items.item ?? []

      actualList.value = items.map((item) => ({
        regionName: item.regionNm,
        hour: Number(item.tradeNo),
        amount: Number(item.amgo),
        date: item.tradeYmd,
      }))

      actualDate.value = items.length > 0 ? items[0].tradeYmd : ''
    } catch (error) {
      console.error('한국전력거래소 실측 로딩 실패:', error)
      actualError.value = '전력거래소 실측 발전량을 불러오지 못했습니다.'
    }
  }

  return {
    solarList,
    isLoading,
    loadError,
    actualList,
    actualDate,
    actualError,
    powerUnitPrice: POWER_UNIT_PRICE,
    totalGenerationToday,
    expectedSavingToday,
    bestSite,
    getSolarByRegion,
    getActualByRegion,
    actualNationalTotal,
    fetchAllSites,
    fetchOneRegion,
    fetchActual,
  }
})
