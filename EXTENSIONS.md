# 확장 기능 및 진행 상황

날씨 애플리케이션에서 완료한 작업과 앞으로 확장할 기능을 기록한다.

## 프로젝트 구성

- 날씨 애플리케이션: `/Users/jiyeong/workspace/skala-vue`
- 문법 실습 프로젝트: `/Users/jiyeong/workspace/skala-vue-practices`
- 원본 백업: `/Users/jiyeong/workspace/skala-vue-backup`

## 서비스 컨셉

**제조현장 데일리 운영 브리핑** (Factory Daily Briefing)

공장 운영 담당자가 출근길에 확인하는, 오늘의 공정 컨디션 브리핑이다.

공정은 날씨 하나로만 결정되지 않는다. 기온·습도 같은 환경 조건은 공정 품질에, 일조량은 태양광 자가발전량과 전력비 절감 여력에, 유가와 환율은 물류·연료비와 원자재 수입 단가에 영향을 준다. 흩어져 있는 세 지표를 한 화면에 묶어 담당자가 아침에 5초 안에 "오늘 무엇을 신경 써야 하는지" 판단할 수 있게 돕는 것이 목적이다.

| 축 | 내용 | 데이터 출처 |
| --- | --- | --- |
| 환경 리스크 | 사업장별 기온·습도로 공정 품질 변수 확인 | OpenWeather, Open-Meteo Air Quality |
| 에너지 기회 | 일사량 기반 태양광 자가발전 기대치와 실측 비교 | Open-Meteo Forecast, 한국전력거래소 |
| 비용 변수 | 물류·연료비와 원자재 수입 단가 방향 확인 | 오피넷, Frankfurter |

가상의 사업장 6곳(서울·부산·대구·광주·대전·울산)을 관측 대상으로 두고, 각 사업장에 주요 공정과 태양광 설비 용량을 부여했다. 마스터 데이터는 `src/data/sites.js`에 있다.

## 화면 구성

```text
제조현장 데일리 운영 브리핑
├── 운영 브리핑 (/)                    통합 대시보드: 환경·에너지·비용 카드
│   ├── 사업장 기상 상세 (/weather/:cityId)
│   └── 태양광 발전 상세 (/solar/:region)
├── 서비스 소개 (/about)               컨셉·핵심 가치·사업장·기술 스택
├── 실습 아카이브 (/labs)              실습 1~8 타임라인
│   └── 실습 상세 (/labs/:step)        요구사항·확장 내역·당시 결과물 실행
├── 트러블슈팅 (/troubleshooting)      개발 중 겪은 문제 17건
└── 404 (Catch-all)
```

## 완료한 작업

### 과제 4: Vue Router

- 날씨 대시보드와 서비스 소개 링크가 있는 Navigation Bar를 추가했다.
- 페이지가 표시될 `<RouterView />`를 배치했다.
- 다음 라우트를 추가했다.
  - `/`
  - `/about`
  - `/weather/:cityId`
  - `/:pathMatch(.*)*`
- 날씨 카드에서 상세 페이지로 이동하는 Programmatic Navigation을 적용했다.
- 날씨 상세, 서비스 소개, Not Found 페이지를 작성했다.
- 보조 View에 Lazy Loading을 적용했다.

### 과제 5: Pinia Store

- `main.js`에 Pinia를 등록했다.
- `configStore.js`에 다음 항목을 작성했다.
  - `unit` state
  - `unitSymbol` getter
  - `toggleUnit` action
- Navigation Bar에 `UnitToggler.vue`를 배치했다.
- 날씨 카드에 섭씨·화씨 변환을 적용했다.
- 날씨 상세 페이지에도 동일한 단위 변환을 적용했다.
- Store 및 Axios 적용 전 백업 파일을 보존했다.

### 과제 6: Axios 및 OpenWeather

