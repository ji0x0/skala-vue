import axios from 'axios'

/**
 * 오피넷은 두 가지 문제가 있다.
 *   1. CORS 헤더를 주지 않아 브라우저에서 직접 호출할 수 없다.
 *   2. 조회에 발급 키가 필요해 브라우저에 키를 두면 노출된다.
 * /api/opinet 서버리스 함수가 두 문제를 한 번에 해결한다.
 */
const OPINET_PROXY_URL = '/api/opinet'

/** 전국 평균 유가 (휘발유, 경유, 등유 등 제품별) */
export const fetchNationalFuelPrice = () =>
  axios.get(OPINET_PROXY_URL, { params: { endpoint: 'avgAllPrice' } })

/** 시도별 평균 유가 */
export const fetchRegionalFuelPrice = () =>
  axios.get(OPINET_PROXY_URL, { params: { endpoint: 'avgSidoPrice' } })

/** 최근 7일 전국 평균 경유가 추이 */
export const fetchFuelPriceTrend = () =>
  axios.get(OPINET_PROXY_URL, { params: { endpoint: 'avgRecentPrice', prodcd: 'D047' } })
