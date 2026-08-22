/**
 * OpenWeather 프록시 (Vercel Serverless Function)
 *
 * 브라우저는 이 엔드포인트만 호출하고, API 키는 서버에서 붙인다.
 * 따라서 개발자 도구의 Network 탭에도 키가 노출되지 않는다.
 *
 * 사용 예)
 *   /api/openweather?path=weather&q=Seoul,KR
 *   /api/openweather?path=forecast&lat=37.5&lon=127.0&cnt=16
 */

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

/** 아무 주소나 대신 호출해 주는 열린 프록시가 되지 않도록 경로를 제한한다. */
const ALLOWED_PATHS = new Set(['weather', 'forecast'])

export default async function handler(req, res) {
  const { path = 'weather', ...rest } = req.query

  if (!ALLOWED_PATHS.has(path)) {
    return res.status(400).json({ message: `허용되지 않은 경로입니다: ${path}` })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return res.status(500).json({ message: '서버에 OPENWEATHER_API_KEY가 설정되지 않았습니다.' })
  }

  const params = new URLSearchParams({
    ...rest,
    appid: apiKey,
    units: 'metric',
    lang: 'kr',
  })

  try {
    const response = await fetch(`${OPENWEATHER_BASE_URL}/${path}?${params}`)
    const data = await response.json()

    return res.status(response.status).json(data)
  } catch (error) {
    return res.status(502).json({ message: 'OpenWeather 요청에 실패했습니다.', detail: error.message })
  }
}