- Axios를 설치했다.
- OpenWeather API 키를 발급하고 Postman으로 확인했다.
- `.env`를 `.gitignore`에 등록했다.
- 날씨 대시보드를 OpenWeather Current Weather API와 연결했다.
- 서울, 부산, 대구, 광주, 대전, 울산 날씨를 병렬로 요청하도록 구성했다.
- OpenWeather 응답을 기존 날씨 카드 데이터 구조로 변환했다.
- 상세 페이지의 Mock Data를 실제 OpenWeather 요청으로 교체했다.
- 로딩, 검색 결과 없음, API 오류 상태를 추가했다.
- API 키 값을 출력하지 않고 OpenWeather 연결을 확인했다.
- OpenWeather 5 Day Forecast API를 추가해 상세 화면에 3시간 간격 단기 예보를 표시했다.
- Open-Meteo Air Quality API를 추가해 미세먼지와 대기질 지수를 표시했다.
- API 요청을 `src/services/weatherApi.js`에 모아 화면과 통신 코드를 분리했다.

### 과제 7: 외부 UI 라이브러리

- 교재에서 다룬 Element Plus를 프로젝트에 등록했다.
- 카드, 버튼, API 로딩 화면에 Element Plus 컴포넌트와 디렉티브를 적용했다.
- 과제 6 상태의 `App.vue`를 `src/App.vue.beforeUI`에 보존했다.

### 과제 8: 품질 관리 및 배포 준비

- ESLint 검사와 Vite 프로덕션 빌드를 완료했다.
- `.env.example`을 추가하고 실제 `.env`가 Git에서 제외되는지 확인했다.
- Vue Router의 직접 주소 접속을 위한 `vercel.json`을 추가했다.
- 설치, 실행, 검사, 배포 방법을 `README.md`에 정리했다.
- 과제 7 상태의 `App.vue`를 `src/App.vue.beforeQuality`에 보존했다.

### 확장 기능: 통합 운영 브리핑

과제 요구 화면(홈·소개·상세·404)을 유지하면서 다음을 얹었다.

**신규 View 4종 (과제 4 요구사항 6: 본인의 추가 view 작성 및 Routing)**

- `SolarDetailView.vue` — `/solar/:region`. 시간대별 일사량 예보와 전력거래소 실측 발전량을 막대 그래프로 비교한다.
- `LabArchiveView.vue` — `/labs`. 실습 1~8단계를 `el-timeline`으로 정리했다.
- `LabDetailView.vue` — `/labs/:step`. 단계별 요구사항과 개인 확장 내역을 보여주고, **8단계 모두 실행 화면을 제공한다.**

실습 1~3단계는 당시 작성한 컴포넌트를 그대로 렌더링하고, 화면 결과물이 없는 4~8단계는 그 단계의 핵심 개념을 직접 조작해 볼 수 있는 데모 컴포넌트를 만들었다. 데모는 설명용 목업이 아니라 **현재 실행 중인 앱의 실제 값을 읽어 온다.**

| 단계 | 실행 화면 | 내용 |
| --- | --- | --- |
| 1 | `WeatherMockup` | 당시 목업 화면 그대로 |
| 2 | `WeatherComposition` | 당시 반응형 화면 그대로 |
| 3 | `WeatherParent` | 당시 컴포넌트 분리 결과 그대로 |
| 4 | `Lab4RouterDemo` | 등록된 라우트 표, 현재 route 정보, 주소를 입력하면 이동 없이 매칭 결과 확인 |
| 5 | `Lab5StoreDemo` | Store 5종의 실시간 state·getter, 단위 토글로 반응형 확인 |
| 6 | `Lab6AxiosDemo` | API 7종을 실제로 호출해 상태 코드·소요 시간·원본 JSON 표시 |
| 7 | `Lab7UiDemo` | 같은 UI를 직접 만든 버전과 Element Plus 버전으로 나란히 비교 |
| 8 | `Lab8QualityDemo` | 환경변수 주입 상태(값 비노출), 빌드 정보, Catch-all 확인, 품질 체크리스트 |

