# Vue.js 과제

## 과제 1. Weather Mockup
Vue의 기본 디렉티브와 이벤트 처리를 활용한 지역별 날씨 화면입니다.

### 과제 요구사항
- [x] `v-for`를 사용한 날씨 카드 반복 출력
- [x] 도시 `id`를 `:key`에 바인딩
- [x] `v-if`, `v-else`를 사용한 기온별 라벨 출력
- [x] `:value`, `@input`을 사용한 한글 도시 검색
- [x] 카드 클릭 시 선택한 도시를 상태바에 표시
- [x] `@click.stop`을 사용한 이벤트 버블링 방지
- [x] 상세 날씨를 `window.alert`로 출력

### 추가 구현 기능
두 도시의 날씨를 비교하는 기능을 추가했습니다.
- `v-model`을 사용해 드롭다운에서 비교할 도시 선택
- `v-for`로 도시 선택 옵션 반복 출력
- `v-if`, `v-else-if`, `v-else`로 선택 상태에 따른 안내 및 비교 결과 출력
- `Array.find()`를 사용하는 `getSelectedCity()` 함수로 선택한 도시 데이터 조회
날씨 데이터에 `humidity`, `wind` 속성을 추가하여 습도와 풍속 정보를 안내하는 기능을 추가했습니다.

### 주요 파일
- `src/AppWeather.vue`
- `src/components/WeatherMockup.vue`
- `src/assets/WeatherStyle.css`