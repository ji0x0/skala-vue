<script setup>
import { ref } from 'vue'

// 날씨 데이터
const weatherlist = ref([
  { id: 'city_01', city: '서울', temp: 25, condition: '맑음', humidity: 60, wind: 5 },
  { id: 'city_02', city: '부산', temp: 22, condition: '흐림', humidity: 70, wind: 10 },
  { id: 'city_03', city: '대구', temp: 28, condition: '비', humidity: 80, wind: 15 },
  { id: 'city_04', city: '광주', temp: 24, condition: '비', humidity: 90, wind: 20 },
  { id: 'city_05', city: '대전', temp: 26, condition: '맑음', humidity: 50, wind: 3 },
  { id: 'city_06', city: '울산', temp: 23, condition: '흐림', humidity: 75, wind: 12 },
])

// 검색창에 입력
const searchQuery = ref('')

// 상태바에 표시할 문장
const selectedCityInfo = ref('날씨 카드를 클릭해 보세요')

// 입력한 도시가 배열에 있는지 확인
const isCityFound = () => {
  return weatherlist.value.some((weather) => weather.city === searchQuery.value)
}

// 날씨 비교용 드롭다운
const leftCity = ref('')
const rightCity = ref('')

// 드롭다운에서 선택한 도시 찾기
const getSelectedCity = (cityId) => {
  return weatherlist.value.find((weather) => weather.id === cityId)
}

// 상세보기
const showDetail = (weather) => {
  window.alert(
    `${weather.city}의 현재 날씨는 ${weather.condition}입니다.\n습도는 ${weather.humidity}%이고, 풍속은 ${weather.wind}km/h입니다.`,
  )
}
</script>

<template>
  <h1 class="assignment-title">⛅ 과제 1: 날씨 목업</h1>

  <div class="dashboard-wrapper">
    <!-- 도시 검색 -->
    <section class="search-box">
      <h3>도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름을 입력하세요"
      />
      <!-- 검색어가 없을 때 -->
      <p v-if="searchQuery === ''">검색할 도시 이름을 입력하세요.</p>
      <!-- 입력한 도시 정보가 없을 때 -->
      <p v-else-if="!isCityFound()">
        <strong>{{ searchQuery }}</strong
        >의 날씨 정보를 알 수 없습니다.
      </p>
      <!-- 입력한 도시 정보가 있을 때 -->
      <p v-else>
        <strong>{{ searchQuery }}</strong
        >의 날씨 정보는 확인 가능합니다.
      </p>
    </section>

    <!-- 날씨 카드 목록-->
    <section class="weather-card-list">
      <h3>지역별 날씨 현황</h3>
      <div
        v-for="item in weatherlist"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.city}이 선택되었습니다.`"
      >
        <h4>{{ item.city }} ({{ item.condition }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item)">상세보기</button>
      </div>
    </section>

    <!-- 상태바 -->
    <section>
      <div class="status-bar">
        <p>{{ selectedCityInfo }}</p>
      </div>
    </section>

    <!-- 지역별 날씨 비교 -->
    <section class="weather-compare">
      <h3>지역별 날씨 비교</h3>
      <!-- 왼쪽 도시 선택 -->
      <label>
        왼쪽 도시
        <select v-model="leftCity">
          <option value="">도시 선택</option>
          <option v-for="item in weatherlist" :key="item.id" :value="item.id">
            {{ item.city }}
          </option>
        </select>
      </label>

      <strong> VS </strong>

      <!-- 오른쪽 도시 선택 -->
      <label>
        오른쪽 도시
        <select v-model="rightCity">
          <option value="">도시 선택</option>
          <option v-for="item in weatherlist" :key="item.id" :value="item.id">
            {{ item.city }}
          </option>
        </select>
      </label>
      <!-- 두 도시를 모두 선택하지 않은 경우 -->
      <p v-if="leftCity === '' || rightCity === ''">비교할 두 도시를 선택하세요.</p>
      <!-- 같은 도시를 선택한 경우 -->
      <p v-else-if="leftCity === rightCity">서로 다른 도시를 선택하세요.</p>
      <!-- 서로 다른 도시를 선택한 경우 -->
      <div v-else class="compare-result">
        <div class="compare-card">
          <h4>{{ getSelectedCity(leftCity).city }}</h4>
          <p>날씨:{{ getSelectedCity(leftCity).condition }}</p>
          <p>기온:{{ getSelectedCity(leftCity).temp }}°C</p>
          <p>습도:{{ getSelectedCity(leftCity).humidity }}%</p>
          <p>풍속:{{ getSelectedCity(leftCity).wind }}km/h</p>
        </div>
        <div class="compare-card">
          <h4>{{ getSelectedCity(rightCity).city }}</h4>
          <p>날씨:{{ getSelectedCity(rightCity).condition }}</p>
          <p>기온:{{ getSelectedCity(rightCity).temp }}°C</p>
          <p>습도:{{ getSelectedCity(rightCity).humidity }}%</p>
          <p>풍속:{{ getSelectedCity(rightCity).wind }}km/h</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search-box,
.weather-card-list,
.weather-compare {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background-color: var(--el-fill-color-light);
}

.search-box input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 10px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.weather-card {
  position: relative;
  margin-bottom: 10px;
  padding: 14px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background-color: var(--el-bg-color);
  cursor: pointer;
}

.weather-card:last-child {
  margin-bottom: 0;
}

.weather-card h4,
.weather-card p {
  margin: 0 0 8px;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
}

.badge.hot {
  background-color: #ff5d73;
}

.badge.cool {
  background-color: #32b5e8;
}

.btn-detail {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 6px 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-bg-color);
  cursor: pointer;
}

/* 지역별 날씨 비교 (개인 추가 기능) */
.weather-compare {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.weather-compare > h3,
.weather-compare > p {
  flex-basis: 100%;
}

.weather-compare > label {
  flex: 1;
  font-weight: bold;
}

.weather-compare select {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  padding: 10px;
}

.compare-result {
  display: flex;
  flex-basis: 100%;
  gap: 16px;
}

.compare-card {
  flex: 1;
  padding: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-color-primary-light-9);
}
</style>
