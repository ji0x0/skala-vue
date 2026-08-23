# 확장 기능 및 진행 상황

날씨 애플리케이션에서 완료한 작업과 앞으로 확장할 기능을 기록한다.

## 프로젝트 구성

- 배포 주소: https://skala-vue-factory-daily-briefing.vercel.app
- 저장소: https://github.com/ji0x0/skala-vue

## 서비스 컨셉

**제조현장 데일리 운영 브리핑** (Factory Daily Briefing)

공장 운영 담당자가 출근길에 확인하는, 오늘의 공정 컨디션 브리핑이다.

공정은 날씨 하나로만 결정되지 않는다. 기온·습도 같은 환경 조건은 공정 품질에, 일조량은 태양광 자가발전량과 전력비 절감 여력에, 유가와 환율은 물류·연료비와 원자재 수입 단가에 영향을 준다. 흩어져 있는 세 지표를 한 화면에 묶어 담당자가 아침에 5초 안에 "오늘 무엇을 신경 써야 하는지" 판단할 수 있게 돕는 것이 목적이다.

| 축 | 내용 | 데이터 출처 |
| --- | --- | --- |
| 환경 리스크 | 사업장별 기온·습도와 대기질로 공정 품질 변수 확인 | OpenWeather, Open-Meteo Air Quality |
| 에너지 기회 | 일사량 기반 태양광 자가발전 기대치와 실측 비교 | Open-Meteo Forecast, 한국전력거래소 |
| 비용 변수 | 물류·연료비와 원자재 수입 단가 방향 확인 | 오피넷, Frankfurter |

가상의 사업장 6곳(서울·부산·대구·광주·대전·울산)을 관측 대상으로 두고, 각 사업장에 주요 공정과 태양광 설비 용량을 부여했다. 마스터 데이터는 `src/data/sites.js`에 있다.

## 화면 구성

```text
제조현장 데일리 운영 브리핑
├── 운영 브리핑 (/)                    통합 대시보드: 환경·에너지·비용 카드
│   ├── 사업장 기상 상세 (/weather/:cityId)
│   └── 태양광 발전 상세 (/solar/:region)
├── 서비스 소개 (/about)               컨셉·핵심 가치·판단 기준·사업장·기술 스택
├── 실습 아카이브 (/labs)              실습 1-8 타임라인
│   └── 실습 상세 (/labs/:step)        요구사항·확장 내역·실행 화면
├── 트러블슈팅 (/troubleshooting)      개발 중 겪은 문제 27건
└── 404 (Catch-all)
```

## 과제별 완료 내역

### 과제 1-3: 기본 문법

- 목업 화면을 `v-for`, `v-if`, 이벤트 수식어로 구성했다.
- `ref`, `computed`, `watch`, `watchEffect`로 검색과 필터링을 반응형으로 처리했다.
- 하나의 화면을 `WeatherParent`, `BaseDashboardCard`, `SearchBar`, `WeatherCard` 네 컴포넌트로 나누고, 각 컴포넌트의 디자인을 `<style scoped>`로 분리했다.

### 과제 4: Vue Router

- 내비게이션 바(`RouterLink`)와 메인 콘텐츠 영역(`RouterView`)을 배치했다.
- `/`, `/about`, `/weather/:cityId`, Catch-all 라우트를 등록했다.
- 상세보기에서 `window.alert()`를 제거하고 `router.push()`로 이동하도록 바꿨다.
- 모든 View에 지연 로딩을 적용했다.

### 과제 5: Pinia Store

- `configStore.js`에 `unit` state, `unitSymbol` getter, `toggleUnit` action을 작성했다.
- 내비게이션 바 옆에 단위 설정 UI를 배치하고, 메인과 상세 화면 모두에 반영했다.

### 과제 6: Axios 및 외부 API

