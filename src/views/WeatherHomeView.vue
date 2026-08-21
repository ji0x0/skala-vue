<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import { fetchCurrentWeather } from '@/services/weatherApi.js'

const router = useRouter()
const route = useRoute()

const cities = [
  { id: 'city_01', city: '서울', query: 'Seoul,KR' },
  { id: 'city_02', city: '부산', query: 'Busan,KR' },
  { id: 'city_03', city: '대구', query: 'Daegu,KR' },
  { id: 'city_04', city: '광주', query: 'Gwangju,KR' },
  { id: 'city_05', city: '대전', query: 'Daejeon,KR' },
  { id: 'city_06', city: '울산', query: 'Ulsan,KR' },
]

const weatherlist = ref([])
const isLoading = ref(false)
const loadError = ref('')

// 검색창에 입력
const searchQuery = ref('')

// 상태바에 표시할 문장
const selectedCityInfo = ref('날씨 카드를 클릭해 보세요')

const fetchRealTimeWeather = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const responses = await Promise.all(
      cities.map((item) =>
        fetchCurrentWeather(item.query),
      ),
    )

    weatherlist.value = responses.map((response, index) => ({
      id: cities[index].id,
      city: cities[index].city,
      temp: response.data.main.temp,
      condition: response.data.weather[0].description,
    }))
  } catch (error) {
    console.error('날씨 API 연동 실패:', error)
    loadError.value = '실시간 날씨 데이터를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

/// 초기 마운트 시 주소창의 쿼리(?search=) 스트링 읽어서 상태 복원
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }

  fetchRealTimeWeather()
})

// 타이핑될 때마다 주소창의 쿼리 스트링 값을 실시간 푸시 개편
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
      query: { search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherlist.value
  return weatherlist.value.filter((item) => item.city.includes(query))
})

// 자식 카드 컴포넌트의 상세보기 신호를 받으면 해당 ID 주소로 라우터 점프 실행
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 도시 검색 -->
    <BaseDashboardCard v-loading="isLoading" element-loading-text="날씨를 불러오는 중입니다...">
      <SearchBar :current-query="searchQuery" @update-query="(val) => searchQuery = val" />
    </BaseDashboardCard>

    <!-- 날씨 카드 목록-->
    <BaseDashboardCard>
      <h3>🏙️ 지역별 실시간 날씨 현황</h3>

      <p v-if="isLoading" class="api-message">실시간 날씨 데이터를 불러오는 중입니다...</p>
      <p v-else-if="loadError" class="api-message error">{{ loadError }}</p>

      <template v-else>
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => selectedCityInfo = msg"
          @click-detail="handleDetailJump(item.id)"
        />
        <p v-if="filteredWeatherList.length === 0" class="api-message">검색 결과가 없습니다.</p>
      </template>
    </BaseDashboardCard>
    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>
