import axios from 'axios'

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const openWeatherParams = {
  appid: API_KEY,
  units: 'metric',
  lang: 'kr',
}

export const fetchCurrentWeather = (query) =>
  axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
    params: {
      q: query,
      ...openWeatherParams,
    },
  })

export const fetchForecast = (latitude, longitude) =>
  axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
    params: {
      lat: latitude,
      lon: longitude,
      cnt: 16,
      ...openWeatherParams,
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
