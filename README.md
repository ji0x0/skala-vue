# 제조현장 데일리 운영 브리핑

공장 운영 담당자가 출근길에 확인하는, 오늘의 공정 컨디션 브리핑이다.

SKALA Full-Stack Engineering 과정의 Vue.js 실습 과제 1~8을 하나의 서비스로 발전시켰다. 목업 화면에서 시작해 Composition API, 컴포넌트 분리, Vue Router, Pinia, Axios, Element Plus, 품질 검사와 배포까지 순서대로 적용했다.

## 왜 만들었나

공정은 날씨 하나로만 결정되지 않는다. 기온·습도 같은 환경 조건은 공정 품질에, 일조량은 태양광 자가발전량과 전력비 절감 여력에, 유가와 환율은 물류·연료비와 원자재 수입 단가에 영향을 준다.

흩어져 있는 세 지표를 한 화면에 묶어, 담당자가 아침에 5초 안에 "오늘 무엇을 신경 써야 하는지" 판단할 수 있게 돕는다.

| 축 | 내용 |
| --- | --- |
| 환경 리스크 | 사업장별 기온·습도로 공정 품질 변수 확인 |
| 에너지 기회 | 일사량 기반 태양광 자가발전 기대치와 실측 비교 |
| 비용 변수 | 유가·환율로 물류비와 원자재 수입 단가 방향 확인 |

## 화면

| 경로 | 화면 | 설명 |
| --- | --- | --- |
| `/` | 운영 브리핑 | 환경·에너지·비용 통합 대시보드 |
| `/weather/:cityId` | 사업장 기상 상세 | 실시간 날씨, 단기 예보, 대기질, 공정 참고사항 |
| `/solar/:region` | 태양광 발전 상세 | 시간대별 일사량 예보와 전력거래소 실측 비교 |
| `/about` | 서비스 소개 | 컨셉, 핵심 가치, 사업장, 기술 스택 |
| `/labs` | 실습 아카이브 | 실습 1~8단계 진행 타임라인 |
| `/labs/:step` | 실습 상세 | 요구사항·확장 내역과 당시 결과물 실행 |
| `/troubleshooting` | 트러블슈팅 | 개발 중 겪은 문제 17건 |
| 그 외 | 404 | Catch-all 라우트 |

실습 1~3단계 결과물은 `/labs/1`, `/labs/2`, `/labs/3`에서 당시 컴포넌트 그대로 실행해 볼 수 있다.

## 기술 스택

- Vue 3 (Composition API), Vite
- Vue Router — 8개 View 전부 지연 로딩, Catch-all 라우트
- Pinia — Store 5종 (설정·날씨·태양광·유가·환율)
- Axios — 외부 API 7종 연동
- Element Plus
- ESLint, oxlint, oxfmt

## 사용한 외부 API

| API | 용도 | 키 |
| --- | --- | --- |
| OpenWeather Current Weather | 사업장 실시간 날씨 | 필요 |
| OpenWeather 5 Day / 3 Hour Forecast | 단기 예보 | 필요 |
| Open-Meteo Air Quality | 대기질·미세먼지 | 불필요 |
| Open-Meteo Forecast | 일사량·일조시간 | 불필요 |
| 한국전력거래소 지역별 시간별 태양광 발전량 | 실측 발전량 | 필요 |
| 오피넷 평균 유가 | 전국·지역 유가와 추이 | 필요 |
| Frankfurter | 주요 6개 통화 환율 | 불필요 |

오피넷은 CORS 헤더를 제공하지 않아 개발 서버는 Vite 프록시로, 배포 환경은 `vercel.json` rewrite로 우회한다.

## 실행 방법

Node.js 20.19 이상이 필요하다.

```bash
npm install
```

프로젝트 최상위의 `.env.example`을 복사해 `.env`를 만들고 발급받은 키를 채운다.

```bash
cp .env.example .env
```

```bash
npm run dev
```

환경변수를 수정한 경우 개발 서버를 반드시 다시 시작한다.

## 품질 검사와 빌드

```bash
npm run lint:eslint -- --no-fix
```

```bash
npm run build
```

```bash
npm run preview
```

빌드 결과는 `dist/` 폴더에 생성된다.

## 프로젝트 구조

```text
src/
├── components/
│   ├── exercise/      # 실습용 부품 컴포넌트 격리 폴더 (과제 1~3 결과물)
│   ├── dashboard/     # 브리핑 대시보드 카드
│   └── common/        # 내비게이션 등 공통 UI
├── data/              # 사업장·실습·트러블슈팅 콘텐츠 데이터
├── router/            # 라우트 규칙과 지연 로딩 설정
├── services/          # Axios API 요청 함수
├── stores/            # Pinia Store 5종
├── views/             # 페이지 단위 컴포넌트 8종
├── App.vue            # 내비게이션 + RouterView
└── main.js            # 플러그인 등록
```

## 배포

Vercel에 GitHub 저장소를 연결하고, 프로젝트 환경변수에 아래 세 개를 등록한 뒤 재배포한다.

- `VITE_OPENWEATHER_API_KEY`
- `VITE_DATA_GO_KR_API_KEY` (URL 디코딩된 값)
- `VITE_OPINET_API_KEY`

`VITE_` 환경변수는 빌드 시점에 클라이언트 번들에 삽입되므로 `.gitignore`만으로는 브라우저 노출을 막지 못한다. 자세한 내용과 대응 방법은 [EXTENSIONS.md](EXTENSIONS.md)의 "API 키 관리와 Vercel 배포"에 정리했다.

## 문서

- [EXTENSIONS.md](EXTENSIONS.md) — 서비스 컨셉, 과제별 완료 내역, 확장 기능, 배포 절차
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — 개발 중 겪은 문제와 원인, 해결 방법
