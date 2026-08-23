# 제조현장 데일리 운영 브리핑

SKALA Full-Stack Engineering 과정의 Vue.js 실습 과제 1-8을 하나의 서비스로 발전시킨 프로젝트다.

- 배포 주소: https://skala-vue-factory-daily-briefing.vercel.app
- 저장소: https://github.com/ji0x0/skala-vue

## 프로젝트 소개

공장 운영 담당자가 출근길에 확인하는 오늘의 공정 컨디션 브리핑이다.

실습 과제는 도시별 날씨를 보여주는 대시보드에서 시작한다. 여기에 "날씨를 왜 보는가"라는 목적을 붙여, 제조 현장의 하루 운영 판단에 필요한 세 가지 지표를 한 화면에 묶었다.

| 축 | 보는 것 | 판단에 쓰는 이유 |
| --- | --- | --- |
| 환경 리스크 | 사업장별 기온·습도, 대기질 | 도장·건조·클린룸 공정 품질에 영향 |
| 에너지 기회 | 일사량 기반 태양광 발전 예측 | 자가발전량과 전력비 절감 여력 |
| 비용 변수 | 유가, 주요 통화 환율 | 물류·연료비와 원자재 수입 단가 |

가상의 사업장 6곳(서울·부산·대구·광주·대전·울산)을 관측 대상으로 두고, 각 사업장에 주요 공정과 태양광 설비 용량을 부여했다.

## 화면 구성

| 경로 | 화면 | 내용 |
| --- | --- | --- |
| `/` | 운영 브리핑 | 환경·에너지·비용 통합 대시보드 |
| `/weather/:cityId` | 사업장 기상 상세 | 단기 예보, 대기질, 공정 참고사항 |
| `/solar/:region` | 태양광 발전 상세 | 시간대별 일사량 예보와 전력거래소 실측 비교 |
| `/about` | 서비스 소개 | 컨셉, 판단 기준, 사업장, 기술 스택 |
| `/labs`, `/labs/:step` | 실습 아카이브 | 실습 1-8 진행 기록과 실행 화면 |
| `/troubleshooting` | 트러블슈팅 | 개발 중 겪은 문제 27건 |
| 그 외 | 404 | Catch-all 라우트 |

## 아키텍처

### 데이터 흐름

```text
View (화면)
  │  화면은 데이터를 직접 가져오지 않고 Store에서 읽는다
  ▼
Store (Pinia)  ─── 상태 보관, 파생값 계산(getters), 로딩·오류 상태
  │
  ▼
Service (Axios)  ─── 어떤 주소로 무슨 파라미터를 보낼지만 담당
  │
  ├──(키 불필요)──────────────────────> Open-Meteo Air Quality, Frankfurter
  └──(캐시 필요)──> /api/solar ───────> Open-Meteo Forecast
  │
  └──(키 필요)──> api/ 서버리스 함수 ──> OpenWeather, 공공데이터포털, 오피넷
                   여기서 API 키를 붙인다
```

데이터를 여러 화면에서 함께 쓰고 API 키를 브라우저에 두지 않기 위해 역할을 나눴다.

- View는 Store의 상태를 표시하고, Service는 외부 요청을 담당한다.
- 키가 필요한 요청은 `api/`의 서버리스 함수를 거친다.

### 폴더 구조

```text
api/                      서버리스 함수. API 키는 이 안에서만 쓴다
├── openweather.js
├── kpx.js
└── opinet.js

src/
├── components/
│   ├── exercise/         실습 1-3 결과물 (과제 명세가 지정한 격리 폴더)
│   ├── lab/              실습 4-8 개념 데모
│   ├── dashboard/        브리핑 대시보드 카드
│   └── common/           내비게이션
├── data/                 사업장·실습·트러블슈팅 콘텐츠 데이터
├── router/               라우트 규칙, 지연 로딩
├── services/             Axios 요청 함수
├── stores/               Pinia Store 5종
├── utils/                대기질 지수 계산 등 순수 함수
└── views/                페이지 단위 컴포넌트 8종
```

`components/exercise/`에는 실습 결과물을, 나머지 컴포넌트는 화면 역할에 따라 나눠 두었다. 실습 아카이브와 트러블슈팅 내용은 `data/`에서 관리한다.

### API 키 관리

`VITE_` 환경변수는 클라이언트 번들에 포함되므로 API 키에는 사용하지 않았다. OpenWeather, 전력거래소, 오피넷 요청은 `api/` 서버리스 함수에서 키를 붙인다. 로컬에서는 `vite.config.js`의 미들웨어가 이 함수들을 불러온다. 구현 과정과 확인 방법은 [EXTENSIONS.md](EXTENSIONS.md)에 정리했다.

