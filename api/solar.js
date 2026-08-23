/**
 * Open-Meteo 태양광 예보 프록시 (Vercel Serverless Function)
 *
 * 같은 좌표 요청은 Vercel CDN에서 30분간 재사용하고, 갱신 중에는
 * 최대 하루 동안 마지막 정상 응답을 제공한다.
 */

const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const ALLOWED_PARAMS = new Set([
  'latitude',
  'longitude',
  'hourly',
  'daily',
  'timezone',
  'forecast_days',
])

let lastSuccessfulResponse = null

export default async function handler(req, res) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(req.query)) {
    if (ALLOWED_PARAMS.has(key) && typeof value === 'string') params.set(key, value)
  }

  if (!params.has('latitude') || !params.has('longitude')) {
    return res.status(400).json({ message: '위도와 경도가 필요합니다.' })
  }

  try {
    const response = await fetch(`${OPEN_METEO_FORECAST_URL}?${params}`)

    if (!response.ok) throw new Error(`Open-Meteo 응답 상태 ${response.status}`)

    const data = await response.json()
    lastSuccessfulResponse = data
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400')

    return res.status(200).json(data)
  } catch (error) {
    if (lastSuccessfulResponse) {
      res.setHeader('X-Solar-Data-Source', 'server-memory-fallback')
      return res.status(200).json(lastSuccessfulResponse)
    }

    return res.status(502).json({
      message: 'Open-Meteo 일사량 요청에 실패했습니다.',
      detail: error.message,
    })
  }
}
