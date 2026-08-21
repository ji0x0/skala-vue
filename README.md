# Vue.js 날씨 애플리케이션

Vue 수업의 과제 1~8을 하나의 날씨 애플리케이션으로 발전시킨 프로젝트다. 목업 화면에서 시작해 Composition API, 컴포넌트, Vue Router, Pinia, Axios, Element Plus, 품질 검사와 배포 준비를 순서대로 적용했다.

## 주요 기능

- 서울·부산·대구·광주·대전·울산의 실시간 날씨 조회
- 도시 검색 및 상세 페이지 이동
- 섭씨·화씨 단위 변경
- OpenWeather 3시간 간격 단기 예보
- Open-Meteo 실시간 대기질 조회
- 로딩·오류·검색 결과 없음·404 화면 처리

## 기술 스택

- Vue 3, Vite
- Vue Router, Pinia, Axios, Element Plus
- OpenWeather Current Weather / 5 Day Forecast API
- Open-Meteo Air Quality API
- ESLint, oxlint, oxfmt

## 실행 방법

Node.js 20.19 이상이 필요하다.

```bash
npm install
```

프로젝트 최상위의 `.env.example`을 참고해 `.env` 파일을 만든다.

```env
VITE_OPENWEATHER_API_KEY=발급받은_API_키
```

```bash
npm run dev
```

환경변수를 수정한 경우 개발 서버를 반드시 다시 시작한다.

## 품질 검사와 빌드

```bash
npm run lint:eslint -- --no-fix
npm run build
npm run preview
```

빌드 결과는 `dist/` 폴더에 생성된다.

## 주요 구조

```text
src/
├── components/weather/   # 날씨 카드, 검색, 단위 변경 UI
├── router/               # 화면 경로 규칙
├── services/             # Axios API 요청 함수
├── stores/               # Pinia 단위 설정
├── views/                # 홈, 상세, 소개, 404 페이지
├── App.vue               # 공통 레이아웃
└── main.js               # Vue 앱 플러그인 등록
```

## 배포 준비

Vercel에서 이 GitHub 저장소를 가져온 뒤 프로젝트 환경변수에 `VITE_OPENWEATHER_API_KEY`를 등록하고 배포한다. `vercel.json`은 `/weather/city_01` 같은 주소로 직접 접속해도 Vue Router가 화면을 표시하도록 설정한다.

`VITE_` 환경변수는 브라우저 번들에 포함된다. 수업용 프론트엔드 과제에서는 사용할 수 있지만 실제 서비스에서는 서버 API를 중간에 두어 OpenWeather 키를 보호해야 한다.
