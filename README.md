# 제조현장 데일리 운영 브리핑

SKALA Full-Stack Engineering 과정의 Vue.js 실습 과제 1-8을 하나의 서비스로 발전시킨 프로젝트다.

- 배포 주소: https://skala-vue-factory-daily-briefing.vercel.app
- 저장소: https://github.com/ji0x0/skala-vue

## 무엇을 만들었나

공장 운영 담당자가 출근길에 확인하는 오늘의 공정 컨디션 브리핑이다.

실습 과제는 도시별 날씨를 보여주는 대시보드에서 시작한다. 여기에 "날씨를 왜 보는가"라는 목적을 붙여, 제조 현장의 하루 운영 판단에 필요한 세 가지 지표를 한 화면에 묶었다.

| 축 | 보는 것 | 판단에 쓰는 이유 |
| --- | --- | --- |
| 환경 리스크 | 사업장별 기온·습도 | 도장·건조·클린룸 공정 품질에 영향 |
| 에너지 기회 | 일사량 기반 태양광 발전 예측 | 자가발전량과 전력비 절감 여력 |
| 비용 변수 | 유가, 주요 통화 환율 | 물류·연료비와 원자재 수입 단가 |

가상의 사업장 6곳(서울·부산·대구·광주·대전·울산)을 관측 대상으로 두고, 각 사업장에 주요 공정과 태양광 설비 용량을 부여했다.

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
  ├──(키 불필요)──────────────────────> Open-Meteo, Frankfurter
  │
  └──(키 필요)──> api/ 서버리스 함수 ──> OpenWeather, 공공데이터포털, 오피넷
                   여기서 API 키를 붙인다
```

계층을 나눈 이유는 다음과 같다.

- **View와 Store 분리**: 같은 날씨 데이터를 브리핑 화면과 상세 화면이 함께 쓴다. 화면마다 따로 받아오면 중복 호출이 생기고 단위 변경 같은 설정이 화면 간에 어긋난다.
- **Store와 Service 분리**: Store는 "무엇을 보관하고 어떻게 계산할지", Service는 "어디로 요청할지"만 맡는다. API 주소나 파라미터가 바뀔 때 화면 코드를 건드리지 않는다.
- **서버리스 함수 분리**: 키가 필요한 API를 브라우저에서 직접 부르면 키가 노출된다. 자세한 내용은 아래 "API 키 처리"에 적었다.

### 폴더 구조

```text
api/                      서버리스 함수. API 키는 이 안에서만 사용한다
├── openweather.js
├── kpx.js
└── opinet.js

