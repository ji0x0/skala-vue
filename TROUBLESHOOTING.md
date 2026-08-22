# 트러블슈팅

날씨 애플리케이션을 개발하면서 발생한 문제와 원인, 해결 방법을 기록한다.

## Vue import 경로를 찾지 못하는 문제

### 증상

Vite에서 Vue 파일을 찾지 못한다는 `Failed to resolve import` 오류가 발생했다.

### 원인

- `.vue` 확장자 앞에 불필요한 역슬래시가 들어갔다.
- 상대 경로에 `src` 폴더가 한 번 더 포함됐다.
- 실제 디렉터리와 import 경로가 일치하지 않았다.

### 해결

파일 확장자를 그대로 작성하고 `@` 별칭 또는 올바른 상대 경로를 사용한다.

```js
import WeatherCard from '@/components/exercise/WeatherCard.vue'
```

## 컴포넌트 이벤트가 실행되지 않는 문제

### 증상

상세보기 버튼을 클릭해도 상세 날씨 페이지로 이동하지 않았다.

### 원인

부모가 수신하는 이벤트 이름과 자식이 발생시키는 이벤트 이름이 일치하지 않았다.

### 해결

부모와 자식의 이벤트 이름을 동일하게 맞추고 도시 ID를 핸들러에 전달한다.

```vue
@click-detail="handleDetailJump(item.id)"
```

## 검색 중 `includes` 오류가 발생하는 문제

### 증상

검색창에 문자를 입력하면 `undefined`와 `includes` 관련 오류가 발생했다.

### 원인

날씨 객체에는 `city` 속성이 있지만 검색 로직은 `item.name`을 읽고 있었다.

### 해결

```js
weatherlist.value.filter((item) => item.city.includes(query))
```

## 주소만 바뀌고 화면이 전환되지 않는 문제

### 원인

활성화된 라우트를 표시하는 대신 날씨 컴포넌트를 앱에서 직접 렌더링하고 있었다.

### 해결

- `main.js`에 Vue Router를 등록한다.
- `App.vue`에서 `<RouterView />`를 렌더링한다.
- `/`, `/about`, `/weather/:cityId`, Catch-all 라우트를 등록한다.

## 상세 페이지에서 도시 데이터가 표시되지 않는 문제

### 원인

- 라우터의 `:cityId`와 컴포넌트에서 읽는 파라미터 이름이 일치하지 않았다.
- 문자열 ID로 배열에 직접 접근했다.
- 템플릿 속성과 실제 데이터 속성의 이름이 일치하지 않았다.

### 해결

라우터와 동일한 파라미터 이름을 사용하고 배열에서 일치하는 항목을 찾는다.

```js
const id = route.params.cityId
const city = weatherDetails.value.find((item) => item.id === id)
```

## Pinia DevTools에 `No data`가 표시되는 문제

### 원인

Pinia는 등록됐지만 어떤 컴포넌트에서도 `useCounterStore()`와 같은 store 함수를 실행하지 않았다.

### 해결

store를 생성하고 사용하는 컴포넌트를 실제 화면에 렌더링한다. Pinia store는 인스턴스가 만들어진 이후 DevTools에 표시된다.

## `props`를 찾지 못하는 문제

### 원인

`defineProps()`의 결과를 변수에 저장하지 않았지만 이후 코드에서 `props.cityItem`을 사용했다.

### 해결

```js
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})
```

## OpenWeather에서 `401 Unauthorized`가 발생하는 문제

### 원인

- `.env` 파일이 프로젝트 최상위가 아닌 `src` 안에 있었다.
- `.env`를 변경한 뒤 Vite 개발 서버를 재시작하지 않았다.

### 해결

`.env`를 `package.json`과 같은 위치에 두고 환경변수를 설정한다.

```env
OPENWEATHER_API_KEY=your_api_key
```

당시에는 `VITE_OPENWEATHER_API_KEY` 라는 이름을 썼지만, 이후 키를 서버리스 함수로 옮기면서 접두사를 뗐다. 아래 "VITE_ 환경변수는 .gitignore만으로 감춰지지 않는다" 항목에 이유를 적었다.

