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
VITE_OPENWEATHER_API_KEY=your_api_key
```

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

### 해결

개발 서버와 배포 환경 양쪽에 프록시 경로를 만들어 우회한다.

`vite.config.js` (개발 서버)

```js
server: {
  proxy: {
    '/api/opinet': {
      target: 'https://www.opinet.co.kr',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/opinet/, '/api'),
    },
  },
}
```

`vercel.json` (배포)

```json
{
  "rewrites": [
    { "source": "/api/opinet/:path*", "destination": "https://www.opinet.co.kr/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Vercel의 `rewrites`는 배열 위에서부터 평가되므로, 오피넷 규칙을 SPA catch-all보다 반드시 앞에 두어야 한다. 순서를 바꾸면 `/api/opinet/...` 요청까지 `index.html`로 넘어간다.

## 공공데이터포털 인증키가 이중 인코딩되는 문제

### 증상

발급받은 인증키를 그대로 넣으면 `SERVICE_KEY_IS_NOT_REGISTERED_ERROR`(403)가 발생할 수 있다.

### 원인

포털이 안내하는 "일반 인증키(Encoding)"는 이미 URL 인코딩된 문자열이다. 이 값을 그대로 Axios의 `params`에 넣으면 `%2F`가 `%252F`로 다시 인코딩되어 서버가 다른 키로 인식한다.

### 해결

`.env`에는 **URL 디코딩된** 키를 저장하고, Axios가 한 번만 인코딩하도록 맡긴다.

```js
axios.get(KPX_PV_URL, {
  params: {
    serviceKey: import.meta.env.VITE_DATA_GO_KR_API_KEY,
    pageNo: 1,
    numOfRows: 408,
    dataType: 'JSON',
  },
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

과제 범위에서는 다음 두 가지로 관리한다.

1. `.env`는 `.gitignore`로 저장소에서 제외하고, 필요한 키 이름만 `.env.example`에 남긴다.
2. 배포 환경에서는 Vercel 프로젝트 설정의 Environment Variables에 키를 등록한다. 저장소에는 키가 남지 않고, 빌드 시점에만 주입된다.

실제 서비스 수준으로 키를 숨기려면 클라이언트에서 외부 API를 직접 부르지 않아야 한다. 서버리스 함수를 두고 키를 서버에만 보관한 뒤, 브라우저는 자체 엔드포인트만 호출하는 구조로 바꿔야 한다.


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