- OpenWeather API 키를 발급하고 `.env`를 `.gitignore`에 등록했다.
- 사업장 6곳의 날씨를 `Promise.all`로 병렬 요청하고, 응답을 화면 데이터 구조로 변환했다.
- 상세 페이지의 Mock Data를 실제 요청으로 교체하고 로딩·검색 결과 없음·오류 상태를 추가했다.
- OpenWeather 5 Day Forecast, Open-Meteo Air Quality를 추가했다.
- API 요청을 `src/services/`로 모아 화면과 통신 코드를 분리했다.

### 과제 7: 외부 UI 라이브러리

- Element Plus를 등록하고 카드, 버튼, 로딩 화면에 적용했다.

### 과제 8: 품질 관리 및 배포

- ESLint 검사와 프로덕션 빌드를 통과시켰다.
- `.env.example`을 추가하고 실제 `.env`가 Git에서 제외되는지 확인했다.
- SPA 직접 주소 접속을 위한 `vercel.json` rewrite를 추가했다.

## 확장 기능

### 신규 View 4종 (과제 4 요구사항 6)

- `SolarDetailView.vue` — `/solar/:region`. 시간대별 일사량 예보와 전력거래소 실측 발전량을 막대 그래프로 비교한다.
- `LabArchiveView.vue` — `/labs`. 실습 1-8단계를 `el-timeline`으로 정리했다.
- `LabDetailView.vue` — `/labs/:step`. 단계별 요구사항과 개인 확장 내역을 보여주고, **8단계 모두 실행 화면을 제공한다.**
- `TroubleshootingView.vue` — `/troubleshooting`. 트러블슈팅 27건을 카테고리 필터와 검색으로 탐색한다.

라우터에는 `meta.title`(문서 제목 자동 변경)과 `scrollBehavior`(화면 전환 시 상단 이동)를 추가했고, 8개 View 전부에 지연 로딩을 적용했다.

실습 1-3단계는 당시 작성한 컴포넌트를 그대로 렌더링하고, 화면 결과물이 없는 4-8단계는 그 단계의 핵심 개념을 직접 조작해 볼 수 있는 데모 컴포넌트를 만들었다. 데모는 설명용 목업이 아니라 **현재 실행 중인 앱의 실제 값을 읽어 온다.**

| 단계 | 실행 화면 | 내용 |
| --- | --- | --- |
| 1 | `WeatherMockup` | 당시 목업 화면 그대로 |
| 2 | `WeatherComposition` | 당시 반응형 화면 그대로 |
| 3 | `WeatherParent` | 당시 컴포넌트 분리 결과 그대로 |
| 4 | `Lab4RouterDemo` | 등록된 라우트 표, 현재 route 정보, 주소를 입력하면 이동 없이 매칭 결과 확인 |
| 5 | `Lab5StoreDemo` | Store 5종의 실시간 state·getter, 설정 토글로 전역 반응성 확인 |
| 6 | `Lab6AxiosDemo` | API 7종을 실제로 호출해 상태 코드·소요 시간·원본 JSON 표시 |
| 7 | `Lab7UiDemo` | 같은 UI를 직접 만든 버전과 Element Plus 버전으로 나란히 비교 |
| 8 | `Lab8QualityDemo` | 환경변수 접근 시도 결과, 빌드 정보, Catch-all 확인, 품질 체크리스트 |

데모 컴포넌트는 `src/components/lab/`에 두어 실습 부품 컴포넌트(`components/exercise/`)와 구분했다. `Lab8QualityDemo`는 API 키에 접근을 시도한 결과만 표시하고 값은 절대 출력하지 않는다.

### 신규 Store 4종 (과제 5 요구사항 4)

| Store | state | getters | actions |
| --- | --- | --- | --- |
| `weatherStore` | 사업장 날씨, 경보 기준 온도·습도 | `riskySites`, `summary`, `getWeatherById` | `fetchAllSites`, `setTempThreshold` |
| `solarStore` | 일사량 예측, 전력거래소 실측 | `totalGenerationToday`, `expectedSavingToday`, `rankedSites`, `bestSite`, `getActualByRegion` | `fetchAllSites`, `fetchOneRegion`, `fetchActual` |
| `fuelStore` | 전국·지역 유가, 최근 추이 | `dieselPrice`, `trendChangeRate`, `costComment`, `regionalDiesel` | `fetchFuelPrices` |
| `exchangeStore` | 주요 통화 환율, 원/달러 추이 | `majorRates`, `changeRate`, `costComment`, `historyRange` | `fetchRates` |