데모 컴포넌트는 `src/components/lab/`에 두어 실습 부품 컴포넌트(`components/exercise/`)와 구분했다. `Lab8QualityDemo`는 API 키의 **주입 여부와 길이만** 표시하고 값은 절대 출력하지 않는다.
- `TroubleshootingView.vue` — `/troubleshooting`. 트러블슈팅 17건을 카테고리 필터와 검색으로 탐색한다.

라우터에는 `meta.title`(문서 제목 자동 변경)과 `scrollBehavior`(화면 전환 시 상단 이동)를 추가했고, 8개 View 전부에 지연 로딩을 적용했다.

**신규 Store 4종 (과제 5 요구사항 4: 본인만의 추가 Store)**

| Store | state | getters | actions |
| --- | --- | --- | --- |
| `weatherStore` | 사업장 날씨, 경보 기준 온도·습도 | `riskySites`, `summary`, `getWeatherById` | `fetchAllSites`, `setTempThreshold` |
| `solarStore` | 일사량 예측, 전력거래소 실측 | `totalGenerationToday`, `expectedSavingToday`, `bestSite`, `getActualByRegion` | `fetchAllSites`, `fetchOneRegion`, `fetchActual` |
| `fuelStore` | 전국·지역 유가, 최근 추이 | `dieselPrice`, `trendChangeRate`, `costComment`, `regionalDiesel` | `fetchFuelPrices` |
| `exchangeStore` | 주요 통화 환율, 원/달러 추이 | `majorRates`, `changeRate`, `costComment`, `historyRange` | `fetchRates` |

기존 `configStore`(단위 설정)까지 합쳐 Store는 총 5개다.

**API 확장 (과제 6 요구사항 2·3)**

| API | 용도 | 키 | CORS |
| --- | --- | --- | --- |
| OpenWeather Current Weather | 사업장 실시간 날씨 | 필요 | 허용 |
| OpenWeather 5 Day / 3 Hour Forecast | 단기 예보 | 필요 | 허용 |
| Open-Meteo Air Quality | 대기질·미세먼지 | 불필요 | 허용 |
| Open-Meteo Forecast | 일사량·일조시간 | 불필요 | 허용 |
| 한국전력거래소 지역별 시간별 태양광 발전량 | 실측 발전량 | 필요 | 허용 |
| 오피넷 평균 유가 | 전국·지역 유가, 최근 추이 | 필요 | **차단 (프록시 필요)** |
| Frankfurter | 주요 6개 통화 환율 | 불필요 | 허용 |

오피넷만 `Access-Control-Allow-Origin` 헤더를 주지 않아 개발 서버는 `vite.config.js`의 `server.proxy`로, 배포 환경은 `vercel.json`의 `rewrites`로 우회한다.

태양광 발전량은 일사량(kWh/m²) × 설비용량(kWp) × 성능비(0.8)로 추정하고, 산업용 전력 단가 165원/kWh를 곱해 절감액을 표시한다.

**Element Plus 적용 확대 (과제 7)**

`el-menu`, `el-table`, `el-statistic`, `el-timeline`, `el-collapse`, `el-result`, `el-descriptions`, `el-page-header`, `el-progress`, `el-alert`, `el-tag`, `el-radio-group`, `el-empty`, `el-card`, `el-button`, `v-loading`을 사용했다.

**기본 문법 요구사항 보강**

- 과제 2 요구사항 5: `WeatherComposition.vue`에 `alertThreshold`·`sortOrder` 반응형 상태, `sortedWeatherList`·`processRiskSummary` Computed, Watcher 2종을 추가했다.
- 과제 3 요구사항 5: 컴포넌트 디자인을 각 파일의 `<style scoped>`로 분리하고 전역 CSS에는 앱 셸 규칙만 남겼다.
- 과제 4 요구사항 1: 홈 라우트를 정적 import에서 지연 로딩으로 바꿔 모든 View를 코드 분할했다.
- 실습 컴포넌트를 명세와 동일하게 `components/exercise/`로 격리하고, View 파일명을 `WeatherHomeView` 형태로 통일했다.

