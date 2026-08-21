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
import WeatherCard from '@/components/weather/WeatherCard.vue'
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

## 검증 명령어

의미 있는 코드를 변경한 뒤 다음 검사를 실행한다.

```bash
npm run lint:eslint -- --no-fix
npm run build
```

## 기록 범위

설정, 아키텍처, API 동작, 상태 관리, 라우팅, 빌드 문제처럼 다시 활용할 수 있는 내용만 기록한다. 단순 철자나 일회성 변수명 오타는 기록하지 않는다.
