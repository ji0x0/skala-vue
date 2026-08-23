<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { SITES } from '@/data/sites.js'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useSolarStore } from '@/stores/solarStore.js'
import { useFuelStore } from '@/stores/fuelStore.js'
import { useExchangeStore } from '@/stores/exchangeStore.js'

const router = useRouter()

// 판단 기준은 화면에 적어두지 않고 각 Store에서 실제 사용 중인 값을 읽어 온다.
// 기준을 바꾸면 이 표도 함께 바뀌므로 설명과 동작이 어긋나지 않는다.
const weatherStore = useWeatherStore()
const solarStore = useSolarStore()
const fuelStore = useFuelStore()
const exchangeStore = useExchangeStore()

/** 사업장 상태를 어떤 기준으로 나누는지 */
const riskRules = computed(() => [
  {
    label: '고온·다습',
    type: 'danger',
    condition: `기온 ${weatherStore.tempThreshold}℃ 이상이면서 습도 ${weatherStore.humidityThreshold}% 이상`,
    meaning: '설비 과열과 결로가 동시에 우려됩니다. 우선 점검 대상입니다.',
  },
  {
    label: '고온',
    type: 'warning',
    condition: `기온 ${weatherStore.tempThreshold}℃ 이상`,
    meaning: '설비 과열과 작업자 온열질환에 유의해야 합니다.',
  },
  {
    label: '다습',
    type: 'warning',
    condition: `습도 ${weatherStore.humidityThreshold}% 이상`,
    meaning: '도장·건조 공정 품질과 결로를 점검해야 합니다.',
  },
  {
    label: '정상',
    type: 'success',
    condition: '위 조건에 해당하지 않음',
    meaning: '환경 조건이 정상 범위입니다.',
  },
])

/** 지표별 계산식과 판단 기준 */
const metricRules = computed(() => [
  {
    metric: '공정 점검 대상',
    formula: `기온 ${weatherStore.tempThreshold}℃ 이상 또는 습도 ${weatherStore.humidityThreshold}% 이상`,
    note: '둘 중 하나만 넘어도 경보로 집계합니다.',
  },
  {
    metric: '태양광 예상 발전량',
    formula: `일사량(kWh/m²) × 설비용량(kWp) × 성능비 ${solarStore.performanceRatio}`,
    note: '설비용량은 일사량 1,000W/m² 기준으로 정의되어 그대로 곱합니다.',
  },
  {
    metric: '등가가동시간',
    formula: '오늘 발전량(kWh) ÷ 설비용량(kWp)',
    note: '정격 출력으로 몇 시간 돌린 것과 같은지를 뜻합니다. 설비 용량이 달라도 그대로 비교할 수 있어 사업장 간 발전 여건을 견주는 데 씁니다.',
  },
  {
    metric: '전력비 절감액',
    formula: `예상 발전량(kWh) × ${solarStore.powerUnitPrice}원`,
    note: '산업용 전력 단가 가정치입니다.',
  },
  {
    metric: '대기질 등급',
    formula: '환경부 통합대기환경지수(CAI): 좋음 0-50, 보통 51-100, 나쁨 101-250, 매우 나쁨 251 이상',
    note: 'PM10과 PM2.5 농도를 각각 지수로 환산해 더 나쁜 쪽을 대표값으로 씁니다.',
  },
  {
    metric: '유가 추세',
    formula: `최근 7일 등락률이 ±${fuelStore.trendThreshold}% 를 넘으면 상승·하락으로 표시`,
    note: '자동차용 경유 전국 평균가를 기준으로 합니다.',
  },
  {
    metric: '환율 추세',
    formula: `최근 ${exchangeStore.historyDays}일 등락률이 ±${exchangeStore.changeThreshold}% 를 넘으면 강세·약세로 표시`,
    note: '원/달러 환율을 기준으로 합니다.',
  },
])

const VALUES = [
  {
    icon: '🌡️',
    title: '환경 리스크',
    body: '사업장별 기온과 습도로 공정 품질에 영향을 주는 환경 변수를 확인합니다. 기준을 넘어서면 점검 대상으로 표시합니다.',
    source: 'OpenWeather Current Weather / 5 Day Forecast, Open-Meteo Air Quality',
  },
  {
    icon: '☀️',
    title: '에너지 기회',
    body: '일사량 예보로 오늘의 태양광 자가발전 기대치를 계산하고, 전력거래소 실측 발전량과 나란히 비교합니다.',
    source: 'Open-Meteo Forecast, 한국전력거래소 지역별 시간별 태양광 발전량',
  },
  {
    icon: '⛽',
    title: '비용 변수',
    body: '전국 평균 유가와 주요 통화 환율로 물류·연료비와 원자재 수입 단가의 방향을 함께 봅니다.',
    source: '오피넷 평균 유가, Frankfurter 환율',
  },
]

const TECH = [
  { name: 'Vue 3 Composition API', use: '반응형 상태와 화면 로직' },
  { name: 'Vue Router', use: '브리핑·상세·아카이브 화면 전환과 지연 로딩' },
  { name: 'Pinia', use: '날씨·태양광·유가·환율·단위 설정 상태 관리' },
  { name: 'Axios', use: '5종 외부 API 연동과 로딩·오류 처리' },
  { name: 'Element Plus', use: '메뉴·카드·표·타임라인 등 UI 구성' },
  { name: 'Vite', use: '개발 서버, 프록시, 프로덕션 빌드' },
]
</script>

