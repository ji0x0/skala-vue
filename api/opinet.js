/**
 * 오피넷 유가 프록시 (Vercel Serverless Function)
 *
 * 오피넷은 CORS 헤더를 주지 않아 브라우저에서 직접 호출할 수 없고,
 * 조회에 발급 키가 필요하다. 두 문제를 서버에서 한 번에 해결한다.
 *
 * 사용 예)
 *   /api/opinet?endpoint=avgAllPrice
 *   /api/opinet?endpoint=avgRecentPrice&prodcd=D047
 */

const OPINET_BASE_URL = 'https://www.opinet.co.kr/api'

const ALLOWED_ENDPOINTS = new Set(['avgAllPrice', 'avgSidoPrice', 'avgRecentPrice'])

export default async function handler(req, res) {
  const { endpoint = 'avgAllPrice', ...rest } = req.query

  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return res.status(400).json({ message: `허용되지 않은 엔드포인트입니다: ${endpoint}` })
  }

  const apiKey = process.env.OPINET_API_KEY

  if (!apiKey) {
    return res.status(500).json({ message: '서버에 OPINET_API_KEY가 설정되지 않았습니다.' })
  }

  const params = new URLSearchParams({ ...rest, out: 'json', code: apiKey })

  try {
    const response = await fetch(`${OPINET_BASE_URL}/${endpoint}.do?${params}`)
    const text = await response.text()

    // 오피넷은 Content-Type이 JSON이 아니고 공백이 많이 섞여 있어 직접 파싱한다.
    try {
      return res.status(response.status).json(JSON.parse(text))
    } catch {
      return res.status(502).json({
        message: '오피넷 응답을 해석하지 못했습니다.',
        detail: text.slice(0, 300),
      })
    }
  } catch (error) {
    return res.status(502).json({ message: '오피넷 요청에 실패했습니다.', detail: error.message })
  }
}
