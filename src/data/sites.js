/**
 * 사업장 마스터 데이터.
 * 도시(날씨)와 태양광 설비를 하나의 사업장 단위로 묶어 관리한다.
 */
export const SITES = [
  {
    id: 'city_01',
    region: 'seoul',
    city: '서울',
    siteName: '서울 본사·연구동',
    query: 'Seoul,KR',
    lat: 37.5665,
    lon: 126.978,
    capacityKw: 320,
    process: '정밀 조립',
  },
  {
    id: 'city_02',
    region: 'busan',
    city: '부산',
    siteName: '부산 물류센터',
    query: 'Busan,KR',
    lat: 35.1796,
    lon: 129.0756,
    capacityKw: 780,
    process: '보관·출하',
  },
  {
    id: 'city_03',
    region: 'daegu',
    city: '대구',
    siteName: '대구 도장공장',
    query: 'Daegu,KR',
    lat: 35.8714,
    lon: 128.6014,
    capacityKw: 540,
    process: '도장·건조',
  },
  {
    id: 'city_04',
    region: 'gwangju',
    city: '광주',
    siteName: '광주 사출공장',
    query: 'Gwangju,KR',
    lat: 35.1595,
    lon: 126.8526,
    capacityKw: 610,
    process: '사출 성형',
  },
  {
    id: 'city_05',
    region: 'daejeon',
    city: '대전',
    siteName: '대전 반도체동',
    query: 'Daejeon,KR',
    lat: 36.3504,
    lon: 127.3845,
    capacityKw: 450,
    process: '클린룸 공정',
  },
  {
    id: 'city_06',
    region: 'ulsan',
    city: '울산',
    siteName: '울산 화학플랜트',
    query: 'Ulsan,KR',
    lat: 35.5384,
    lon: 129.3114,
    capacityKw: 950,
    process: '화학 반응',
  },
]

export const findSiteById = (id) => SITES.find((site) => site.id === id)

export const findSiteByRegion = (region) => SITES.find((site) => site.region === region)
