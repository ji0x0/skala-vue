# 트러블슈팅

README의 과제 수행 내용을 보완하기 위해, 개발 중 발생한 문제와 원인·해결 방법을 모아 두었다.

같은 내용을 앱의 `/troubleshooting` 화면에서도 카테고리 필터와 검색으로 볼 수 있다.

---

## 빌드 / 설정

### Vue 컴포넌트 import 경로 오류 문제

**증상** — Vite에서 `Failed to resolve import` 오류가 발생했다.

**원인**

- `.vue` 확장자 앞에 불필요한 역슬래시가 들어갔다.
- 상대 경로에 `src` 폴더가 한 번 더 포함됐다.
- 실제 디렉터리와 import 경로가 일치하지 않았다.

**해결** — `@` 별칭을 사용해 경로를 고정했다.

```js
import WeatherCard from '@/components/exercise/WeatherCard.vue'
```

---

## 컴포넌트

### 한글 검색어 입력 조합 문제

**증상** — 한글을 타이핑하면 조합 중인 글자가 사라지거나 자음과 모음이 따로 떨어졌다.

**원인** — 입력 이벤트 처리 과정에서 부모 상태가 갱신되고 입력값이 다시 설정되면서 조합 중인 문자가 덮어써졌다. `v-model` 자체가 항상 한글 입력을 깨뜨리는 것은 아니다.

**해결** — 과제에서 지정한 `:value`와 `@input` 흐름으로 입력값 전달 경로를 단순화하고, 입력 중 별도 가공을 하지 않았다.

```vue
<input :value="currentQuery" @input="$emit('update-query', $event.target.value)" />
```

이 방식을 `SearchBar` 컴포넌트로 묶어 운영 브리핑의 사업장 검색과 트러블슈팅 검색에서 함께 쓴다.

### 컴포넌트 이벤트 미동작 문제

**증상** — 상세보기 버튼을 눌러도 상세 페이지로 이동하지 않았다.

**원인** — 부모가 수신하는 이벤트 이름과 자식이 발생시키는 이름이 달랐다.

**해결** — 부모와 자식의 이벤트 이름을 일치시키고 도시 ID를 핸들러에 전달했다.

```vue
@click-detail="handleDetailJump(item.id)"
```

### props 참조 오류 문제

**증상** — `props.cityItem`이 `undefined`로 평가됐다.

**원인** — `defineProps()`의 반환값을 변수에 저장하지 않고 `props`를 참조했다.

**해결**

```js
const props = defineProps({
  cityItem: { type: Object, required: true },
})
```

### 검색 필드 `includes` 오류 문제

**증상** — 검색창에 문자를 입력하면 `undefined`와 `includes` 관련 오류가 발생했다.

**원인** — 날씨 객체에는 `city` 속성이 있지만 검색 로직은 `item.name`을 읽고 있었다.

**해결**

```js
weatherlist.value.filter((item) => item.city.includes(query))
```

### 컴포넌트 scoped 스타일 분리 문제

**증상** — 컴포넌트를 넷으로 나눴지만 카드·검색창 디자인은 전역 스타일시트 한 곳에 그대로 있었다. 과제 요구사항은 컴포넌트 디자인을 각각 `<style scoped>`로 분리하는 것이다.

**원인** — 컴포넌트를 나눌 때 `template`과 `script`만 옮기고 `style`은 옮기지 않았다.

**해결** — 각 컴포넌트가 자기 스타일을 갖도록 옮기고, 전역 CSS에는 앱 셸과 공통 상태 표시 규칙만 남겼다.

Element Plus 컴포넌트 내부 요소는 scoped 범위를 넘어가므로 `:deep()`으로 선택해야 한다.

```css
.forecast-list :deep(.el-card__body) {
  padding: 12px;
}
```

---

## 라우팅

### 라우터 화면 전환 문제

**증상** — 내비게이션을 눌러도 URL만 바뀌고 화면이 그대로였다.

**원인** — `App.vue`에서 `RouterView` 대신 날씨 컴포넌트를 직접 렌더링하고 있었다.

**해결** — `main.js`에 라우터를 등록하고 `App.vue`에 `RouterView`를 배치했다.

### 상세 페이지 도시 데이터 표시 문제

**증상** — 상세 화면이 빈 값으로 렌더링됐다.

**원인**

- 라우터의 `:cityId`와 컴포넌트에서 읽는 파라미터 이름이 달랐다.
- 문자열 ID로 배열에 직접 접근했다.

