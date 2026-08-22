<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TROUBLES, TROUBLE_CATEGORIES } from '@/data/troubleshooting.js'

const router = useRouter()

const activeCategory = ref('전체')
const keyword = ref('')

const filteredTroubles = computed(() => {
  const query = keyword.value.trim().toLowerCase()

  return TROUBLES.filter((item) => {
    const matchCategory =
      activeCategory.value === '전체' || item.category === activeCategory.value

    if (!matchCategory) return false
    if (!query) return true

    return (
      item.title.toLowerCase().includes(query) ||
      item.symptom.toLowerCase().includes(query) ||
      item.solution.toLowerCase().includes(query)
    )
  })
})

/** 카테고리별 건수 요약 */
const categoryCounts = computed(() =>
  TROUBLE_CATEGORIES.filter((name) => name !== '전체').map((name) => ({
    name,
    count: TROUBLES.filter((item) => item.category === name).length,
  })),
)
</script>

<template>
  <div class="trouble-view">
    <section class="view-head">
      <div>
        <h2>🛠️ 트러블슈팅 기록</h2>
        <small>개발하면서 실제로 막혔던 지점과 원인, 해결 방법을 남겼습니다.</small>
      </div>
      <el-tag type="info" size="large">총 {{ TROUBLES.length }}건</el-tag>
    </section>

    <div class="count-row">
      <el-tag v-for="item in categoryCounts" :key="item.name" size="small" effect="plain">
        {{ item.name }} {{ item.count }}건
      </el-tag>
    </div>

    <div class="filter-row">
      <el-radio-group v-model="activeCategory" size="small">
        <el-radio-button v-for="name in TROUBLE_CATEGORIES" :key="name" :value="name">
          {{ name }}
        </el-radio-button>
      </el-radio-group>

      <el-input
        v-model="keyword"
        size="small"
        class="search-input"
        placeholder="증상이나 해결 방법 검색"
        clearable
      />
    </div>

    <el-empty v-if="filteredTroubles.length === 0" description="검색 결과가 없습니다." />

    <el-collapse v-else class="trouble-collapse">
      <el-collapse-item v-for="item in filteredTroubles" :key="item.id" :name="item.id">
        <template #title>
          <div class="item-title">
            <el-tag size="small" effect="plain">{{ item.category }}</el-tag>
            <span>{{ item.title }}</span>
            <el-tag size="small" type="info">실습 {{ item.step }}</el-tag>
          </div>
        </template>

        <div class="item-body">
          <div class="block">
            <strong>증상</strong>
            <p>{{ item.symptom }}</p>
          </div>

          <div class="block">
            <strong>원인</strong>
            <ul>
              <li v-for="(reason, index) in item.cause" :key="index">{{ reason }}</li>
            </ul>
          </div>

          <div class="block">
            <strong>해결</strong>
            <p>{{ item.solution }}</p>
            <pre v-if="item.code"><code>{{ item.code }}</code></pre>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-button class="back-btn" type="primary" plain @click="router.push('/')">
      ← 브리핑으로 돌아가기
    </el-button>
  </div>
</template>

<style scoped>
.view-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.view-head h2 {
  margin: 0 0 2px;
}

.view-head small {
  color: var(--el-text-color-secondary);
}

.count-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.search-input {
  max-width: 260px;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-right: 12px;
  text-align: left;
}

/* 펼친 내용이 제목선에 붙지 않도록 안쪽 여백(padding)을 준다. */
.item-body {
  margin-bottom: 4px;
  padding: 18px 20px;
  border-radius: 8px;
  background-color: var(--el-fill-color-lighter);
}

/* 제목 줄에도 좌우 여백을 맞춰 준다. */
.trouble-collapse :deep(.el-collapse-item__header) {
  padding: 0 4px;
}

.trouble-collapse :deep(.el-collapse-item__content) {
  padding-bottom: 12px;
}

.block {
  margin-bottom: 16px;
}

.block:last-child {
  margin-bottom: 0;
}

.block strong {
  display: block;
  margin-bottom: 4px;
  color: var(--el-color-primary);
  font-size: 13px;
}

.block p {
  margin: 0;
  line-height: 1.6;
}

.block ul {
  margin: 0;
  padding-left: 18px;
  line-height: 1.7;
}

pre {
  margin: 8px 0 0;
  padding: 10px 12px;
  border-radius: 6px;
  background-color: var(--el-fill-color-light);
  overflow-x: auto;
  font-size: 12px;
}

.back-btn {
  margin-top: 20px;
}
</style>