기존 `configStore`까지 합쳐 Store는 총 5개다. `configStore`에는 화면 테마(라이트/다크) state와 action을 추가했고, 단위와 테마 모두 `localStorage`에 저장해 다시 방문해도 유지된다.

### 설정 패널

내비게이션의 "단위 변경" 버튼을 "설정 변경" 패널로 바꿨다. `el-popover` 안에 `el-switch` 두 개를 두어 화면 테마와 온도 단위를 한곳에서 조정한다.

다크 모드는 Element Plus의 `theme-chalk/dark/css-vars.css`를 불러오고 `html`에 `dark` 클래스를 토글하는 방식이다. 직접 작성한 스타일에 하드코딩되어 있던 색상 118곳을 Element Plus의 CSS 변수(`--el-bg-color`, `--el-text-color-primary`, `--el-border-color` 등)로 바꿔 테마에 따라 함께 바뀌도록 했다. 다만 배지처럼 고정 강조색 배경 위의 글자는 흰색으로 유지했다.

### API 확장 (과제 6 요구사항 2·3)

| API | 용도 | 키 | CORS |
| --- | --- | --- | --- |
| OpenWeather Current Weather | 사업장 실시간 날씨 | 필요 | 허용 |
| OpenWeather 5 Day / 3 Hour Forecast | 단기 예보 | 필요 | 허용 |
| Open-Meteo Air Quality | 미세먼지 농도 | 불필요 | 허용 |
| Open-Meteo Forecast | 일사량·일조시간 | 불필요 | 허용 |
| 한국전력거래소 지역별 시간별 태양광 발전량 | 실측 발전량 | 필요 | 허용 |
| 오피넷 평균 유가 | 전국·지역 유가, 최근 추이 | 필요 | **차단** |
| Frankfurter | 주요 6개 통화 환율 | 불필요 | 허용 |

### 지표 계산 방식

화면에 표시하는 경보와 코멘트는 아래 기준으로 계산한다. 서비스 소개 화면에도 같은 내용을 표로 실었고, 표에 적히는 값은 각 Store에서 실제로 쓰는 값을 읽어 온다. 기준을 바꾸면 설명도 함께 바뀌므로 문서와 동작이 어긋나지 않는다.

| 지표 | 계산식 |
| --- | --- |
| 공정 점검 대상 | 기온 30℃ 이상 또는 습도 80% 이상 |
| 태양광 예상 발전량 | 일사량(kWh/m²) × 설비용량(kWp) × 성능비 0.8 |
| 등가가동시간 | 오늘 발전량(kWh) ÷ 설비용량(kWp) |
| 발전 여건 등급 | 4.5시간 이상 좋음, 3.4시간 이상 보통, 그 미만 낮음 |
| 전력비 절감액 | 예상 발전량(kWh) × 165원 |
| 대기질 등급 | 환경부 통합대기환경지수(CAI) |
| 유가 추세 | 최근 7일 등락률 ±0.5% 초과 시 상승·하락 |
| 환율 추세 | 최근 30일 등락률 ±1% 초과 시 강세·약세 |

사업장마다 설비 용량이 달라 발전량 절대값만으로는 여건을 비교할 수 없다. 처음에는 임의로 정한 일사량 기준값과 견주어 백분율로 보여줬는데, 기준을 어떻게 잡느냐에 따라 값이 달라지고 맑은 날에는 여러 사업장이 모두 100%로 표시되어 구분이 되지 않았다. 태양광에서 널리 쓰는 등가가동시간으로 바꿔 임의 가정을 없앴다.

등급을 나누는 경계값도 근거를 두었다. 국내 태양광 연평균 일 등가가동시간이 약 3.4시간(연평균 이용률 약 14%, 24시간 × 0.14)이므로 이 값을 보통의 하한으로 삼고, 봄·여름 맑은 날에 해당하는 4.5시간을 좋음의 하한으로 삼았다.

