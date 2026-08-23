import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchLatestRates, fetchRateHistory, MAJOR_CURRENCIES } from '@/services/exchangeApi.js'

/** 환율 추이를 조회할 과거 구간(일) */
const HISTORY_DAYS = 30

/** 화면에 표시할 통화 메타데이터 */
const CURRENCY_META = {
  USD: { label: '미국 달러', flag: '🇺🇸', note: '원자재·설비 수입 기준 통화' },
  EUR: { label: '유로', flag: '🇪🇺', note: '유럽산 설비·부품 도입가' },
  JPY: { label: '일본 엔', flag: '🇯🇵', note: '정밀 부품 수입 단가' },
  CNY: { label: '중국 위안', flag: '🇨🇳', note: '범용 자재 조달 단가' },
  GBP: { label: '영국 파운드', flag: '🇬🇧', note: '유럽 수출 채산성' },
  AUD: { label: '호주 달러', flag: '🇦🇺', note: '광물·원료 수입 단가' },
}

/** 이 값을 넘어서면 강세·약세 구간으로 본다. (%) */
const CHANGE_THRESHOLD = 1

const toDateString = (date) => date.toISOString().slice(0, 10)

/**
 * 주요 통화 환율을 보관하는 Store.
 * 환율은 원자재 수입 단가와 수출 채산성에 직접 영향을 주는 비용 변수이다.
 */
export const useExchangeStore = defineStore('exchange', () => {
  // ===== state =====
  const rates = ref(null)
  const baseDate = ref('')
  const history = ref([])
  const isLoading = ref(false)
  const loadError = ref('')

  // ===== getters =====
  /** 1 USD당 원화 */
  const usdKrw = computed(() => (rates.value ? rates.value.KRW : 0))

  /**
   * 주요 통화 1단위당 원화 환산값.
   * Frankfurter는 USD 기준 값을 주므로 (KRW/USD) ÷ (통화/USD)로 교차 계산한다.
   */
  const majorRates = computed(() => {
    if (!rates.value) return []

    return MAJOR_CURRENCIES.map((code) => {
      const perUsd = code === 'USD' ? 1 : rates.value[code]
      const krw = perUsd ? usdKrw.value / perUsd : 0

      // 엔화와 위안화는 100단위 표기가 관례이다.
      const isPer100 = code === 'JPY'

      return {
        code,
        ...CURRENCY_META[code],
        krw: Math.round(krw * (isPer100 ? 100 : 1) * 100) / 100,
        unit: isPer100 ? `100 ${code}` : `1 ${code}`,
      }
    }).filter((item) => item.krw > 0)
  })

  /** 조회 구간 대비 원/달러 등락률(%) */
  const changeRate = computed(() => {
    if (history.value.length < 2) return 0

    const first = history.value[0].value
    const last = history.value[history.value.length - 1].value

    return Math.round(((last - first) / first) * 1000) / 10
  })

  /** 조회 구간 첫 영업일 대비 원/달러 변화 금액(원) */
  const changeAmount = computed(() => {
    if (history.value.length < 2) return 0

    const first = history.value[0].value
    const last = history.value[history.value.length - 1].value

    return Math.round((last - first) * 100) / 100
  })

  /** 등락 방향에 따른 운영 코멘트 */
  const costComment = computed(() => {
    if (history.value.length < 2) return '환율 추이를 불러오는 중입니다.'

    if (changeRate.value > CHANGE_THRESHOLD) {
      return '원화 약세 구간입니다. 수입 원자재 단가 상승에 유의하세요.'
    }

    if (changeRate.value < -CHANGE_THRESHOLD) {
      return '원화 강세 구간입니다. 수입 원자재 매입에 유리합니다.'
    }

    return '환율이 안정 구간입니다. 특이사항 없습니다.'
  })

  const historyRange = computed(() => {
    if (history.value.length === 0) return { min: 0, max: 0 }

    const values = history.value.map((item) => item.value)

    return { min: Math.min(...values), max: Math.max(...values) }
  })

  // ===== actions =====
  async function fetchRates() {
    if (isLoading.value) return

    isLoading.value = true
    loadError.value = ''

    try {
      const today = new Date()
      const from = new Date(today)
      from.setDate(from.getDate() - HISTORY_DAYS)

      const [latestResponse, historyResponse] = await Promise.all([
        fetchLatestRates(),
        fetchRateHistory(toDateString(from), toDateString(today)),
      ])

      rates.value = latestResponse.data.rates
      baseDate.value = latestResponse.data.date

      history.value = Object.entries(historyResponse.data.rates)
        .map(([date, value]) => ({ date, value: value.KRW }))
        .sort((a, b) => a.date.localeCompare(b.date))
    } catch (error) {
      console.error('환율 Store 로딩 실패:', error)
      loadError.value = '환율 데이터를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    rates,
    baseDate,
    history,
    isLoading,
    loadError,
    usdKrw,
    majorRates,
    changeRate,
    changeAmount,
    changeThreshold: CHANGE_THRESHOLD,
    historyDays: HISTORY_DAYS,
    costComment,
    historyRange,
    fetchRates,
  }
})
