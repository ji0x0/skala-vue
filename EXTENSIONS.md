# 확장 기능 및 진행 상황

날씨 애플리케이션에서 완료한 작업과 앞으로 확장할 기능을 기록한다.

## 프로젝트 구성

- 날씨 애플리케이션: `/Users/jiyeong/workspace/skala-vue`
- 문법 실습 프로젝트: `/Users/jiyeong/workspace/skala-vue-practices`
- 원본 백업: `/Users/jiyeong/workspace/skala-vue-backup`

## 과제 화면 제목 규칙

각 과제 화면 최상단에 `<h1>` 제목을 표시한다.

| 과제 | 화면 제목 |
| --- | --- |
| 과제 1 | `⛅ 과제 1: 날씨 목업` |
| 과제 2 | `⛅ 과제 2: Composition API` |
| 과제 3 | `⛅ 과제 3: 컴포넌트 분리` |
| 과제 4 | `⛅ 과제 4: 라우터 적용` |
| 과제 5 | `⛅ 과제 5: 스토어 적용` |
| 과제 6 | `⛅ 과제 6: 외부 API 연동 (Axios)` |
| 과제 7 | `⛅ 과제 7: 외부 UI 라이브러리 적용` |
| 과제 8 | `⛅ 과제 8: 품질 관리 및 배포` |

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

## 현재 API 데이터 매핑

| 애플리케이션 데이터 | OpenWeather 응답 |
| --- | --- |
| 도시 | `name` 또는 내부 도시 매핑 |
| 기온 | `main.temp` |
| 날씨 상태 | `weather[0].description` |
| 습도 | `main.humidity` |
| 풍속 | `wind.speed` |

## 앞으로 진행할 작업

### Vercel 배포

- GitHub 저장소를 Vercel에 연결하고 실제 배포 주소를 발급받는다.
- Vercel 프로젝트에 `VITE_OPENWEATHER_API_KEY` 환경변수를 등록한다.
- 모든 라우트와 상세 페이지 직접 접속을 확인한다.
- 실제 서비스 수준으로 확장할 때는 Vercel Function을 추가하고 브라우저의 API 키 직접 사용을 제거한다.
- 필요하면 요청값 검증, 캐시, 기본적인 호출 횟수 제한을 추가한다.

### 제출 전 정리

- 백업 파일을 제출 저장소에 포함할지 결정한다.
- View 파일명의 대소문자와 명명 규칙을 정리한다.
- `.env` 또는 실제 API 키가 Git에 포함되지 않았는지 확인한다.
- 최종 제출본에서도 ESLint와 프로덕션 빌드를 다시 실행한다.
- Navigation, 검색, 단위 변경, API 로딩, 오류 처리, 404 화면을 확인한다.
- `README.md`에 설치 및 실행 방법을 작성한다.

## 문서 관리 규칙

의미 있는 변경이 있을 때 다음 원칙으로 문서를 갱신한다.

1. 다시 활용할 수 있는 기술적 문제와 해결 방법은 `TROUBLESHOOTING.md`에 기록한다.
2. 완료한 작업과 다음 작업은 이 문서에 반영한다.
3. 단순 철자나 일회성 변수명 오타는 기록하지 않는다.
4. API 키, 토큰, 비밀번호 등 비밀값을 기록하지 않는다.
5. 작업 완료 전 ESLint와 빌드를 확인한다.