## 과제 수행 내역

### 1. Vue 기본 문법

도시 배열을 `v-for`로 반복 출력하고 `id`를 `:key`에 연결했다. 기온에 따른 `v-if`·`v-else` 라벨, `:value`·`@input` 검색, 카드 선택 상태바, `@click.stop` 상세 알림도 구현했다.

개인 실습으로 도시를 6곳까지 늘리고 습도와 풍속을 추가했다. 두 도시를 선택해 기온·습도·풍속을 비교하는 영역도 만들었다.

### 2. Composition API

`searchQuery`, `selectedCityInfo`, `weatherList`를 반응형 상태로 두고 `filteredWeatherList`를 `computed`로 계산했다. 선택 도시 변화는 `watch`, 검색어 변화는 `watchEffect`로 확인하며 검색 전·결과 있음·결과 없음 상태를 화면에서 구분한다.

추가로 공정 경보 기준 온도와 정렬 기준을 상태로 만들었다. 정렬 목록과 공정 위험 요약은 별도 Computed로 계산하고, 기준 온도와 표시 건수 변화는 Watcher로 기록한다.

### 3. Vue 컴포넌트

기존 화면을 `WeatherParent`, `BaseDashboardCard`, `SearchBar`, `WeatherCard`로 나눴다. 검색어와 날씨 객체는 props로 전달하고 `update-query`, `select-card`, `click-detail` 이벤트를 부모가 처리한다. 각 컴포넌트의 스타일도 `<style scoped>`로 옮겼다.

`SearchBar`에는 `placeholder`와 `echoLabel`을 추가해 운영 브리핑과 트러블슈팅 검색에서 재사용한다. 이후 만든 대시보드 카드, 실습 데모, 내비게이션도 화면 역할에 따라 별도 컴포넌트로 분리했다.

### 4. Vue Router

`App.vue`에 `RouterView`를 두고, Element Plus 메뉴의 각 항목을 `RouterLink`와 연결했다. 상세보기는 `router.push()`로 `/weather/:cityId`에 이동하며, 서비스 소개와 Catch-all 404 화면도 제공한다.

기본 View에 태양광 상세, 실습 아카이브, 실습 상세, 트러블슈팅 화면을 추가해 총 8개 View로 확장했다. 모든 View는 지연 로딩하고 `meta.title`과 `scrollBehavior`로 문서 제목과 화면 전환 위치를 관리한다.

### 5. Pinia Store

`configStore`에 온도 단위 state, 단위 기호 getter, 단위 전환 action을 작성했다. `UnitToggler.vue`는 설정 패널 안에 배치하고 메인·상세 화면의 온도 표시에 함께 반영한다.

날씨, 태양광, 유가, 환율을 각각 관리하는 Store 4종을 추가했다. 단위와 테마 설정은 `localStorage`에 저장해 다시 방문해도 유지되며, 설정 패널에서 라이트·다크 테마와 온도 단위를 함께 바꿀 수 있다.

### 6. Axios와 외부 API

OpenWeather Current Weather로 사업장 날씨를 가져오고 5 Day / 3 Hour Forecast를 상세 화면에 적용했다. Open-Meteo 대기질·일사량, 전력거래소 태양광 실측, 오피넷 유가, Frankfurter 환율까지 연결했다.

요청 코드는 `services/`로 분리했다. 좌표가 먼저 필요한 요청은 순서대로 처리하고, 서로 독립적인 요청은 `Promise.all()`로 함께 실행한다. 여러 사업장의 Open-Meteo 일사량은 다중 좌표 요청 한 번으로 받고, 서버 CDN과 브라우저에 정상 응답을 30분간 캐시한다. 호출 제한이나 일시 오류가 생기면 오늘 저장한 마지막 응답과 저장 시각을 표시한다.

### 7. Element Plus

Element Plus를 메뉴, 카드, 표, 통계, 타임라인, 아코디언, 결과 화면, 설정 패널과 로딩 상태에 사용했다. 직접 만든 스타일은 Element Plus CSS 변수에 맞춰 다크 테마에서도 같은 화면 구조를 유지한다.

실습 7 화면에서는 직접 작성한 UI와 Element Plus 컴포넌트를 나란히 보여 차이를 확인할 수 있다.

### 8. 빌드와 배포

ESLint 오류를 제거하고 Vite 프로덕션 빌드를 통과시켰다. `.env`는 Git에서 제외하고 필요한 변수명만 `.env.example`에 남겼으며, `vercel.json` rewrite로 동적 경로 직접 접속과 Catch-all 화면을 처리한다.

