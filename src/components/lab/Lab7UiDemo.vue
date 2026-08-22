<script setup>
import { ref } from 'vue'

/** 같은 데이터를 순수 HTML과 Element Plus로 각각 그려 비교한다. */
const sample = {
  site: '울산 화학플랜트',
  process: '화학 반응',
  temp: 26.1,
  humidity: 91,
  status: '다습',
}

const plainQuery = ref('')
const elementQuery = ref('')

const COMPONENT_MAP = [
  { before: '직접 만든 <nav> + <a>', after: 'el-menu / el-menu-item', where: '내비게이션' },
  { before: '<div class="card">', after: 'el-card', where: '대시보드 카드' },
  { before: '<table> 직접 스타일링', after: 'el-table / el-table-column', where: '사업장 목록' },
  { before: '<span class="badge">', after: 'el-tag', where: '공정 상태 표시' },
  { before: '숫자 + 단위 직접 조합', after: 'el-statistic', where: '요약 지표' },
  { before: '<ol> 나열', after: 'el-timeline', where: '실습 아카이브' },
  { before: '직접 만든 아코디언', after: 'el-collapse', where: '트러블슈팅' },
  { before: '<div class="not-found">', after: 'el-result', where: '404 화면' },
  { before: '로딩 문구 직접 토글', after: 'v-loading 디렉티브', where: 'API 로딩' },
]
</script>

<template>
  <div class="ui-demo">
    <el-alert type="info" :closable="false" class="intro">
      왼쪽은 실습 1~3에서 직접 CSS로 만든 UI, 오른쪽은 같은 내용을 Element Plus 컴포넌트로 바꾼 것입니다.
      둘 다 실제로 동작하니 직접 입력해 보고 비교해 보세요.
    </el-alert>

    <div class="compare-grid">
      <!-- 순수 HTML/CSS 버전 -->
      <section class="compare-col">
        <h4>직접 만든 UI</h4>

        <div class="plain-card">
          <div class="plain-search">
            <input v-model="plainQuery" type="text" placeholder="사업장 검색" />
            <button class="plain-btn">검색</button>
          </div>

          <h5>{{ sample.site }}</h5>
          <p>공정: {{ sample.process }}</p>
          <p>기온: {{ sample.temp }}℃ / 습도: {{ sample.humidity }}%</p>
          <span class="plain-badge">{{ sample.status }}</span>

          <div class="plain-stat">
            <div>
              <small>평균 기온</small>
              <strong>25.0℃</strong>
            </div>
            <div>
              <small>경보</small>
              <strong>5곳</strong>
            </div>
          </div>

          <p v-if="plainQuery" class="plain-echo">입력값: {{ plainQuery }}</p>
        </div>

        <ul class="cost-list">
          <li>스타일을 전부 직접 작성해야 한다</li>
          <li>포커스·호버·비활성 상태를 일일이 처리해야 한다</li>
          <li>화면이 늘어날수록 CSS가 빠르게 불어난다</li>
        </ul>
      </section>

      <!-- Element Plus 버전 -->
      <section class="compare-col">
        <h4>Element Plus 적용</h4>

        <el-card shadow="hover">
          <el-input v-model="elementQuery" size="small" placeholder="사업장 검색" clearable>
            <template #append>
              <el-button>검색</el-button>
            </template>
          </el-input>

          <h5 class="ep-title">{{ sample.site }}</h5>
          <p class="ep-line">공정: {{ sample.process }}</p>
          <p class="ep-line">기온: {{ sample.temp }}℃ / 습도: {{ sample.humidity }}%</p>
          <el-tag type="warning" size="small">{{ sample.status }}</el-tag>

          <div class="ep-stat">
            <el-statistic title="평균 기온" :value="25" :precision="1" suffix="℃" />
            <el-statistic title="경보" :value="5" suffix="곳" />
          </div>

          <p v-if="elementQuery" class="ep-echo">입력값: {{ elementQuery }}</p>
        </el-card>

        <ul class="cost-list">
          <li>상태별 스타일과 접근성 처리가 기본 제공된다</li>
          <li>화면이 늘어나도 같은 컴포넌트를 재사용한다</li>
          <li>대신 번들 크기가 커져 최적화가 필요하다</li>
        </ul>
      </section>
    </div>

    <h4 class="map-title">이 프로젝트에서 교체한 내역</h4>
    <el-table :data="COMPONENT_MAP" size="small" style="width: 100%">
      <el-table-column prop="where" label="적용 위치" min-width="110" />
      <el-table-column prop="before" label="교체 전" min-width="170" />
      <el-table-column prop="after" label="교체 후" min-width="170" />
    </el-table>
  </div>
</template>

<style scoped>
.intro {
  margin-bottom: 16px;
}

h4 {
  margin: 0 0 10px;
  padding-left: 8px;
  border-left: 3px solid var(--el-color-primary);
  font-size: 14px;
}

.map-title {
  margin-top: 22px;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 16px;
}

/* 직접 만든 UI 스타일 */
.plain-card {
  padding: 14px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background-color: var(--el-bg-color);
}

.plain-search {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.plain-search input {
  flex: 1;
  min-width: 0;
  padding: 7px 9px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.plain-btn {
  padding: 7px 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-fill-color-light);
  cursor: pointer;
}

.plain-card h5 {
  margin: 0 0 6px;
}

.plain-card p {
  margin: 0 0 6px;
  font-size: 13px;
}

.plain-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  background-color: #ff5d73;
  color: #ffffff;
  font-size: 12px;
}

.plain-stat {
  display: flex;
  gap: 20px;
  margin-top: 14px;
}

.plain-stat div {
  display: flex;
  flex-direction: column;
}

.plain-stat small {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.plain-stat strong {
  font-size: 19px;
}

.plain-echo,
.ep-echo {
  margin-top: 10px;
  color: var(--el-color-primary);
  font-size: 12px;
}

/* Element Plus 버전 보조 스타일 */
.ep-title {
  margin: 12px 0 6px;
}

.ep-line {
  margin: 0 0 6px;
  font-size: 13px;
}

.ep-stat {
  display: flex;
  gap: 20px;
  margin-top: 14px;
}

.cost-list {
  margin: 10px 0 0;
  padding-left: 18px;
  color: var(--el-text-color-regular);
  font-size: 12px;
  line-height: 1.7;
}
</style>
