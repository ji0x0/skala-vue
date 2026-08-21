import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  fetchFuelPriceTrend,
  fetchNationalFuelPrice,
  fetchRegionalFuelPrice,
} from '@/services/fuelApi.js'

/** 오피넷 제품 코드 */
const PRODUCT_META = {
  B027: { name: '휘발유', icon: '⛽', use: '사내 차량·지게차' },
  B034: { name: '고급휘발유', icon: '⛽', use: '특수 차량' },
  D047: { name: '자동차용 경유', icon: '🚚', use: '물류 운송·화물차' },
  C004: { name: '실내등유', icon: '🔥', use: '보일러·난방' },
  K015: { name: '자동차용 부탄', icon: '🫧', use: 'LPG 지게차' },
}

/** 물류비 영향도가 가장 큰 제품 */
const PRIMARY_PRODUCT = 'D047'

export const useFuelStore = defineStore('fuel', () => {
  // ===== state =====
  const nationalPrices = ref([])
  const regionalPrices = ref([])
  const trend = ref([])
  const isLoading = ref(false)
  const loadError = ref('')

  // ===== getters =====
  /** 물류 기준 유종(경유) 현재가 */
  const dieselPrice = computed(() => {
    const item = nationalPrices.value.find((price) => price.code === PRIMARY_PRODUCT)

    return item ? item.price : 0
  })

  /** 경유 전일 대비 등락 */
  const dieselDiff = computed(() => {
    const item = nationalPrices.value.find((price) => price.code === PRIMARY_PRODUCT)

    return item ? item.diff : 0
  })

  /** 최근 구간 등락률(%) */
  const trendChangeRate = computed(() => {
    if (trend.value.length < 2) return 0

    const first = trend.value[0].price
    const last = trend.value[trend.value.length - 1].price

    return Math.round(((last - first) / first) * 1000) / 10
  })

  /** 운영 담당자용 코멘트 */
  const costComment = computed(() => {
    if (trend.value.length < 2) return '유가 추이를 불러오는 중입니다.'

    if (trendChangeRate.value > 0.5) {
      return '경유가 상승 추세입니다. 물류·보일러 가동 비용 증가에 대비하세요.'
    }

    if (trendChangeRate.value < -0.5) {
      return '경유가 하락 추세입니다. 물류비 부담이 완화되는 구간입니다.'
    }

    return '유가가 안정적입니다. 물류비 특이사항 없습니다.'
  })

  /** 시도별 경유 가격 (전국 제외, 저렴한 순) */
  const regionalDiesel = computed(() =>
    regionalPrices.value
      .filter((item) => item.code === PRIMARY_PRODUCT && item.sidoName !== '전국')
      .sort((a, b) => a.price - b.price),
  )

  const trendRange = computed(() => {
    if (trend.value.length === 0) return { min: 0, max: 0 }

    const values = trend.value.map((item) => item.price)

    return { min: Math.min(...values), max: Math.max(...values) }
  })

  // ===== actions =====
  async function fetchFuelPrices() {
    if (isLoading.value) return

    isLoading.value = true
    loadError.value = ''

    try {
      const [nationalResponse, regionalResponse, trendResponse] = await Promise.all([
        fetchNationalFuelPrice(),
        fetchRegionalFuelPrice(),
        fetchFuelPriceTrend(),
      ])

      nationalPrices.value = nationalResponse.data.RESULT.OIL.map((item) => ({
        code: item.PRODCD,
        name: PRODUCT_META[item.PRODCD]?.name ?? item.PRODNM,
        icon: PRODUCT_META[item.PRODCD]?.icon ?? '🛢️',
        use: PRODUCT_META[item.PRODCD]?.use ?? '기타',
        price: Number(item.PRICE),
        diff: Number(item.DIFF),
        date: item.TRADE_DT,
      }))

      regionalPrices.value = regionalResponse.data.RESULT.OIL.map((item) => ({
        sidoCode: item.SIDOCD,
        sidoName: item.SIDONM,
        code: item.PRODCD,
        price: Number(item.PRICE),
      }))

      trend.value = trendResponse.data.RESULT.OIL.map((item) => ({
        date: item.DATE,
        price: Number(item.PRICE),
      })).sort((a, b) => a.date.localeCompare(b.date))
    } catch (error) {
      console.error('유가 Store 로딩 실패:', error)
      loadError.value = '유가 데이터를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    nationalPrices,
    regionalPrices,
    trend,
    isLoading,
    loadError,
    dieselPrice,
    dieselDiff,
    trendChangeRate,
    costComment,
    regionalDiesel,
    trendRange,
    fetchFuelPrices,
  }
})
