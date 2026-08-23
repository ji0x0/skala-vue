<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSolarStore } from '@/stores/solarStore.js'

const router = useRouter()
const solarStore = useSolarStore()

const formatNumber = (value) => new Intl.NumberFormat('ko-KR').format(Math.round(value))

const headline = computed(() => {
  const best = solarStore.bestSite
  if (!best) return '태양광 발전 여건을 계산하는 중입니다.'

  return `오늘은 ${best.siteName}의 발전 여건이 가장 좋습니다. (기준 대비 ${best.utilization}%)`
})

/** 비율이 높을수록 진하게 표시해 한눈에 비교되게 한다. */
const rateType = (value) => {
  if (value >= 100) return 'success'
  if (value >= 70) return 'warning'

  return 'info'
}
</script>

<template>
  <el-card
    v-loading="solarStore.isLoading"
    class="briefing-card"
    shadow="hover"
    element-loading-text="일사량 데이터를 불러오는 중입니다..."
  >
    <template #header>
      <div class="card-header">
        <strong>☀️ 에너지 기회 — 오늘의 태양광 자가발전</strong>
        <el-tag type="success" size="small">
          {{ formatNumber(solarStore.totalGenerationToday) }} kWh
        </el-tag>
      </div>
    </template>

    <p v-if="solarStore.loadError" class="api-message error">{{ solarStore.loadError }}</p>

    <template v-else>
      <p class="headline">{{ headline }}</p>

      <div class="stat-row">
        <el-statistic
          title="오늘 예상 발전량"
          :value="solarStore.totalGenerationToday"
          suffix="kWh"
        />
        <el-statistic
          title="기대 전력비 절감"
          :value="Math.round(solarStore.expectedSavingToday / 10000)"
          suffix="만원"
        />
      </div>

      <!-- 설비 대비 발전 여건이 좋은 순. 비율이 같으면 발전량이 많은 곳을 앞에 둔다. -->
      <el-table :data="solarStore.rankedSites" size="small" style="width: 100%">
        <el-table-column prop="siteName" label="사업장" min-width="130" />
        <el-table-column label="설비" min-width="80">
          <template #default="{ row }">{{ row.capacityKw }}kWp</template>
        </el-table-column>
        <el-table-column label="오늘 / 기준" min-width="130">
          <template #default="{ row }">
            <strong>{{ formatNumber(row.generationToday) }}</strong>
            / {{ formatNumber(row.baselineGeneration) }} kWh
          </template>
        </el-table-column>
        <el-table-column label="기준 대비" min-width="90">
          <template #default="{ row }">
            <el-tag :type="rateType(row.utilization)" size="small">{{ row.utilization }}%</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="" min-width="80">
          <template #default="{ row }">
            <el-button size="small" plain @click.stop="router.push(`/solar/${row.region}`)">
              상세
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <small class="hint">
        기준 발전량은 일사량 {{ solarStore.referenceRadiation }}kWh/m²에 설비용량과
        성능비 {{ solarStore.performanceRatio }}를 적용한 값입니다. 설비 용량이 달라도
        기준 대비 비율로 사업장 간 여건을 비교할 수 있고, 아주 맑은 날은 100%를 넘습니다.
      </small>
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
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--el-color-warning-light-9);
}

.hint {
  display: block;
  margin-top: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}
</style>
