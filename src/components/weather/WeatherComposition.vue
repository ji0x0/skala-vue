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

// 알림 대행 함수 (상세보기)
const showDetail = (weather) => {
  window.alert(
    `${weather.city}의 현재 날씨는 ${weather.condition}입니다.\n습도는 ${weather.humidity}%이고, 풍속은 ${weather.wind}km/h입니다.`,
  )
}
</script>

<template>
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

    <!-- 날씨 카드 목록-->
    <section class="weather-card-list">
      <h3>지역별 날씨 현황</h3>
      <!-- 검색어가 비어 있을 떄 -->
      <p v-if="searchQuery.trim() === ''">전체 도시의 날씨를 표시합니다.</p>
      <!-- 검색어가 있고, 검색 결과도 있을 떄 -->
      <p v-else-if="filteredWeatherList.length" >검색한 도시의 날씨를 표시합니다.</p>
      <!-- 검색어가 있지만, 검색 결과가 없을 떄 -->
      <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>
      <div
        v-for="item in filteredWeatherList"
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
  </div>
</template>