처음에는 `VITE_` 환경변수로 API 키를 관리했지만, 이 값이 브라우저 번들에 포함되는 문제를 확인했다. 키가 필요한 OpenWeather·전력거래소·오피넷 요청을 `api/` 서버리스 함수로 옮기고 환경변수에서 `VITE_` 접두사를 제거했다. 개발 서버에서는 Vite 미들웨어가 같은 함수 파일을 실행한다.

## 개인 추가 구현

- **제조현장 운영 브리핑** — 날씨 목업을 환경 리스크·에너지 기회·비용 변수 대시보드로 확장했다.
- **사업장 6곳과 공정 정보** — 각 지역에 주요 공정과 태양광 설비 용량을 부여했다.
- **태양광 발전 분석** — 일사량을 발전량으로 환산하고 설비 크기가 다른 사업장을 등가가동시간으로 비교한다. 당일 캐시와 fallback으로 외부 API 호출 제한에도 마지막 정상 데이터를 유지한다.
- **유가·환율 카드** — 물류비와 수입 원자재 비용 판단에 필요한 지표를 보여주고, 원/달러는 30일 전 대비 증감액을 함께 표시한다.
- **설정 저장** — 온도 단위와 화면 테마를 브라우저에 저장한다.
- **실습 아카이브** — `/labs`와 `/labs/:step`에서 실습 1-8 요구사항, 개인 확장, 실행 화면을 확인할 수 있다.
- **트러블슈팅 화면** — 개발 중 해결한 27건을 카테고리와 검색으로 탐색한다.
- **API 키 보호** — 정적 프론트엔드와 서버리스 API를 분리해 클라이언트 요청에 키가 나타나지 않도록 했다.

세부 구현 과정은 [EXTENSIONS.md](EXTENSIONS.md), 문제별 원인과 해결은 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)에 보조 기록으로 남겼다.

## 외부 API

| API | 용도 | 키 | 호출 경로 |
| --- | --- | --- | --- |
| OpenWeather Current Weather | 사업장 실시간 날씨 | 필요 | 서버리스 함수 |
| OpenWeather 5 Day / 3 Hour Forecast | 단기 예보 | 필요 | 서버리스 함수 |
| 한국전력거래소 지역별 시간별 태양광 발전량 | 실측 발전량 | 필요 | 서버리스 함수 |
| 오피넷 평균 유가 | 전국·지역 유가와 추이 | 필요 | 서버리스 함수 |
| Open-Meteo Forecast | 일사량·일조시간 | 불필요 | 서버리스 함수·CDN 캐시 |
| Open-Meteo Air Quality | 미세먼지 농도 | 불필요 | 브라우저 직접 |
| Frankfurter | 주요 6개 통화 환율 | 불필요 | 브라우저 직접 |

오피넷은 CORS 헤더를 제공하지 않아 브라우저에서 직접 호출할 수 없다. 서버리스 함수를 거치면서 키 노출과 CORS가 함께 해결됐다.

대기질은 API의 유럽 AQI 대신 PM10·PM2.5 농도를 국내 CAI 구간에 대입한 간이 지수로 표시한다. 전체 CAI 오염물질과 복합오염 보정은 포함하지 않는다.

## 기술 스택

Vue 3 (Composition API), Vue Router, Pinia, Axios, Element Plus, Vite, ESLint

## 로컬 실행

Node.js 20.19 이상이 필요하다.

```bash
npm install
```

`.env.example`을 복사해 `.env`를 만들고 발급받은 키를 채운다. **`VITE_` 접두사를 붙이지 않는다.**

```bash
cp .env.example .env
```

```bash
npm run dev
```

환경변수를 수정한 경우 개발 서버를 다시 시작한다.

## 품질 검사

```bash
npm run lint:eslint -- --no-fix
```

```bash
npm run build
```

## 배포

Vercel에 배포한다. 프로젝트 환경변수에 아래 세 개를 접두사 없이 등록한다.

- `OPENWEATHER_API_KEY`
- `DATA_GO_KR_API_KEY` (URL 디코딩된 값)
- `OPINET_API_KEY`

`api/` 폴더는 별도 설정 없이 서버리스 함수로 인식된다. GitHub 저장소를 연결해 두면 `main` 브랜치에 push할 때마다 자동으로 재배포된다. 자세한 절차는 [EXTENSIONS.md](EXTENSIONS.md)의 "API 키 관리와 Vercel 배포"에 있다.

## 보조 문서

- [EXTENSIONS.md](EXTENSIONS.md) — README의 추가 기능 설명을 뒷받침하는 구현·배포 세부 기록
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — README의 수행 내용을 보완하는 문제 원인과 해결 기록
