import axios from 'axios'

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v1'

/** 기준 통화. Frankfurter는 base 1단위당 상대 통화 값을 반환한다. */
export const BASE_CURRENCY = 'USD'

/** 브리핑 화면에 표시할 주요 통화 */
export const MAJOR_CURRENCIES = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'AUD']

/**
 * 주요 통화 환율을 조회한다. (유럽중앙은행 고시 기준, API 키 불필요)
 * 원화 환산에 KRW가 반드시 필요하므로 조회 목록에 함께 넣는다.
 */
export const fetchLatestRates = () => {
  const symbols = [...MAJOR_CURRENCIES.filter((code) => code !== BASE_CURRENCY), 'KRW']

  return axios.get(`${FRANKFURTER_BASE_URL}/latest`, {
    params: {
      base: BASE_CURRENCY,
      symbols: symbols.join(','),
    },
  })
}

/** 시작일부터 종료일까지의 원/달러 환율 추이를 조회한다. */
export const fetchRateHistory = (startDate, endDate) =>
  axios.get(`${FRANKFURTER_BASE_URL}/${startDate}..${endDate}`, {
    params: {
      base: BASE_CURRENCY,
      symbols: 'KRW',
    },
  })