환경변수 파일을 변경한 뒤 개발 서버를 재시작한다.

```bash
npm run dev
```

실제 API 키는 Git이나 문서에 기록하지 않는다.

## Axios 요청이 두 번 실행되는 문제

### 원인

`axios.get()`의 응답을 `URL`이라는 변수에 저장한 다음 그 값을 사용해 `axios.get()`을 다시 실행했다.

### 해결

먼저 URL 문자열을 만들고 Axios 요청은 한 번만 실행한다.

```js
const URL = `https://api.openweathermap.org/data/2.5/weather?...`
const response = await axios.get(URL)
```

또는 기본 URL과 `params` 객체를 하나의 `axios.get()` 호출에 전달한다.

## 프로젝트 분리

### 목적

정상 동작하는 프로젝트를 훼손하지 않으면서 문법 실습과 날씨 애플리케이션을 분리한다.

### 처리 내용

- `/Users/jiyeong/workspace/skala-vue-backup` 백업을 보존했다.
- 현재 저장소는 날씨 프로젝트로 유지했다.
- 문법 실습용 `/Users/jiyeong/workspace/skala-vue-practices` 프로젝트를 생성했다.
- 문법 실습 파일을 날씨 프로젝트에서 제거하기 전에 두 프로젝트의 ESLint와 빌드를 확인했다.

## 여러 API를 함께 조회하는 방법

현재 날씨에서 받은 좌표가 있어야 예보와 대기질을 조회할 수 있다. 따라서 현재 날씨는 먼저 기다리고, 서로 독립적인 두 요청만 `Promise.all()`로 동시에 처리한다.

```js
const currentResponse = await fetchCurrentWeather(cityQuery)
const { lat, lon } = currentResponse.data.coord

