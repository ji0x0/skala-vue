import axios from 'axios'

/**
 * 오피넷은 CORS 헤더를 제공하지 않아 브라우저에서 직접 호출할 수 없다.
 * 개발 서버는 vite.config.js의 proxy가, 배포 환경은 vercel.json의 rewrite가
 * /api/opinet 요청을 오피넷으로 전달한다.
 */
const OPINET_PROXY_URL = '/api/opinet'

const opinetParams = {
  out: 'json',
  code: import.meta.env.VITE_OPINET_API_KEY,
}

/** 전국 평균 유가 (휘발유, 경유, 등유 등 제품별) */
export const fetchNationalFuelPrice = () =>
  axios.get(`${OPINET_PROXY_URL}/avgAllPrice.do`, { params: opinetParams })

/** 시도별 평균 유가 */
export const fetchRegionalFuelPrice = () =>
  axios.get(`${OPINET_PROXY_URL}/avgSidoPrice.do`, { params: opinetParams })

/** 최근 7일 전국 평균 유가 추이 */
export const fetchFuelPriceTrend = () =>
  axios.get(`${OPINET_PROXY_URL}/avgRecentPrice.do`, {
    params: { ...opinetParams, prodcd: 'D047' },
  })