대기질은 Open-Meteo가 내려주는 `european_aqi`를 쓰지 않는다. 유럽 기준은 국내 환경부 기준과 구간이 달라 같은 농도라도 등급이 어긋난다. 같은 응답의 PM10·PM2.5 농도로 CAI를 직접 계산해 국내 예보와 등급을 맞췄다.

### 실습 패턴의 재사용

실습에서 익힌 구조를 아카이브에만 두지 않고 실제 운영 화면에 적용했다.

- 운영 브리핑의 환경 리스크 카드에 사업장 검색을 넣었다. `v-model` 대신 `:value`와 `@input`으로 다뤄 한글 조합 중에도 입력이 끊기지 않는다.
- 상태 옆 상세보기 버튼에 `@click.stop`을 붙여 행 클릭 이벤트와 분리했다.
- 표 아래 상태바를 두어 고른 사업장을 알리고, 아무것도 고르지 않았을 때는 등록된 사업장 수를 표시한다.
- 트러블슈팅 검색도 같은 `SearchBar` 컴포넌트를 쓴다. `placeholder`와 `echoLabel` props를 추가해 두 곳에서 함께 쓸 수 있게 했고, 기존 props와 emits 구조는 그대로 유지했다.
- 설정 패널의 단위 전환은 과제 5에서 만든 `UnitToggler` 부품을 그대로 쓴다. 패널은 여기에 테마 전환을 더한 껍데기 역할만 한다.

### Element Plus 적용 범위 (과제 7)

`el-menu`, `el-table`, `el-statistic`, `el-timeline`, `el-collapse`, `el-result`, `el-descriptions`, `el-page-header`, `el-popover`, `el-switch`, `el-alert`, `el-tag`, `el-radio-group`, `el-empty`, `el-card`, `el-button`, `v-loading`을 사용했다.

## API 키 관리와 Vercel 배포

### 왜 서버리스 함수로 옮겼나

처음에는 API 키를 `VITE_OPENWEATHER_API_KEY` 처럼 `VITE_` 접두사를 붙여 `.env`에 두고, `.gitignore`로 저장소 노출만 막았다. 하지만 이것만으로는 부족하다.

`VITE_` 접두사가 붙은 변수는 빌드 시점에 **클라이언트 번들 안에 문자열로 삽입**된다. 저장소에는 없지만 배포된 JS 파일 안에는 그대로 들어 있어서, 개발자 도구를 열면 누구나 볼 수 있었다.

```bash
# 옮기기 전
grep -ro "발급받은_키" dist/assets/
# dist/assets/WeatherHomeView-xxxx.js:발급받은_키   ← 키가 그대로 보인다
```

원인은 단순하다. 브라우저가 외부 API를 **직접** 호출하기 때문이다. 요청을 보내려면 키가 브라우저 안에 있어야 하고, 브라우저 안에 있으면 볼 수 있다. 난독화나 인코딩은 의미가 없다. Network 탭에 요청 URL이 그대로 찍힌다.

### 구조를 이렇게 바꿨다

```text
[이전] 브라우저 ──(키 포함)──> OpenWeather                    키 노출
[현재] 브라우저 ──(키 없음)──> /api/* ──(키 추가)──> OpenWeather   키는 서버에만
```

`api/` 폴더의 파일은 Vercel이 자동으로 서버리스 함수로 띄운다. 브라우저는 `/api/openweather?path=weather&q=Seoul,KR` 처럼 키가 없는 주소만 호출하고, 키는 함수 안에서 붙인다.

| 함수 | 담당 API | 해결한 문제 |
| --- | --- | --- |
| `api/openweather.js` | 현재 날씨, 단기 예보 | 키 노출 |
| `api/kpx.js` | 전력거래소 태양광 실측 | 키 노출 |
| `api/opinet.js` | 전국·지역 유가 | 키 노출 + CORS 차단 |

