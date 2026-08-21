<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

// 모든 반응형 데이터와 핵심 로직은 부모 컴포넌트에서 관리한다.
const weatherlist = ref([
  { id: 'city_01', city: '서울', temp: 25, condition: '맑음', humidity: 60, wind: 5 },
  { id: 'city_02', city: '부산', temp: 22, condition: '흐림', humidity: 70, wind: 10 },
  { id: 'city_03', city: '대구', temp: 28, condition: '비', humidity: 80, wind: 15 },
  { id: 'city_04', city: '광주', temp: 24, condition: '비', humidity: 90, wind: 20 },
  { id: 'city_05', city: '대전', temp: 26, condition: '맑음', humidity: 50, wind: 3 },
  { id: 'city_06', city: '울산', temp: 23, condition: '흐림', humidity: 75, wind: 12 },
])

const searchQuery = ref('')
const selectedCityInfo = ref('날씨 카드를 클릭해 보세요')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (query === '') {
    return weatherlist.value
  }

  return weatherlist.value.filter((item) => item.city.includes(query))
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 선택된 도시 정보가 변경되었습니다. -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(
    `[watchEffect 자동호출] 현재 검색어 "${searchQuery.value}"에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

const showDetail = (weather) => {
  window.alert(
    `${weather.city}의 현재 날씨는 ${weather.condition}입니다.\n습도는 ${weather.humidity}%이고, 풍속은 ${weather.wind}km/h입니다.`,
  )
}
</script>

<template>
  <h1 class="assignment-title">⛅ 과제 3: 컴포넌트 분리</h1>

  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar
        :current-query="searchQuery"
        @update-query="(value) => (searchQuery = value)"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>지역별 날씨 현황</h3>

      <p v-if="searchQuery.trim() === ''">전체 도시의 날씨를 표시합니다.</p>
      <p v-else-if="filteredWeatherList.length">검색한 도시의 날씨를 표시합니다.</p>
      <p v-else>검색 결과와 일치하는 도시가 없습니다.</p>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(message) => (selectedCityInfo = message)"
        @click-detail="showDetail"
      />
    </BaseDashboardCard>

    <section class="status-bar">
      <p>{{ selectedCityInfo }}</p>
    </section>
  </div>
</template>

<style scoped>
/* 부모 컴포넌트는 레이아웃만 담당하고, 카드 디자인은 각 자식 컴포넌트가 가진다. */
.dashboard-wrapper > .status-bar {
  margin-top: 4px;
}
</style>