## 현재 API 데이터 매핑

| 애플리케이션 데이터 | OpenWeather 응답 |
| --- | --- |
| 도시 | `name` 또는 내부 도시 매핑 |
| 기온 | `main.temp` |
| 날씨 상태 | `weather[0].description` |
| 습도 | `main.humidity` |
| 풍속 | `wind.speed` |

## API 키 관리와 Vercel 배포

### 먼저 알아야 할 것: .gitignore와 브라우저 노출은 다른 문제다

`.env`를 `.gitignore`에 넣으면 **GitHub 저장소**에는 키가 올라가지 않는다. 하지만 그것만으로 키가 감춰지지는 않는다.

`VITE_` 접두사가 붙은 환경변수는 빌드 시점에 **클라이언트 번들 안에 문자열로 그대로 삽입**된다. 즉 배포된 사이트에서 개발자 도구를 열면 누구나 키를 볼 수 있다. 직접 확인할 수 있다.

```bash
npm run build
grep -ro "본인_키_앞_8자리" dist/assets/ | head
```

정리하면 두 가지는 서로 다른 목적이다.

| 조치 | 막아 주는 것 | 막지 못하는 것 |
| --- | --- | --- |
| `.gitignore`에 `.env` 등록 | GitHub 저장소에 키가 남는 것 | 배포 사이트에서 키가 보이는 것 |
| Vercel 환경변수 등록 | 저장소·소스코드에 키가 남는 것 | 배포 사이트에서 키가 보이는 것 |
| 서버리스 함수 프록시 | 위 두 가지 모두 | — (과제 범위 밖) |

프론트엔드 실습 과제에서는 앞의 두 가지까지 하는 것이 표준이다. 다만 "왜 이것만으로는 부족한지"를 알고 있어야 한다.

### Vercel 배포 절차

**1단계 — 저장소 연결**

Vercel에 로그인한 뒤 `Add New... > Project`에서 GitHub 저장소 `skala-vue`를 Import한다. Vite 프로젝트는 자동 인식되며 아래 설정이 기본값으로 잡힌다.

| 항목 | 값 |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

**2단계 — 환경변수 등록 (가장 중요)**

`Settings > Environment Variables`에서 아래 세 개를 등록한다. `.env` 파일은 Git에 올라가지 않으므로, 등록하지 않으면 배포본에서 API 호출이 전부 실패한다.

| Key | 비고 |
| --- | --- |
| `VITE_OPENWEATHER_API_KEY` | OpenWeather 발급 키 |
| `VITE_DATA_GO_KR_API_KEY` | 공공데이터포털 인증키를 **URL 디코딩한** 값 |
| `VITE_OPINET_API_KEY` | 오피넷 발급 키 |

주의할 점.

- Environment는 `Production`, `Preview`, `Development` 세 곳에 모두 체크한다. 하나라도 빠지면 해당 환경에서만 조용히 실패한다.
- 값 앞뒤에 따옴표를 붙이지 않는다. 따옴표까지 값으로 들어간다.
- 공공데이터포털 키는 포털이 안내하는 인코딩된 키(`%2F`, `%3D` 포함)가 아니라 **디코딩된 원본**을 넣어야 한다. 인코딩된 값을 넣으면 Axios가 다시 인코딩해 `SERVICE_KEY_IS_NOT_REGISTERED_ERROR`가 발생한다.
- 환경변수를 추가하거나 수정한 뒤에는 **반드시 재배포**해야 반영된다. `VITE_` 변수는 빌드 시점에 번들에 박히기 때문에, 값만 바꾸고 재배포하지 않으면 이전 값이 그대로 서비스된다. `Deployments` 탭에서 최신 배포의 `Redeploy`를 누른다.