키가 필요 없는 Open-Meteo와 Frankfurter는 브라우저에서 그대로 호출한다. 서버를 거칠 이유가 없다.

함수는 호출 가능한 경로를 화이트리스트로 제한했다. 그렇게 하지 않으면 아무 주소나 대신 호출해 주는 열린 프록시가 된다.

### 가장 중요한 규칙: VITE_ 접두사를 뗀다

| 변수명 | 어디까지 노출 |
| --- | --- |
| `VITE_OPENWEATHER_API_KEY` | 클라이언트 번들에 삽입 → **보임** |
| `OPENWEATHER_API_KEY` | 서버 함수만 접근 → **안 보임** |

함수를 만들어도 접두사가 붙어 있으면 여전히 번들에 박힌다. `.env`와 Vercel 환경변수 양쪽 모두 접두사 없는 이름을 써야 한다.

### 정적 호스팅은 그대로다

`api/` 폴더를 추가해도 Vue 앱은 여전히 정적 파일(`dist/`)로 배포된다. 서버리스 함수는 같은 도메인에 엔드포인트 몇 개를 얹는 것뿐이고, Vercel 무료 플랜에 포함된다. 과제의 "정적 웹 호스팅" 요건은 그대로 충족한다.

다만 GitHub Pages는 서버 코드를 실행할 수 없어 이 방식을 쓸 수 없다.

### 로컬 개발은 npm run dev 그대로

Vite 개발 서버는 서버리스 함수를 실행하지 않아서, 그냥 두면 `/api/*`가 404가 된다. `vite.config.js`에 플러그인을 추가해 **같은 파일을 미들웨어로 실행**하도록 했다.

```js
const env = loadEnv(mode, process.cwd(), '')  // 세 번째 인자가 빈 문자열이면 VITE_ 없는 변수도 읽는다
Object.assign(process.env, env)
```

읽은 값은 `process.env`에만 넣으므로 클라이언트 번들에는 포함되지 않는다. 함수 코드가 한 벌이라 로컬과 배포가 갈라지지 않고, `vercel dev` 같은 별도 도구 없이 개발할 수 있다.

### 확인 방법

빌드 후 실제 키 값을 검색해 0건이면 성공이다.

```bash
npm run build
grep -r "발급받은_키" dist/assets/
```

앱 화면에서도 확인할 수 있다. `/labs/8` 데모가 클라이언트에서 세 키에 접근을 시도해 결과를 표시하고, 클라이언트 번들이 실제로 가진 환경변수 전체를 나열한다. API 키 이름은 하나도 없다.

### Vercel 배포 절차

**1단계 — 저장소 연결**

`Add New... > Project`에서 GitHub 저장소를 Import한다. Vite 프로젝트로 자동 인식되며 Build Command는 `npm run build`, Output Directory는 `dist`이다. `api/` 폴더는 별도 설정 없이 함수로 인식된다.

**2단계 — 환경변수 등록**

`Settings > Environment Variables`에서 아래 세 개를 등록한다. **`VITE_` 접두사를 붙이지 않는다.**

| Key | 비고 |
| --- | --- |
| `OPENWEATHER_API_KEY` | OpenWeather 발급 키 |
| `DATA_GO_KR_API_KEY` | 공공데이터포털 인증키를 **URL 디코딩한** 값 |
| `OPINET_API_KEY` | 오피넷 발급 키 |

주의할 점.

- Environment는 `Production`, `Preview`, `Development` 세 곳에 모두 체크한다.
- 값 앞뒤에 따옴표를 붙이지 않는다.
- 공공데이터포털 키는 인코딩된 값(`%2F`, `%3D` 포함)이 아니라 디코딩된 원본을 넣는다.
- 환경변수를 추가·수정한 뒤에는 재배포해야 반영된다.

**3단계 — 배포 후 확인**

- `/`, `/about`, `/labs`, `/troubleshooting` 이동
- `/weather/city_01`, `/solar/ulsan` 을 **주소창에 직접 입력**해서 접속 (rewrite 동작 확인)
- 존재하지 않는 주소로 404 화면 확인
- `/labs/8` 에서 세 키가 모두 "읽을 수 없음"인지 확인
- 개발자 도구 Network 탭에서 요청 주소에 키가 없는지 확인
- 시크릿 창으로 GitHub 저장소가 로그인 없이 보이는지 확인

