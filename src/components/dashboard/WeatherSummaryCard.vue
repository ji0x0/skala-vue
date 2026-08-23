<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import { useConfigStore } from '@/stores/configStore.js'
import { useWeatherStore } from '@/stores/weatherStore.js'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

// 검색어와 상태바 문구를 반응형 상태로 둔다. (실습 1·2와 같은 구조)
const searchQuery = ref('')
const selectedSiteInfo = ref('')

// 표로 볼지 카드로 볼지 고른다. 카드 보기는 실습 3에서 만든 부품을 그대로 쓴다.
const viewMode = ref('table')

const convertTemp = (temp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32)
  }

  return Math.round(temp * 10) / 10
}

/** 검색어가 사업장명·지역·공정 중 하나에 포함되면 남긴다. */
const filteredSites = computed(() => {
  const query = searchQuery.value.trim()

  if (query === '') return weatherStore.weatherList

  return weatherStore.weatherList.filter(
    (item) =>
      item.siteName.includes(query) || item.city.includes(query) || item.process.includes(query),
  )
})

/** 검색 결과 안내 문구 */
const searchNotice = computed(() => {
  if (searchQuery.value.trim() === '') return ''
  if (filteredSites.value.length === 0) return '검색 결과와 일치하는 사업장이 없습니다.'

  return `검색한 사업장 ${filteredSites.value.length}곳을 표시합니다.`
})

/** 기온·습도 기준을 넘으면 공정 점검 대상으로 표시한다. */
const riskLevel = (item) => {
  if (item.temp >= weatherStore.tempThreshold && item.humidity >= weatherStore.humidityThreshold) {
    return { type: 'danger', label: '고온·다습' }
  }
  if (item.temp >= weatherStore.tempThreshold) return { type: 'warning', label: '고온' }
  if (item.humidity >= weatherStore.humidityThreshold) return { type: 'warning', label: '다습' }

  return { type: 'success', label: '정상' }
}

const headline = computed(() => {
  const { riskCount, count } = weatherStore.summary

  if (count === 0) return '사업장 환경 데이터를 불러오는 중입니다.'
  if (riskCount === 0) return '전 사업장 환경 조건이 정상 범위입니다.'

  return `${riskCount}개 사업장이 공정 점검 기준을 초과했습니다.`
})

/** 아무 사업장도 고르지 않았을 때 상태바에 표시할 기본 문구 */
const defaultStatus = computed(
  () => `현재 ${weatherStore.weatherList.length}곳의 사업장이 등록되어 있습니다.`,
)

const statusText = computed(() => selectedSiteInfo.value || defaultStatus.value)

// 행이나 카드를 누르면 상태바 문구가 바뀐다.
const handleSelectSite = (item) => {
  selectedSiteInfo.value = `${item.siteName}이 선택되었습니다.`
}

// WeatherCard는 완성된 문구를 넘겨주므로 그대로 받는다.
const handleCardSelect = (message) => {
  selectedSiteInfo.value = message
}

// 상세보기는 행 클릭과 겹치지 않도록 버블링을 막고 이동한다.
const handleDetail = (item) => {
  router.push(`/weather/${item.id}`)
}

// 상태바 문구가 바뀔 때마다 콘솔에 기록한다. (실습 2의 watch 활용)
watch(selectedSiteInfo, (newInfo) => {
  if (newInfo) console.log(`[watch 감지] 선택된 사업장 -> "${newInfo}"`)
})
</script>

<template>
  <el-card
    v-loading="weatherStore.isLoading"
    class="briefing-card"
    shadow="hover"
    element-loading-text="사업장 환경 데이터를 불러오는 중입니다..."
  >
    <template #header>
      <div class="card-header">
        <strong>🌡️ 환경 리스크 — 사업장별 기온·습도</strong>
        <el-tag :type="weatherStore.summary.riskCount > 0 ? 'warning' : 'success'" size="small">
          경보 {{ weatherStore.summary.riskCount }}곳
        </el-tag>
      </div>
    </template>

    <p v-if="weatherStore.loadError" class="api-message error">{{ weatherStore.loadError }}</p>

    <template v-else>
      <p class="headline">{{ headline }}</p>

      <div class="stat-row">
        <el-statistic
          title="평균 기온"
          :value="convertTemp(weatherStore.summary.avgTemp)"
          :precision="1"
          :suffix="configStore.unitSymbol"
        />
        <el-statistic title="평균 습도" :value="weatherStore.summary.avgHumidity" suffix="%" />
        <el-statistic title="관측 사업장" :value="weatherStore.summary.count" suffix="곳" />
      </div>

      <!-- 사업장 검색: v-model 없이 :value와 @input으로 처리한다. -->
      <SearchBar
        :current-query="searchQuery"
        placeholder="사업장, 지역, 공정으로 검색"
        echo-label="검색 중인 사업장"
        @update-query="(value) => (searchQuery = value)"
      />

      <p v-if="searchNotice" class="search-notice">{{ searchNotice }}</p>

      <div class="view-switch">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button value="table">표로 보기</el-radio-button>
          <el-radio-button value="card">카드로 보기</el-radio-button>
        </el-radio-group>
        <small>카드 보기는 실습 3에서 만든 컴포넌트를 그대로 사용합니다.</small>
      </div>

      <el-table
        v-if="viewMode === 'table' && filteredSites.length"
        :data="filteredSites"
        size="small"
        style="width: 100%"
        @row-click="handleSelectSite"
      >
        <el-table-column prop="siteName" label="사업장" min-width="130" />
        <el-table-column prop="process" label="공정" min-width="90" />
        <el-table-column label="기온" min-width="80">
          <template #default="{ row }">
            {{ convertTemp(row.temp) }}{{ configStore.unitSymbol }}
          </template>
        </el-table-column>
        <el-table-column prop="humidity" label="습도(%)" min-width="80" />
        <el-table-column label="상태" min-width="90">
          <template #default="{ row }">
            <el-tag :type="riskLevel(row).type" size="small">{{ riskLevel(row).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="" min-width="90">
          <template #default="{ row }">
            <!-- 행 클릭 이벤트로 번지지 않도록 .stop 을 붙인다. -->
            <el-button size="small" plain @click.stop="handleDetail(row)">상세보기</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 카드 보기: 실습 3의 BaseDashboardCard와 WeatherCard를 재사용한다. -->
      <BaseDashboardCard v-if="viewMode === 'card' && filteredSites.length">
        <WeatherCard
          v-for="item in filteredSites"
          :key="item.id"
          :city-item="{ ...item, city: item.siteName }"
          @select-card="handleCardSelect"
          @click-detail="handleDetail"
        />
      </BaseDashboardCard>

      <!-- 상태바: 선택 전에는 등록 사업장 수를, 선택 후에는 고른 사업장을 알린다. -->
      <div class="status-bar">{{ statusText }}</div>
    </template>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.headline {
  margin: 0 0 14px;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);
}

.view-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 14px 0 10px;
}

.view-switch small {
  color: var(--el-text-color-secondary);
}

.search-notice {
  margin: 10px 0 0;
  color: var(--el-color-primary);
  font-size: 13px;
}

.status-bar {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  background-color: var(--el-color-success-light-9);
  color: var(--el-color-success);
  text-align: center;
  font-size: 13px;
}

:deep(.el-table__row) {
  cursor: pointer;
}
</style>