**3단계 — 배포 후 확인**

- `/`, `/about`, `/labs`, `/troubleshooting` 이동
- `/weather/city_01`, `/solar/ulsan` **주소창에 직접 입력해서** 접속 (`vercel.json` rewrite 동작 확인)
- 존재하지 않는 주소로 접속해 404 화면 확인
- 유가 카드가 표시되는지 확인 (오피넷 프록시 rewrite 동작 확인)
- 시크릿 창으로 GitHub 저장소에 접속해 로그인 없이 소스가 보이는지 확인

### 키 보호를 위한 추가 조치

배포 사이트에서 키가 보이는 것을 전제로, 피해 범위를 줄이는 조치를 함께 한다.

- **OpenWeather**: 무료 플랜은 분당 60회 제한이 있다. 키가 유출되어 한도를 초과하면 서비스가 멈추므로, 과제 제출 후 키를 폐기하고 재발급하는 것이 안전하다.
- **공공데이터포털**: 개발계정은 일일 트래픽 제한(기본 1,000건)이 있다. 마이페이지에서 사용량을 주기적으로 확인한다.
- **오피넷**: 무료 키는 일일 호출 제한이 있다. 대시보드 진입마다 3회를 호출하므로 Store에 중복 호출 방지 가드를 넣어 두었다.

### 완전히 숨기려면 (과제 범위 밖)

클라이언트가 외부 API를 직접 부르지 않는 구조로 바꿔야 한다. Vercel 기준으로는 프로젝트 최상위에 `api/` 폴더를 만들고 서버리스 함수를 두는 방식이다.

```text
api/
└── weather.js        # process.env.OPENWEATHER_API_KEY 로 키를 읽어 외부 API 호출
```

이때 환경변수 이름에서 `VITE_` 접두사를 **떼야** 한다. `VITE_`가 붙으면 클라이언트 번들에 노출되기 때문이다. 브라우저는 `/api/weather`만 호출하고 키는 서버에만 남는다. 이 구조로 가면 오피넷 rewrite도 함수 안에서 처리할 수 있어 `vercel.json` 프록시가 필요 없어진다.

## 앞으로 진행할 작업

### Vercel 배포

- GitHub 저장소를 Vercel에 연결하고 실제 배포 주소를 발급받는다.
- 위의 환경변수 3종을 등록하고 재배포한다.
- 모든 라우트와 상세 페이지 직접 접속을 확인한다.
- 배포 주소를 README.md에 기록한다.

### 제출 전 정리

- `.env` 또는 실제 API 키가 Git 이력에 포함되지 않았는지 확인한다.
- 최종 제출본에서도 ESLint와 프로덕션 빌드를 다시 실행한다.
- 내비게이션, 단위 변경, API 로딩·오류 처리, 404 화면을 확인한다.
- 시크릿 창으로 저장소 접근을 확인한다.

### 여유가 되면

- 서버리스 함수로 API 키를 서버 측으로 옮긴다.
- Element Plus를 필요한 컴포넌트만 가져오도록 바꿔 번들 크기를 줄인다.
- 단위 변환 로직이 여러 화면에 중복되므로 Composable로 추출한다.

## 문서 관리 규칙

의미 있는 변경이 있을 때 다음 원칙으로 문서를 갱신한다.

1. 다시 활용할 수 있는 기술적 문제와 해결 방법은 `TROUBLESHOOTING.md`에 기록한다.
2. 완료한 작업과 다음 작업은 이 문서에 반영한다.
3. 단순 철자나 일회성 변수명 오타는 기록하지 않는다.
4. API 키, 토큰, 비밀번호 등 비밀값을 기록하지 않는다.
5. 작업 완료 전 ESLint와 빌드를 확인한다.