**도메인**

Vercel이 프로젝트 생성 시 임의의 주소를 프로젝트 도메인으로 등록한다. 이 주소는 배포할 때마다 다시 붙으므로, 별칭만 지우면 다음 배포에서 되살아난다. 프로젝트 도메인 목록에서 제거해야 완전히 없어진다.

### 그래도 남는 것

키가 서버로 옮겨졌어도, 누구나 `/api/*`를 호출할 수 있다는 점은 남는다. 실제 서비스라면 호출 횟수 제한이나 요청 출처 검증을 함수 안에 추가한다. 과제 범위에서는 다루지 않았다.

과제 제출과 평가가 끝나면 세 개 키를 폐기하고 재발급하는 것이 안전하다.

## 배포 결과

- 주소: https://skala-vue-factory-daily-briefing.vercel.app
- 환경변수 3종을 Production / Preview / Development 세 환경에 등록했다. Production과 Preview는 Vercel이 Sensitive로 처리해 대시보드에서도 값이 보이지 않는다.
- 서버리스 함수 3개(`api/openweather`, `api/kpx`, `api/opinet`)가 정상 빌드되어 동작한다.
- GitHub 저장소를 연결해 `main` 브랜치에 push하면 자동으로 재배포된다.

배포본에서 확인한 내용은 다음과 같다.

| 항목 | 결과 |
| --- | --- |
| 로그인 없이 접속 | 정상 |
| 서버리스 함수 3종 | 키 없는 주소로 호출해 정상 응답 |
| 대시보드 4개 카드 | 오류 없이 실데이터 표시 |
| 주소 직접 입력 접속 | `/weather/city_01`, `/solar/ulsan`, `/labs/8` 등 전부 정상 |
| 진입 번들의 API 키 | 검색 결과 0건 |
| `/labs/8` 키 접근 시도 | 세 키 모두 "읽을 수 없음" |

## 앞으로 진행할 작업

### 기능

- 에어코리아(한국환경공단) API를 붙여 예보 모델 추정치 대신 측정소 실측 대기질을 쓴다.
- 사업장별로 공정 특성에 맞는 경보 기준을 따로 둔다. 클린룸은 습도 기준을 더 낮게 잡는 식이다.
- 화면 문구를 한국어와 영어로 전환한다.

### 품질

- 서버리스 함수에 호출 횟수 제한과 요청 출처 검증을 추가한다.
- Element Plus를 필요한 컴포넌트만 가져오도록 바꿔 번들 크기를 줄인다.
- 단위 변환 로직이 여러 화면에 중복되므로 Composable로 추출한다.
- 배포 환경에서 Vercel이 자동 주입하는 `VITE_VERCEL_*` 시스템 변수 때문에 `/labs/8`의 환경변수 목록이 길어진다. 시스템 변수임을 표시하거나 걸러 낸다.

### 제출 전 정리

- `.env` 또는 실제 API 키가 Git 이력에 포함되지 않았는지 확인한다.
- 최종 제출본에서도 ESLint와 프로덕션 빌드를 다시 실행한다.
- 내비게이션, 검색, 설정 변경, API 로딩·오류 처리, 404 화면을 확인한다.
- 시크릿 창으로 저장소 접근을 확인한다.

## 문서 관리 규칙

의미 있는 변경이 있을 때 다음 원칙으로 문서를 갱신한다.

1. 다시 활용할 수 있는 기술적 문제와 해결 방법은 `TROUBLESHOOTING.md`에 기록한다.
2. 완료한 작업과 다음 작업은 이 문서에 반영한다.
3. 단순 철자나 일회성 변수명 오타는 기록하지 않는다.
4. API 키, 토큰, 비밀번호 등 비밀값을 기록하지 않는다.
5. 작업 완료 전 ESLint와 빌드를 확인한다.
