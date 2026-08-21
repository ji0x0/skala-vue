<script setup>
import { useRouter } from 'vue-router'
import { SITES } from '@/data/sites.js'

const router = useRouter()

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
  color: #606266;
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
  color: #303133;
}

.section-title {
  margin: 26px 0 12px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
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
  color: #606266;
  line-height: 1.6;
}

.value-card small {
  color: #909399;
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