**해결** — 라우터와 같은 파라미터 이름을 쓰고 `find`로 일치하는 항목을 찾았다.

```js
const site = findSiteById(route.params.cityId)
```

### 배포 환경 파일명 대소문자 문제

**증상** — macOS 개발 환경에서는 정상인데 배포 후 청크 로딩이 실패할 수 있다.

**원인** — macOS 기본 파일 시스템은 대소문자를 구분하지 않아 `WeatherHomeview.vue` 파일을 `WeatherHomeView.vue`로 import해도 동작한다. 반면 Vercel의 Linux 빌드 환경은 대소문자를 구분한다.

**해결** — View 파일명을 과제 명세와 동일한 형태로 통일하고 모든 import 경로를 맞췄다. 이름만 바꿀 때는 `git mv`를 써야 Git이 변경을 인식한다.

```bash
git mv src/views/WeatherHomeview.vue src/views/WeatherHomeView.vue
```

---

## 상태 관리

### Pinia DevTools `No data` 문제

**증상** — Pinia는 등록했는데 DevTools의 Pinia 탭이 비어 있었다.

**원인** — 어떤 컴포넌트에서도 store 함수를 호출하지 않아 인스턴스가 만들어지지 않았다.

**해결** — store를 사용하는 컴포넌트를 실제 화면에 렌더링했다. Pinia store는 인스턴스가 만들어진 이후 DevTools에 표시된다.

---

## API 연동

### OpenWeather `401 Unauthorized` 문제

**원인**

- `.env` 파일이 프로젝트 최상위가 아닌 `src` 안에 있었다.
- `.env`를 변경한 뒤 Vite 개발 서버를 재시작하지 않았다.

**해결** — `.env`를 `package.json`과 같은 위치에 두고 환경변수를 설정한 뒤 개발 서버를 재시작했다.

```bash
npm run dev
```

실제 API 키는 Git이나 문서에 기록하지 않는다.

### Axios 중복 요청 문제

**증상** — 네트워크 탭에 같은 요청이 중복으로 찍혔다.

**원인** — `axios.get()`의 응답을 `URL`이라는 변수에 저장한 다음 그 값을 사용해 `axios.get()`을 다시 실행했다.

**해결** — URL 문자열을 먼저 만들고 요청은 한 번만 실행했다. 이후에는 기본 URL과 `params` 객체를 하나의 호출에 전달하는 방식으로 정리했다.

```js
axios.get(BASE_URL, { params: { q, appid } })
```

### 다중 API 요청 순서 문제

**상황** — 예보와 대기질 조회에 좌표가 필요해 요청 순서를 정해야 했다.

**해결** — 현재 날씨 응답의 좌표가 있어야 나머지 두 요청을 보낼 수 있다. 현재 날씨는 먼저 `await`하고, 서로 독립적인 예보와 대기질만 `Promise.all()`로 병렬 처리했다.

```js
const currentResponse = await fetchCurrentWeather(cityQuery)
const { lat, lon } = currentResponse.data.coord

const [forecastResponse, airQualityResponse] = await Promise.all([
  fetchForecast(lat, lon),
  fetchAirQuality(lat, lon),
])
```

### 오피넷 API CORS 차단 문제

**증상** — 터미널에서 `curl`로는 정상 응답이 오는데, 브라우저에서 호출하면 CORS 오류로 요청이 실패했다.

**원인** — 오피넷 응답에 `Access-Control-Allow-Origin` 헤더가 없다. 같은 방식으로 확인해 보면 공공데이터포털(data.go.kr)은 요청한 Origin을 그대로 반사해 주기 때문에 브라우저에서 직접 호출할 수 있다.

응답 헤더는 다음 명령으로 확인했다.

```bash
curl -s -D - -o /dev/null -H "Origin: https://example.vercel.app" "조회할_API_주소"
```

**처음 해결한 방법** — 개발 서버는 Vite 프록시로, 배포 환경은 `vercel.json`의 rewrite로 우회했다. Vercel의 `rewrites`는 배열 위에서부터 평가되므로 오피넷 규칙을 SPA catch-all보다 앞에 두어야 한다.

**최종 해결** — 오피넷은 CORS뿐 아니라 발급 키도 필요해서, 결국 `api/opinet.js` 서버리스 함수로 옮겼다. 서버끼리의 통신에는 CORS가 적용되지 않으므로 두 문제가 한 번에 해결됐고 키도 감춰졌다. rewrite 프록시 규칙은 필요 없어져 제거했다.

