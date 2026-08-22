<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

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

// computed 활용 실시간 검색 필터링 연산
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (query === '') {
    return weatherlist.value
  }
  return weatherlist.value.filter((item) => item.city.includes(query))
})

// watch 활용 선택 도시 추적 센서 (문구 변화 감지 및 후속 로그 처리)
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 선택된 도시 정보가 변경되었습니다. -> "${newInfo}"`)
})

//watcheffect 활용 searchQuery 감지 및 후속 로그 처리
watchEffect(() => {
  console.log(
    `[watchEffect 자동호출] 현재 검색어 "${searchQuery.value}"에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

// ===== 개인 추가 구현 (과제 2 요구사항 5) =====

// 추가 반응형 상태 1: 공정 경보 기준 온도 (사용자가 직접 조정)
const alertThreshold = ref(25)

// 추가 반응형 상태 2: 날씨 카드 정렬 기준
const sortOrder = ref('default')

// 추가 Computed 1: 검색 결과를 선택한 기준으로 정렬
const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]

  if (sortOrder.value === 'temp-desc') {
    return list.sort((a, b) => b.temp - a.temp)
  }

  if (sortOrder.value === 'temp-asc') {
    return list.sort((a, b) => a.temp - b.temp)
  }

  return list
})

// 추가 Computed 2: 화면에 표시 중인 도시들의 공정 리스크 요약
const processRiskSummary = computed(() => {
  const list = sortedWeatherList.value

  if (list.length === 0) {
    return { count: 0, avgTemp: 0, avgHumidity: 0, alertCount: 0 }
  }

  const sum = (key) => list.reduce((acc, item) => acc + item[key], 0)

  return {
    count: list.length,
    avgTemp: Math.round((sum('temp') / list.length) * 10) / 10,
    avgHumidity: Math.round(sum('humidity') / list.length),
    alertCount: list.filter((item) => item.temp >= alertThreshold.value).length,
  }
})

// 추가 Watcher 1: 경보 기준이 바뀌면 재계산된 경보 도시 수를 로그로 남긴다.
watch(alertThreshold, (newThreshold, oldThreshold) => {
  console.log(
    `[watch 추가] 공정 경보 기준 ${oldThreshold}℃ -> ${newThreshold}℃ / 경보 도시 ${processRiskSummary.value.alertCount}곳`,
  )
})

// 추가 Watcher 2: Computed 값 중 표시 건수만 골라 감시한다.
watch(
  () => processRiskSummary.value.count,
  (newCount, oldCount) => {
    console.log(`[watch 추가] 표시 중인 도시 수 ${oldCount}곳 -> ${newCount}곳`)
  },
)

// 알림 대행 함수 (상세보기)
const showDetail = (weather) => {
  window.alert(
    `${weather.city}의 현재 날씨는 ${weather.condition}입니다.\n습도는 ${weather.humidity}%이고, 풍속은 ${weather.wind}km/h입니다.`,
  )
}
</script>

<template>
  <h1 class="assignment-title">⛅ 과제 2: Composition API</h1>

  <div class="dashboard-wrapper">
    <!-- 도시 검색 -->
    <section class="search-box">
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <!-- 개인 추가: 경보 기준과 정렬을 조정하는 제어 패널 -->
    <section class="control-box">
      <h3>공정 경보 기준 설정</h3>
      <label>
        경보 기준 온도: <strong>{{ alertThreshold }}℃</strong>
        <input v-model.number="alertThreshold" type="range" min="15" max="35" />
      </label>
      <label>
        정렬 기준
        <select v-model="sortOrder">
          <option value="default">기본순</option>
          <option value="temp-desc">기온 높은순</option>
          <option value="temp-asc">기온 낮은순</option>
        </select>
      </label>
    </section>

    <!-- 개인 추가: Computed로 계산한 실시간 요약 -->
    <section class="summary-box">
      <span>표시 도시 <strong>{{ processRiskSummary.count }}</strong>곳</span>
      <span>평균 기온 <strong>{{ processRiskSummary.avgTemp }}</strong>℃</span>
      <span>평균 습도 <strong>{{ processRiskSummary.avgHumidity }}</strong>%</span>
      <span>경보 <strong>{{ processRiskSummary.alertCount }}</strong>곳</span>
    </section>

    <!-- 날씨 카드 목록-->
    <section class="weather-card-list">
      <h3>지역별 날씨 현황</h3>
      <!-- 검색어가 비어 있을 떄 -->
      <p v-if="searchQuery.trim() === ''">전체 도시의 날씨를 표시합니다.</p>
      <!-- 검색어가 있고, 검색 결과도 있을 떄 -->
      <p v-else-if="sortedWeatherList.length" >검색한 도시의 날씨를 표시합니다.</p>
      <!-- 검색어가 있지만, 검색 결과가 없을 떄 -->
      <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>
      <div
        v-for="item in sortedWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.city}이 선택되었습니다.`"
      >
        <h4>{{ item.city }} ({{ item.condition }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= alertThreshold" class="badge hot">
          🔥 공정 경보 ({{ alertThreshold }}도 이상)
        </span>
        <span v-else class="badge cool">❄️ 정상 ({{ alertThreshold }}도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item)">상세보기</button>
      </div>
    </section>

    <!-- 상태바 -->
    <section>
      <div class="status-bar">
        <p>{{ selectedCityInfo }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search-box,
.weather-card-list,
.control-box {
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

/* 개인 추가 섹션 */
.control-box {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.control-box h3 {
  flex-basis: 100%;
  margin: 0;
}

.control-box label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-box select {
  padding: 6px 10px;
}

.summary-box {
  display: flex;
  justify-content: space-around;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 10px;
  background-color: var(--el-color-primary-light-9);
  font-size: 14px;
}
</style>
