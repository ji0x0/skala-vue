import axios from 'axios'

/**
 * 날씨 관련 요청.
 *
 * OpenWeather는 API 키가 필요하므로 브라우저에서 직접 부르지 않고
 * /api/openweather 서버리스 함수를 거친다. 키는 서버에만 있다.
 * Open-Meteo는 키가 필요 없어 브라우저에서 바로 호출한다.
 */
const OPENWEATHER_PROXY_URL = '/api/openweather'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

export const fetchCurrentWeather = (query) =>
  axios.get(OPENWEATHER_PROXY_URL, {
    params: {
      path: 'weather',
      q: query,
    },
  })

export const fetchForecast = (latitude, longitude) =>
  axios.get(OPENWEATHER_PROXY_URL, {
    params: {
      path: 'forecast',
      lat: latitude,
      lon: longitude,
      cnt: 16,
    },
  })

export const fetchAirQuality = (latitude, longitude) =>
  axios.get(AIR_QUALITY_URL, {
    params: {
      latitude,
      longitude,
      current: 'european_aqi,pm10,pm2_5',
      timezone: 'auto',
    },
  })
