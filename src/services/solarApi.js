import axios from 'axios'

const SOLAR_FORECAST_PROXY_URL = '/api/solar'

/** 전력거래소 실측 데이터는 인증키가 필요해 서버리스 함수를 거친다. */
const KPX_PROXY_URL = '/api/kpx'

/**
 * Open-Meteo 기상 예보에서 오늘의 태양광 발전 여건을 가져온다. (API 키 불필요)
 *
 * shortwave_radiation        수평면 전일사량(GHI, W/m²)
 * cloud_cover                운량(%)
 * shortwave_radiation_sum    일사량 일 합계(MJ/m²)
 * sunshine_duration          일조시간(초)
 */
export const fetchSolarForecast = (latitude, longitude) =>
  axios.get(SOLAR_FORECAST_PROXY_URL, {
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
 * 여러 지점을 한 번의 요청으로 조회한다.
 * 좌표를 쉼표로 이어 보내면 지점 수만큼의 결과가 배열로 돌아온다.
 * 사업장마다 따로 요청하면 호출 수가 6배가 되어 레이트 리밋에 걸리기 쉽다.
 */
export const fetchSolarForecastBulk = (sites) =>
  axios.get(SOLAR_FORECAST_PROXY_URL, {
    params: {
      latitude: sites.map((site) => site.lat).join(','),
      longitude: sites.map((site) => site.lon).join(','),
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
export const fetchNationalPvActual = () => axios.get(KPX_PROXY_URL)