<template>
  <div class="about-view">
    <section class="hero">
      <h2>🏭 제조현장 데일리 운영 브리핑</h2>
      <p class="lead">
        공장 운영 담당자가 출근길에 확인하는, 오늘의 공정 컨디션 브리핑입니다.
      </p>
    </section>

    <el-card class="purpose-card" shadow="hover">
      <p>
        공정은 날씨 하나로만 결정되지 않습니다. 기온·습도 같은 환경 조건은 공정 품질에,
        일조량은 태양광 자가발전량과 전력비 절감 여력에, 유가와 환율은 물류·연료비와
        원자재 수입 단가에 영향을 줍니다.
      </p>
      <p class="strong-line">
        이 서비스는 흩어져 있는 세 가지 지표를 하나의 화면에 묶어,
        담당자가 아침에 <strong>5초 안에 "오늘 무엇을 신경 써야 하는지"</strong> 판단할 수 있게 돕습니다.
      </p>
    </el-card>

    <h3 class="section-title">핵심 가치</h3>
    <div class="value-grid">
      <el-card v-for="value in VALUES" :key="value.title" shadow="hover" class="value-card">
        <div class="value-icon">{{ value.icon }}</div>
        <strong>{{ value.title }}</strong>
        <p>{{ value.body }}</p>
        <small>자료: {{ value.source }}</small>
      </el-card>
    </div>

    <h3 class="section-title">판단 기준</h3>
    <p class="section-desc">
      화면에 표시되는 경보와 코멘트는 아래 기준으로 계산합니다.
      실제 서비스에서 쓰는 값을 그대로 읽어와 표시하므로 설명과 동작이 어긋나지 않습니다.
    </p>

    <h4 class="sub-title">사업장 상태</h4>
    <el-table :data="riskRules" size="small" style="width: 100%">
      <el-table-column label="표시" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.type" size="small">{{ row.label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="condition" label="조건" min-width="220" />
      <el-table-column prop="meaning" label="의미" min-width="260" />
    </el-table>

    <h4 class="sub-title">지표 계산식</h4>
    <el-table :data="metricRules" size="small" style="width: 100%">
      <el-table-column prop="metric" label="지표" min-width="130" />
      <el-table-column prop="formula" label="계산식 · 기준" min-width="280" />
      <el-table-column prop="note" label="참고" min-width="230" />
    </el-table>

    <el-alert type="info" :closable="false" class="rule-note">
      기온 표시는 상단 설정에서 섭씨와 화씨를 전환할 수 있습니다.
      기준값 자체는 섭씨로 판정하며, 화면 표시만 바뀝니다.
    </el-alert>

    <h3 class="section-title">관측 대상 사업장</h3>
    <el-table :data="SITES" size="small" style="width: 100%">
      <el-table-column prop="siteName" label="사업장" min-width="140" />
      <el-table-column prop="city" label="지역" min-width="70" />
      <el-table-column prop="process" label="주요 공정" min-width="100" />
      <el-table-column label="태양광 설비" min-width="100">
        <template #default="{ row }">{{ row.capacityKw }} kWp</template>
      </el-table-column>
    </el-table>

    <h3 class="section-title">사용 기술</h3>
    <el-descriptions :column="1" border size="small">
      <el-descriptions-item v-for="tech in TECH" :key="tech.name" :label="tech.name">
        {{ tech.use }}
      </el-descriptions-item>
    </el-descriptions>

    <el-alert type="info" :closable="false" class="note">
      이 서비스는 SKALA Full-Stack Engineering 과정의 Vue.js 실습 과제로 제작했습니다.
      실습 1~8단계의 진행 과정은 실습 아카이브에서, 개발 중 겪은 문제는 트러블슈팅에서 볼 수 있습니다.
    </el-alert>

    <div class="actions">
      <el-button type="primary" @click="router.push('/')">브리핑 화면으로 이동</el-button>
      <el-button @click="router.push('/labs')">실습 아카이브 보기</el-button>
      <el-button @click="router.push('/troubleshooting')">트러블슈팅 보기</el-button>
    </div>
  </div>
</template>

<style scoped>
.hero {
  margin-bottom: 18px;
}

.hero h2 {
  margin: 0 0 6px;
}

.lead {
  margin: 0;
  color: var(--el-text-color-regular);
  font-size: 15px;
}

.purpose-card p {
  margin: 0 0 10px;
  line-height: 1.75;
}

.purpose-card p:last-child {
  margin-bottom: 0;
}

.strong-line {
  color: var(--el-text-color-primary);
}

.section-title {
  margin: 26px 0 12px;
  padding-left: 8px;
  border-left: 3px solid var(--el-color-primary);
}

.section-desc {
  margin: 0 0 14px;
  color: var(--el-text-color-regular);
  line-height: 1.7;
}

.sub-title {
  margin: 18px 0 8px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.rule-note {
  margin-top: 14px;
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px;
}

.value-card {
  height: 100%;
}

.value-icon {
  margin-bottom: 6px;
  font-size: 26px;
}

.value-card p {
  margin: 6px 0 10px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.value-card small {
  color: var(--el-text-color-secondary);
}

.note {
  margin-top: 24px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>