### 공공데이터포털 인증키 이중 인코딩 문제

**증상** — 발급받은 인증키를 그대로 넣으면 `SERVICE_KEY_IS_NOT_REGISTERED_ERROR`(403)가 발생할 수 있다.

**원인** — 포털이 안내하는 "일반 인증키(Encoding)"는 이미 URL 인코딩된 문자열이다. 이 값을 그대로 `params`에 넣으면 `%2F`가 `%252F`로 다시 인코딩되어 서버가 다른 키로 인식한다.

**해결** — `.env`에는 **URL 디코딩된** 키를 저장하고 인코딩은 한 번만 하도록 맡긴다.

```js
const params = new URLSearchParams({
  serviceKey: process.env.DATA_GO_KR_API_KEY,
  pageNo: '1',
  numOfRows: '408',
  dataType: 'JSON',
})
```

### 태양광 발전량 과대 계산 문제

**증상** — Open-Meteo의 일사량 일 합계를 설비용량에 그대로 곱했더니 발전량이 비현실적으로 크게 나왔다.

**원인** — `shortwave_radiation_sum`의 단위가 `kWh/m²`가 아니라 `MJ/m²`였다. 단위는 응답의 `daily_units`에서 확인할 수 있다.

```json
"daily_units": { "sunshine_duration": "s", "shortwave_radiation_sum": "MJ/m²" }
```

**해결** — 1kWh = 3.6MJ 이므로 3.6으로 나눠 환산한 뒤 설비용량과 성능비를 곱한다. 설비용량(kWp)은 일사량 1,000W/m² 기준으로 정의되므로 별도 보정 없이 곱하면 된다.

```js
const radiationKwh = daily.shortwave_radiation_sum[0] / 3.6
const generation = Math.round(radiationKwh * capacityKw * 0.8) // 0.8은 성능비(PR)
```

`sunshine_duration`도 단위가 초(s)라서 3600으로 나눠 시간으로 바꿔야 한다.

### Open-Meteo `429 Too Many Requests` 문제

**증상** — 대시보드를 여러 번 새로고침하거나 배포 화면을 열었을 때 일사량 요청이 429로 실패하고 태양광 카드가 비었다.

**원인** — 처음에는 사업장 6곳의 일사량을 각각 요청해 화면 진입마다 6번을 호출했다. 다중 좌표 요청으로 줄인 뒤에도 새로고침이 이어지면 무료 API의 분당·시간당 호출 제한에 걸릴 수 있었다.

**해결** — 좌표를 쉼표로 이어 보내는 다중 좌표 요청으로 호출을 6회에서 1회로 줄였다. 요청은 `/api/solar` 서버리스 함수로 모으고 Vercel CDN에서 30분간 캐시하며, 갱신 중에는 마지막 정상 응답을 사용할 수 있게 했다. 브라우저에서도 정상 응답을 날짜와 저장 시각을 붙여 `localStorage`에 보관한다. 호출이 실패해도 오늘 저장한 데이터가 있으면 태양광 카드를 비우지 않고 마지막 정상 응답과 저장 시각을 표시한다.

```js
params: {
  latitude: sites.map((site) => site.lat).join(','),
  longitude: sites.map((site) => site.lon).join(','),
}

const isFresh = cached && Date.now() - cached.savedAt < 30 * 60 * 1000
```

### 환율 카드 빈 목록과 NaN 문제

**증상** — 환율 카드의 통화 목록이 비어 있고 원/달러 값이 `NaN원`으로 표시됐다.

**원인** — Frankfurter는 `base` 통화 1단위당 상대 통화 값을 돌려준다. 표시 대상 통화 목록에는 원화 환산의 기준이 되는 `KRW`가 빠져 있었다. 그 결과 `rates.KRW`가 `undefined`가 되어 모든 교차 환산 결과가 0이 되었고, 0인 항목을 걸러내는 필터가 전부를 제거했다.

**해결** — 표시용 통화 목록과 조회용 통화 목록을 분리하고, 조회 시에는 `KRW`를 항상 포함한다.

```js
const symbols = [...MAJOR_CURRENCIES.filter((code) => code !== BASE_CURRENCY), 'KRW']
```

교차 환율은 `(KRW/USD) ÷ (통화/USD)`로 계산한다. 엔화는 100단위 표기가 관례라 별도로 처리했다.

### 국내 대기질 등급 불일치 문제

**증상** — 미세먼지 농도는 보통 수준인데 화면에는 나쁨으로 표시됐다.

