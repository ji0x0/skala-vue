/**
 * 한국전력거래소 지역별 시간별 태양광 발전량 프록시 (Vercel Serverless Function)
 *
 * 공공데이터포털 인증키를 서버에서만 사용한다.
 * 포털이 안내하는 인증키는 이미 URL 인코딩되어 있으므로,
 * 환경변수에는 디코딩된 원본을 넣고 URLSearchParams가 한 번만 인코딩하게 한다.
 */

const KPX_PV_URL = 'https://apis.data.go.kr/B552115/PvAmountByLocHr/getPvAmountByLocHr'

/** 17개 시도 × 24시간 = 408건이 하루치 전체 데이터이다. */
const ROWS_PER_DAY = 408

export default async function handler(req, res) {
  const apiKey = process.env.DATA_GO_KR_API_KEY

  if (!apiKey) {
    return res.status(500).json({ message: '서버에 DATA_GO_KR_API_KEY가 설정되지 않았습니다.' })
  }

  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: req.query.pageNo ?? '1',
    numOfRows: req.query.numOfRows ?? String(ROWS_PER_DAY),
    dataType: 'JSON',
  })

  try {
    const response = await fetch(`${KPX_PV_URL}?${params}`)
    const text = await response.text()

    // 인증 실패 등에서는 XML이 돌아오기도 해서 JSON 파싱을 방어한다.
    try {
      return res.status(response.status).json(JSON.parse(text))
    } catch {
      return res.status(502).json({
        message: '전력거래소 응답을 해석하지 못했습니다.',
        detail: text.slice(0, 300),
      })
    }
  } catch (error) {
    return res.status(502).json({ message: '전력거래소 요청에 실패했습니다.', detail: error.message })
  }
}
