import axios from 'axios'

const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const KPX_PV_URL = 'https://apis.data.go.kr/B552115/PvAmountByLocHr/getPvAmountByLocHr'

/** 17개 시도 × 24시간 = 408건이 하루치 전체 데이터이다. */
const ROWS_PER_DAY = 408

/**
 * Open-Meteo 기상 예보에서 오늘의 태양광 발전 여건을 가져온다. (API 키 불필요)
 *
 * shortwave_radiation        수평면 전일사량(GHI, W/m²)
 * cloud_cover                운량(%)
 * shortwave_radiation_sum    일사량 일 합계(MJ/m²)
 * sunshine_duration          일조시간(초)
 */
export const fetchSolarForecast = (latitude, longitude) =>
  axios.get(OPEN_METEO_FORECAST_URL, {
    params: {
      latitude,
      longitude,
      hourly: 'shortwave_radiation,cloud_cover,temperature_2m',
      daily: 'sunshine_duration,shortwave_radiation_sum',
      timezone: 'Asia/Seoul',
      forecast_days: 2,
    },
  })

/**
 * 한국전력거래소 지역별 시간별 태양광 발전량 실적을 가져온다.
 *
 * 개발계정은 최신 데이터가 며칠~몇 주 지연되므로 날짜를 지정하지 않고
 * 가장 최근 제공 분(하루치 408건)을 그대로 받아 사용한다.
 * 응답의 amgo가 시간대별 발전량(MWh), tradeNo가 1~24시를 의미한다.
 */
export const fetchNationalPvActual = () =>
  axios.get(KPX_PV_URL, {
    params: {
      serviceKey: import.meta.env.VITE_DATA_GO_KR_API_KEY,
      pageNo: 1,
      numOfRows: ROWS_PER_DAY,
      dataType: 'JSON',
    },
  })