**원인**

- Open-Meteo가 내려주는 `european_aqi`를 그대로 등급 판정에 사용했다.
- 유럽 기준은 국내 환경부 기준과 구간이 달라 같은 농도라도 등급이 어긋난다.

| | 좋음 | 보통 | 나쁨 |
| --- | --- | --- | --- |
| 유럽 AQI | 0-20 | 21-40 | 41-60 |
| 환경부 CAI | 0-50 | 51-100 | 101-250 |

**해결** — 같은 응답의 PM10·PM2.5 농도를 국내 CAI 구간에 대입하고, 두 값 중 더 나쁜 등급을 표시하도록 바꿨다. 전체 CAI 오염물질과 복합오염 보정은 포함하지 않으므로 화면에서는 간이 지수로 안내한다.

```js
const index = Math.max(toIndex(pm10, PM10_TABLE), toIndex(pm25, PM25_TABLE))
```

---

## 지표 설계

### 사업장별 발전 여건 비교 문제

**상황** — 사업장마다 태양광 설비 용량이 달라서 발전량 절대값만으로는 어디가 오늘 여건이 좋은지 알 수 없다. 설비가 크면 당연히 발전량도 많다.

**처음 시도** — 임의로 정한 일사량 기준값(5kWh/m²)으로 사업장별 기준 발전량을 구하고, 오늘 발전량을 그 값과 견주어 백분율로 보여줬다.

문제가 두 가지 있었다.

- 기준을 어떻게 잡느냐에 따라 값이 통째로 달라진다. `5`라는 숫자에 근거가 없다.
- 맑은 날에는 여섯 곳 중 다섯 곳이 기준을 넘어 모두 100%로 표시됐다. `Math.min(100, ...)` 상한 때문에 구분이 되지 않았고, 상한을 없애자 이번에는 "설비용량보다 많이 생산했나"라는 오해를 부르는 표시가 됐다.

**해결** — 태양광에서 널리 쓰는 **등가가동시간(Equivalent Full-Load Hours)**으로 바꿨다. 발전량을 설비용량으로 나눈 값으로, 정격 출력으로 몇 시간 돌린 것과 같은지를 뜻한다.

```js
const fullLoadHours = generationKwh / capacityKw
```

임의 가정이 없고 설비 크기와 무관하게 그대로 비교된다. 100%를 넘는 이상한 표시도 생기지 않는다.

정렬은 등가가동시간이 긴 순으로 하고, 같으면 발전량 절대값이 큰 사업장을 앞에 둔다.

지표에서 임의 기준을 걷어냈지만 색으로 등급을 나누는 경계값이 다시 임의로 정한 숫자였다. 국내 태양광 연평균 일 등가가동시간이 약 3.4시간(연평균 이용률 약 14%)인 점을 근거로 삼아 보통의 하한을 3.4시간, 좋음의 하한을 맑은 날 수준인 4.5시간으로 정하고 서비스 소개 화면에도 명시했다. 경계값은 Store에서 읽어 오므로 화면과 안내가 어긋나지 않는다.

**참고** — `kWp`는 출력(순간에 낼 수 있는 힘), `kWh`는 에너지(출력 × 시간)라 서로 비교할 수 있는 값이 아니다. 950kWp 설비가 하루에 4,317kWh를 만드는 것은 정상이다.

### el-statistic 소수점 표시 문제

**증상** — 일사량 `3.44kWh/m²`가 `3`으로, 일조시간 `4.2시간`이 `4`로 표시됐다.

**원인** — Element Plus의 `el-statistic`은 `precision` 기본값이 0이라 소수점 이하를 반올림해서 버린다.

**해결** — 소수점이 의미를 갖는 지표에는 `precision`을 명시한다.

```vue
<el-statistic title="오늘 일사량" :value="radiationToday" :precision="2" suffix="kWh/m²" />
```

---

## 배포

### Vue Router 직접 접속 404 문제

**증상** — `/weather/city_01`로 직접 접속하면 페이지를 찾을 수 없다고 나온다.

**원인** — `createWebHistory`를 쓰는 SPA에서 호스팅 서버가 주소를 실제 파일 경로로 해석한다.

**해결** — 모든 화면 경로에서 `index.html`을 반환하도록 `vercel.json`에 rewrite를 추가했다. 단, 서버리스 함수가 가려지지 않도록 `/api/` 경로는 제외한다.

```json
{ "source": "/((?!api/).*)", "destination": "/index.html" }
```

