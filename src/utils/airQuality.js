/**
 * 한국 통합대기환경지수(CAI) 계산.
 *
 * Open-Meteo가 내려주는 european_aqi는 유럽 기준이라 국내 예보 등급과 어긋난다.
 * 같은 응답에 들어 있는 PM10·PM2.5 농도로 환경부 기준의 CAI를 직접 계산한다.
 *
 * 환경부 통합대기환경지수 구간 (24시간 평균 기준, ㎍/㎥)
 *   PM10  좋음 0-30   보통 31-80   나쁨 81-150   매우나쁨 151 이상
 *   PM2.5 좋음 0-15   보통 16-35   나쁨 36-75    매우나쁨 76 이상
 * 지수 구간은 좋음 0-50, 보통 51-100, 나쁨 101-250, 매우나쁨 251-500이다.
 */

/** [농도 하한, 농도 상한, 지수 하한, 지수 상한] */
const BREAKPOINTS = {
  pm10: [
    [0, 30, 0, 50],
    [31, 80, 51, 100],
    [81, 150, 101, 250],
    [151, 600, 251, 500],
  ],
  pm25: [
    [0, 15, 0, 50],
    [16, 35, 51, 100],
    [36, 75, 101, 250],
    [76, 500, 251, 500],
  ],
}

/** 농도를 해당 구간 안에서 선형 보간해 지수로 바꾼다. */
const toIndex = (value, table) => {
  if (value === null || value === undefined || Number.isNaN(value)) return null

  const row = table.find(([low, high]) => value >= low && value <= high)
  if (!row) return 500

  const [cLow, cHigh, iLow, iHigh] = row

  return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (value - cLow) + iLow)
}

/** 지수를 등급으로 바꾼다. */
export const toGrade = (index) => {
  if (index === null) return { label: '측정 중', type: 'info', advice: '' }
  if (index <= 50) {
    return { label: '좋음', type: 'success', advice: '외기 도입에 제약이 없습니다.' }
  }
  if (index <= 100) {
    return { label: '보통', type: 'success', advice: '평소대로 운영하면 됩니다.' }
  }
  if (index <= 250) {
    return {
      label: '나쁨',
      type: 'warning',
      advice: '클린룸·도장 공정의 외기 유입 필터 상태를 점검하세요.',
    }
  }

  return {
    label: '매우 나쁨',
    type: 'danger',
    advice: '외기 도입을 줄이고 옥외 작업 시간을 조정하세요.',
  }
}

/**
 * PM10과 PM2.5 각각의 지수를 구해 더 나쁜 쪽을 대표값으로 삼는다.
 * 환경부 통합지수도 같은 방식(최댓값)을 쓴다.
 */
export const calculateCai = (pm10, pm25) => {
  const indexPm10 = toIndex(pm10, BREAKPOINTS.pm10)
  const indexPm25 = toIndex(pm25, BREAKPOINTS.pm25)
  const values = [indexPm10, indexPm25].filter((v) => v !== null)

  if (values.length === 0) {
    return { index: null, indexPm10: null, indexPm25: null, dominant: null }
  }

  const index = Math.max(...values)

  return {
    index,
    indexPm10,
    indexPm25,
    // 어느 항목이 등급을 결정했는지 알려 준다.
    dominant: indexPm10 !== null && indexPm10 >= (indexPm25 ?? -1) ? 'PM10' : 'PM2.5',
  }
}