src/
├── components/
│   ├── exercise/         실습 1-3 결과물 (과제 요구 컴포넌트 격리 폴더)
│   ├── lab/              실습 4-8 개념 데모
│   ├── dashboard/        브리핑 대시보드 카드
│   └── common/           내비게이션
├── data/                 사업장·실습·트러블슈팅 콘텐츠 데이터
├── router/               라우트 규칙, 지연 로딩
├── services/             Axios 요청 함수
├── stores/               Pinia Store 5종
└── views/                페이지 단위 컴포넌트 8종
```

`components/exercise/`는 과제 명세가 지정한 격리 폴더라 그대로 두고, 이후에 만든 컴포넌트는 용도별로 나눴다. 실습 결과물과 확장 기능이 코드 구조에서도 구분된다.

`data/` 폴더를 둔 이유는 실습 아카이브와 트러블슈팅의 내용이 화면 로직이 아니라 콘텐츠이기 때문이다. 내용이 늘어나도 컴포넌트를 고칠 필요가 없다.

### API 키 처리

`VITE_` 접두사가 붙은 환경변수는 빌드할 때 클라이언트 번들에 문자열로 삽입된다. `.gitignore`로 저장소 노출은 막을 수 있지만, 배포된 사이트의 개발자 도구에서는 값이 그대로 보인다. 둘은 다른 문제다.

그래서 키가 필요한 API를 `api/` 서버리스 함수 뒤로 옮기고, 환경변수 이름에서 `VITE_` 접두사를 제거했다. 브라우저는 `/api/openweather?path=weather&q=Seoul,KR` 처럼 키가 없는 주소만 호출한다.

```bash
npm run build
grep -r "실제_키_값" dist/assets/    # 결과가 없어야 정상
```

앱의 `/labs/8` 화면에서도 클라이언트가 키에 접근할 수 있는지 직접 확인할 수 있다.

개발 서버는 서버리스 함수를 실행하지 않으므로, `vite.config.js`에 플러그인을 넣어 같은 파일을 미들웨어로 실행한다. 함수 코드가 한 벌이라 로컬과 배포가 갈라지지 않고 `npm run dev` 만으로 개발할 수 있다.

## 과제 요구사항 대비 확장한 내용

각 단계의 기본 요구사항은 모두 충족했고, 그 위에 아래 내용을 추가했다. 자세한 내역은 [EXTENSIONS.md](EXTENSIONS.md)에 있다.

| 과제 | 기본 요구사항 | 추가로 구현한 것 |
| --- | --- | --- |
| 1. Vue Syntax | v-for, v-if, 이벤트 수식어로 목업 구성 | 도시를 6개로 늘리고 습도·풍속 추가. `v-model` 드롭다운 두 개로 지역별 날씨를 비교하는 섹션 추가 |
| 2. Composition API | ref, computed, watch, watchEffect | 경보 기준 온도와 정렬 기준 상태 추가. 정렬 결과와 공정 리스크 요약 Computed 2종, Watcher 2종 추가 |
| 3. Vue Components | 4개 컴포넌트로 분리, scoped 스타일 | 전역 CSS에 몰려 있던 카드·검색창 스타일을 각 컴포넌트로 이전. 대시보드 카드 4종, 실습 데모 5종, 내비게이션을 별도 컴포넌트로 작성 |
| 4. Vue Router | 지연 로딩, Catch-all, 동적 경로 | View를 4개에서 8개로 확장(태양광 상세, 실습 아카이브, 실습 상세, 트러블슈팅). 전체 View 지연 로딩, `meta.title`로 문서 제목 자동 변경, 화면 전환 시 스크롤 초기화 |
| 5. Pinia | configStore 1종 | Store 4종 추가(날씨, 태양광, 유가, 환율). configStore에 화면 테마를 추가하고 설정을 localStorage에 저장해 재방문 시에도 유지 |
| 6. Axios | OpenWeather 연동 및 API 확장 | 외부 API 7종 연동. 요청 함수를 `services/`로 분리. 좌표가 필요한 요청은 순차, 독립적인 요청은 `Promise.all`로 병렬 처리 |
| 7. UI Libraries | 외부 UI 라이브러리 적용 | Element Plus를 내비게이션·표·타임라인·아코디언·통계·결과 화면까지 확대 적용. 다크 테마 변수를 적용하고 설정 패널을 el-popover와 el-switch로 구성 |
| 8. Build & Deployment | ESLint, 환경변수, 빌드, 배포 | API 키를 서버리스 함수로 이전해 브라우저 노출 차단. SPA 직접 접속 대응, 개발 서버용 함수 실행 플러그인 작성 |

### 과제에 없던 화면

- **실습 아카이브** (`/labs`, `/labs/:step`) — 실습 1단계부터 8단계까지 무엇을 요구했고 무엇을 추가했는지 정리했다. 실습 1-3은 당시 작성한 컴포넌트를 그대로 렌더링하고, 화면 결과물이 없는 4-8은 그 단계의 개념을 직접 조작해 볼 수 있는 데모를 만들었다. 데모는 설명용 목업이 아니라 실행 중인 앱의 실제 값을 읽는다.
- **트러블슈팅** (`/troubleshooting`) — 개발하면서 막혔던 지점과 원인, 해결 방법을 카테고리 필터와 검색으로 볼 수 있게 정리했다.

## 화면

| 경로 | 화면 |
| --- | --- |
| `/` | 운영 브리핑 (환경·에너지·비용 통합 대시보드) |
| `/weather/:cityId` | 사업장 기상 상세 (예보, 대기질, 공정 참고사항) |
| `/solar/:region` | 태양광 발전 상세 (일사량 예보와 실측 비교) |
| `/about` | 서비스 소개 |
| `/labs`, `/labs/:step` | 실습 아카이브 |
| `/troubleshooting` | 트러블슈팅 |
| 그 외 | 404 (Catch-all) |

## 사용한 외부 API

| API | 용도 | 키 | 호출 경로 |
| --- | --- | --- | --- |
| OpenWeather Current Weather | 사업장 실시간 날씨 | 필요 | 서버리스 함수 |
| OpenWeather 5 Day / 3 Hour Forecast | 단기 예보 | 필요 | 서버리스 함수 |
| 한국전력거래소 지역별 시간별 태양광 발전량 | 실측 발전량 | 필요 | 서버리스 함수 |
| 오피넷 평균 유가 | 전국·지역 유가와 추이 | 필요 | 서버리스 함수 |
| Open-Meteo Forecast | 일사량·일조시간 | 불필요 | 브라우저 직접 |
| Open-Meteo Air Quality | 대기질·미세먼지 | 불필요 | 브라우저 직접 |
| Frankfurter | 주요 6개 통화 환율 | 불필요 | 브라우저 직접 |

오피넷은 CORS 헤더를 제공하지 않아 브라우저에서 직접 호출할 수 없다. 서버리스 함수를 거치면서 키 노출과 CORS가 함께 해결됐다.

## 기술 스택

Vue 3 (Composition API), Vue Router, Pinia, Axios, Element Plus, Vite, ESLint

## 실행 방법

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

## 품질 검사와 빌드

```bash
npm run lint:eslint -- --no-fix
```

```bash
npm run build
```

## 배포

Vercel에 배포한다. 프로젝트 환경변수에 아래 세 개를 등록한다. 접두사 없는 이름을 쓴다.

- `OPENWEATHER_API_KEY`
- `DATA_GO_KR_API_KEY` (URL 디코딩된 값)
- `OPINET_API_KEY`

`api/` 폴더는 별도 설정 없이 서버리스 함수로 인식된다. 자세한 절차는 [EXTENSIONS.md](EXTENSIONS.md)의 "API 키 관리와 Vercel 배포"에 있다.

## 문서

- [EXTENSIONS.md](EXTENSIONS.md) — 서비스 컨셉, 과제별 완료 내역, 확장 기능 상세, 배포 절차
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — 개발 중 겪은 문제와 원인, 해결 방법