### `VITE_` 환경변수 노출 문제

**증상** — `.env`를 `.gitignore`에 넣어 GitHub에는 올라가지 않는데도, 배포된 사이트의 개발자 도구에서 API 키를 확인할 수 있다.

**원인** — `VITE_` 접두사가 붙은 값은 빌드 시점에 클라이언트 번들 안에 **문자열로 그대로 삽입**된다. `.gitignore`는 저장소 노출만 막을 뿐 브라우저 노출은 막지 못한다. 이 둘은 서로 다른 문제다.

```bash
npm run build
grep -r "발급받은_키" dist/assets/
```

**해결** — 키가 필요한 API를 브라우저에서 직접 부르지 않도록 구조를 바꿨다.

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

키가 필요 없는 Open-Meteo 대기질과 Frankfurter는 브라우저에서 호출한다. Open-Meteo 일사량은 키가 아니라 호출 제한과 캐시 때문에 `/api/solar`를 거친다.

**남는 문제** — 키가 서버로 옮겨져도 누구나 `/api/*`를 호출할 수 있다. 실제 서비스라면 호출 횟수 제한이나 요청 출처 검증을 함수 안에 추가해야 한다.

또한 함수가 아무 주소나 대신 호출해 주는 열린 프록시가 되지 않도록, 호출 가능한 경로를 화이트리스트로 제한했다.

```js
const ALLOWED_PATHS = new Set(['weather', 'forecast'])
if (!ALLOWED_PATHS.has(path)) {
  return res.status(400).json({ message: `허용되지 않은 경로입니다: ${path}` })
}
```

### 개발 서버의 서버리스 함수 실행 문제

**증상** — `api/` 폴더의 함수는 Vercel에서만 동작하고 `npm run dev` 에서는 `/api/*` 요청이 404가 났다.

**원인** — Vite 개발 서버는 정적 파일과 모듈만 다루고 서버 함수를 실행하지 않는다.

**해결** — `vite.config.js`에 플러그인을 추가해 `/api/*` 요청이 오면 배포용 `api/*.js`를 미들웨어로 실행하도록 했다. 별도의 `vercel dev` 없이 `npm run dev`에서 API 흐름을 확인할 수 있다.

`loadEnv`의 세 번째 인자를 빈 문자열로 주면 `VITE_` 없는 변수까지 읽을 수 있다. 읽은 값은 `process.env`에만 넣으므로 클라이언트 번들에는 포함되지 않는다.

```js
const env = loadEnv(mode, process.cwd(), '')
Object.assign(process.env, env)
```

`api/`와 설정 파일은 브라우저가 아닌 Node 환경에서 돌아가므로 ESLint 설정에도 Node 전역을 따로 지정해야 `process is not defined` 오류가 사라진다.

### Vercel 도메인 재등록 문제

**증상** — 원하는 이름의 `.vercel.app` 주소를 추가하고 자동 생성된 주소의 별칭을 지웠는데, 다음 배포 후 다시 나타났다.

**원인** — 자동 생성된 주소는 배포별 별칭이 아니라 **프로젝트 도메인**으로 등록되어 있다. 별칭만 지우면 새 배포에서 프로젝트 설정에 따라 다시 붙는다.

**해결** — 프로젝트 도메인 목록에서 제거해야 한다.

### Element Plus 번들 크기 경고 문제

**증상** — 빌드는 성공하지만 청크가 500kB를 넘는다는 경고가 나온다.

**원인** — 교재 방식대로 Element Plus 전체 패키지와 CSS를 등록했다.

**해결** — 과제 요구사항과 코드 단순성을 위해 전체 등록을 유지했다. 실제 서비스에서는 자동 import 또는 필요한 컴포넌트만 가져오는 방식으로 최적화할 수 있다.

### GitHub 커밋 메시지 취소선 문제

**증상** — 커밋 본문의 `실습 1~3만 실행 화면이 있고 4~8은` 문장에서 가운데 부분이 취소선으로 표시됐다.

**원인** — GitHub Flavored Markdown은 물결표로 감싼 구간을 취소선으로 렌더링한다. 한국어에서 범위 표기로 흔히 쓰는 `1~3`, `4~8`이 한 줄에 두 번 나오면서 그 사이가 취소선이 됐다.

**해결** — 커밋 메시지에서는 범위를 하이픈으로 적는다. 별표와 밑줄도 같은 이유로 강조 처리될 수 있다.

```text
1~3단계  →  1-3단계
```