const [forecastResponse, airQualityResponse] = await Promise.all([
  fetchForecast(lat, lon),
  fetchAirQuality(lat, lon),
])
```

## Vue Router 주소로 직접 접속하면 404가 발생하는 문제

`createWebHistory()`를 사용한 SPA에서 `/weather/city_01`을 직접 요청하면 호스팅 서버가 실제 파일 경로로 해석할 수 있다. Vercel이 모든 화면 경로에서 `index.html`을 반환하도록 프로젝트 최상위에 `vercel.json`을 추가한다.

## Element Plus 전체 등록 후 번들 크기 경고

교재 방식대로 Element Plus 전체 패키지와 CSS를 등록하면 빌드는 성공하지만 번들 크기 경고가 발생할 수 있다. 현재는 과제 요구사항과 코드의 단순성을 위해 전체 등록을 유지한다. 실제 서비스에서는 자동 import 또는 필요한 컴포넌트만 가져오는 방식으로 최적화할 수 있다.

## 오피넷 유가 API가 브라우저에서 CORS로 차단되는 문제

### 증상

터미널에서 `curl`로는 정상 응답이 오는데, 브라우저에서 호출하면 CORS 오류로 요청이 실패했다.

### 원인

오피넷 응답에 `Access-Control-Allow-Origin` 헤더가 없다. 같은 방식으로 확인해 보면 공공데이터포털(data.go.kr)은 요청한 Origin을 그대로 반사해 주기 때문에 브라우저에서 직접 호출할 수 있다.

응답 헤더는 다음 명령으로 확인했다.

```bash
curl -s -D - -o /dev/null -H "Origin: https://example.vercel.app" "https://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=발급키"
```

### 처음 해결한 방법

개발 서버는 Vite 프록시로, 배포 환경은 `vercel.json`의 rewrite로 우회했다.

```json
{ "source": "/api/opinet/:path*", "destination": "https://www.opinet.co.kr/api/:path*" }
```

Vercel의 `rewrites`는 배열 위에서부터 평가되므로 오피넷 규칙을 SPA catch-all보다 앞에 두어야 한다. 순서를 바꾸면 `/api/opinet/...` 요청까지 `index.html`로 넘어간다.

### 최종 해결

오피넷은 CORS뿐 아니라 발급 키도 필요해서, 결국 `api/opinet.js` 서버리스 함수로 옮겼다. 서버끼리의 통신에는 CORS가 적용되지 않으므로 두 문제가 한 번에 해결됐고 키도 감춰졌다. rewrite 프록시 규칙은 필요 없어져 제거했다.

```js
const response = await fetch(`https://www.opinet.co.kr/api/${endpoint}.do?${params}`)
```

## 공공데이터포털 인증키가 이중 인코딩되는 문제

### 증상

발급받은 인증키를 그대로 넣으면 `SERVICE_KEY_IS_NOT_REGISTERED_ERROR`(403)가 발생할 수 있다.

### 원인

포털이 안내하는 "일반 인증키(Encoding)"는 이미 URL 인코딩된 문자열이다. 이 값을 그대로 Axios의 `params`에 넣으면 `%2F`가 `%252F`로 다시 인코딩되어 서버가 다른 키로 인식한다.

### 해결

`.env`에는 **URL 디코딩된** 키를 저장하고 인코딩은 한 번만 하도록 맡긴다. 현재는 서버리스 함수 안에서만 키를 사용한다.

```js
const params = new URLSearchParams({
  serviceKey: process.env.DATA_GO_KR_API_KEY,
  pageNo: '1',
  numOfRows: '408',
  dataType: 'JSON',
})
```

## 태양광 발전량 추정값이 실제보다 몇 배 크게 계산된 문제

### 증상

Open-Meteo의 일사량 일 합계를 설비용량에 그대로 곱했더니 발전량이 비현실적으로 크게 나왔다.

### 원인

`shortwave_radiation_sum`의 단위가 `kWh/m²`가 아니라 `MJ/m²`였다. 단위는 응답의 `daily_units`에서 확인할 수 있다.

```json
"daily_units": { "sunshine_duration": "s", "shortwave_radiation_sum": "MJ/m²" }
```

### 해결

1kWh = 3.6MJ 이므로 3.6으로 나눠 환산한 뒤 설비용량과 성능비를 곱한다. 설비용량(kWp)은 일사량 1,000W/m² 기준으로 정의되므로 별도 보정 없이 곱하면 된다.

```js
const radiationKwh = daily.shortwave_radiation_sum[0] / 3.6
const generation = Math.round(radiationKwh * capacityKw * 0.8) // 0.8은 성능비(PR)
```

`sunshine_duration`도 단위가 초(s)라서 3600으로 나눠 시간으로 바꿔야 한다.

## 환율 카드에 통화가 하나도 표시되지 않고 NaN이 나온 문제

### 증상

환율 카드의 통화 목록이 비어 있고 원/달러 값이 `NaN원`으로 표시됐다.

### 원인

Frankfurter는 `base` 통화 1단위당 상대 통화 값을 돌려준다. 표시 대상 통화 목록(`MAJOR_CURRENCIES`)에는 원화 환산의 기준이 되는 `KRW`가 빠져 있었다. 그 결과 `rates.KRW`가 `undefined`가 되어 모든 교차 환산 결과가 0이 되었고, 0인 항목을 걸러내는 필터가 전부를 제거했다.

### 해결

표시용 통화 목록과 조회용 통화 목록을 분리하고, 조회 시에는 `KRW`를 항상 포함한다.

```js
const symbols = [...MAJOR_CURRENCIES.filter((code) => code !== BASE_CURRENCY), 'KRW']
```

교차 환율은 `(KRW/USD) ÷ (통화/USD)`로 계산한다. 엔화는 100단위 표기가 관례라 별도로 처리했다.

## el-statistic이 소수점을 버리는 문제

### 증상

일사량 `3.44kWh/m²`가 `3`으로, 일조시간 `4.2시간`이 `4`로 표시됐다.

### 원인

Element Plus의 `el-statistic`은 `precision` 기본값이 0이라 소수점 이하를 반올림해서 버린다.

### 해결

소수점이 의미를 갖는 지표에는 `precision`을 명시한다.

```vue
<el-statistic title="오늘 일사량" :value="solar.radiationToday" :precision="2" suffix="kWh/m²" />
```

## macOS에서는 되는데 배포하면 화면이 안 뜰 수 있는 파일명 대소문자 문제

### 증상

로컬 개발에서는 정상인데 배포 후 특정 화면의 청크 로딩이 실패할 수 있다.

### 원인

macOS 기본 파일 시스템은 대소문자를 구분하지 않아 `WeatherHomeview.vue` 파일을 `WeatherHomeView.vue`로 import해도 동작한다. 반면 Vercel의 Linux 빌드 환경은 대소문자를 구분한다.

### 해결

View 파일명을 과제 명세와 동일한 `WeatherHomeView.vue` 형태로 통일하고 모든 import 경로를 맞췄다. 이름만 바꿀 때는 `git mv`를 써야 Git이 변경을 인식한다.

```bash
git mv src/views/WeatherHomeview.vue src/views/WeatherHomeView.vue
```

## 컴포넌트를 분리했는데 스타일은 전역 CSS에 남아 있던 문제

### 증상

컴포넌트를 4개로 나눴지만 카드·검색창 디자인은 전역 스타일시트 한 곳에 그대로 있었다. 과제 요구사항은 "Component에 해당되는 디자인은 `<style scoped>`로 각각 분리"이다.

### 원인

컴포넌트를 나눌 때 `template`과 `script`만 옮기고 `style`은 옮기지 않았다.

### 해결

각 컴포넌트가 자기 스타일을 갖도록 옮기고, 전역 CSS에는 앱 셸(레이아웃·내비게이션)과 공통 상태 표시 규칙만 남겼다.

Element Plus 컴포넌트 내부 요소는 scoped 범위를 넘어가므로 `:deep()`으로 선택해야 한다.

```css
.forecast-list :deep(.el-card__body) {
  padding: 12px;
}
```

## VITE_ 환경변수는 .gitignore만으로 감춰지지 않는다

### 증상

`.env`를 `.gitignore`에 넣어 GitHub에는 올라가지 않는데도, 배포된 사이트의 개발자 도구에서 API 키를 확인할 수 있다.

### 원인

`VITE_` 접두사가 붙은 값은 빌드 시점에 클라이언트 번들 안에 **문자열로 그대로 삽입**된다. `.gitignore`는 저장소 노출만 막을 뿐 브라우저 노출은 막지 못한다. 이 둘은 서로 다른 문제다.

```bash
# 빌드 결과에서 키가 그대로 보이는지 확인하는 방법
npm run build
grep -r "본인_키_앞_8자리" dist/assets/*.js
```

### 해결

키가 필요한 API를 브라우저에서 직접 부르지 않도록 구조를 바꿨다.

```text
[이전] 브라우저 --(키 포함)--> OpenWeather                     키 노출
[현재] 브라우저 --(키 없음)--> /api/* --(키 추가)--> OpenWeather   키는 서버에만
```

1. `api/` 폴더에 서버리스 함수를 만들어 외부 API 호출을 서버로 옮겼다.
2. 환경변수 이름에서 **`VITE_` 접두사를 제거**했다. 이 단계가 핵심이다. 접두사가 남아 있으면 함수를 만들어도 값이 계속 번들에 삽입된다.
3. `.env`는 `.gitignore`로 제외하고 키 이름만 `.env.example`에 남겼다.
4. 배포 환경에서는 Vercel의 Environment Variables에 접두사 없는 이름으로 등록했다.

| 변수명 | 어디까지 노출되나 |
| --- | --- |
| `VITE_OPENWEATHER_API_KEY` | 클라이언트 번들에 삽입되어 보인다 |
| `OPENWEATHER_API_KEY` | 서버 함수만 접근할 수 있다 |

키가 필요 없는 Open-Meteo와 Frankfurter는 그대로 브라우저에서 호출한다. 서버를 거칠 이유가 없다.

확인은 빌드 후 실제 키 값을 검색해 0건이면 된다.

```bash
npm run build
grep -r "본인_키_값" dist/assets/
```

배포본에서는 진입 번들을 내려받아 같은 방식으로 확인했다. 앱의 `/labs/8` 화면도 클라이언트에서 세 키에 접근을 시도한 결과를 표시한다.

### 남는 문제

키가 서버로 옮겨져도 누구나 `/api/*`를 호출할 수 있다는 점은 남는다. 실제 서비스라면 호출 횟수 제한이나 요청 출처 검증을 함수 안에 추가해야 한다. 과제 범위에서는 다루지 않았다.

또한 함수가 아무 주소나 대신 호출해 주는 열린 프록시가 되지 않도록, 호출 가능한 경로를 화이트리스트로 제한했다.

```js
const ALLOWED_PATHS = new Set(['weather', 'forecast'])
if (!ALLOWED_PATHS.has(path)) {
  return res.status(400).json({ message: `허용되지 않은 경로입니다: ${path}` })
}
```

## 서버리스 함수를 개발 서버에서도 실행하기

### 증상

`api/` 폴더의 함수는 Vercel에서만 동작하고 `npm run dev` 에서는 `/api/*` 요청이 404가 났다.

### 원인

Vite 개발 서버는 정적 파일과 모듈만 다루고 서버 함수를 실행하지 않는다.

### 해결

`vite.config.js`에 플러그인을 추가해 `/api/*` 요청이 오면 같은 파일을 불러 미들웨어로 실행하도록 했다. 함수 코드가 한 벌이라 로컬과 배포가 갈라지지 않고, `vercel dev` 같은 별도 도구 없이 개발할 수 있다.

`loadEnv`의 세 번째 인자를 빈 문자열로 주면 `VITE_` 없는 변수까지 읽을 수 있다. 읽은 값은 `process.env`에만 넣으므로 클라이언트 번들에는 포함되지 않는다.

```js
const env = loadEnv(mode, process.cwd(), '')
Object.assign(process.env, env)
```

`api/`와 설정 파일은 브라우저가 아닌 Node 환경에서 돌아가므로 ESLint 설정에도 Node 전역을 따로 지정해야 `process is not defined` 오류가 사라진다.

## Open-Meteo에서 429 Too Many Requests가 발생하는 문제

### 증상

대시보드를 여러 번 새로고침하니 일사량 데이터만 불러오지 못했다.

### 원인

사업장 6곳의 일사량을 각각 요청해서 화면에 들어올 때마다 6번을 호출했다. 무료 API는 분당·시간당 호출 제한이 있다.

### 해결

Open-Meteo는 좌표를 쉼표로 이어 보내면 여러 지점을 한 번에 조회할 수 있다. 요청을 6회에서 1회로 줄였다. 응답은 지점 수만큼의 배열로 돌아오므로 배열 여부를 확인해 처리한다.

```js
params: {
  latitude: sites.map((site) => site.lat).join(','),
  longitude: sites.map((site) => site.lon).join(','),
}
```

## GitHub 커밋 메시지에 취소선이 생기는 문제

### 증상

커밋 본문의 `기존에는 실습 1~3만 실행 화면이 있고 4~8은 텍스트 설명뿐이었다.` 문장에서 가운데 부분이 취소선으로 표시됐다.

### 원인

GitHub Flavored Markdown은 물결표로 감싼 구간을 취소선으로 렌더링한다. 한국어에서 범위 표기로 흔히 쓰는 `1~3`, `4~8`이 한 줄에 두 번 나오면서 그 사이가 취소선이 됐다.

### 해결

커밋 메시지에서는 범위를 하이픈으로 적는다. 별표와 밑줄도 같은 이유로 강조 처리될 수 있다.

```text
1~3단계  →  1-3단계
```

## 검증 명령어

의미 있는 코드를 변경한 뒤 다음 검사를 실행한다.

```bash
npm run lint:eslint -- --no-fix
npm run build
```

외부 API를 새로 붙일 때는 브라우저에서 부르기 전에 CORS 허용 여부를 먼저 확인한다.

```bash
curl -s -D - -o /dev/null -H "Origin: https://example.vercel.app" "조회할_API_주소"
```

응답 헤더에 `Access-Control-Allow-Origin`이 없으면 프록시가 필요하다.

## 기록 범위

설정, 아키텍처, API 동작, 상태 관리, 라우팅, 빌드 문제처럼 다시 활용할 수 있는 내용만 기록한다. 단순 철자나 일회성 변수명 오타는 기록하지 않는다.
