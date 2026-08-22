<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/** 라우터에 등록된 규칙을 그대로 읽어와 표로 보여준다. */
const routeRules = computed(() =>
  router.options.routes.map((rule) => ({
    path: rule.path,
    name: rule.name,
    lazy: typeof rule.component === 'function',
    title: rule.meta?.title ?? '-',
  })),
)

// 주소를 입력하면 어떤 라우트에 매칭되는지 이동하지 않고 확인한다.
const testPath = ref('/weather/city_03')

const resolved = computed(() => {
  try {
    const match = router.resolve(testPath.value || '/')

    return {
      name: match.name,
      params: match.params,
      matched: match.matched.length > 0,
      isCatchAll: match.name === 'NotFound',
    }
  } catch {
    return { name: null, params: {}, matched: false, isCatchAll: false }
  }
})

const SAMPLE_PATHS = [
  '/weather/city_03',
  '/solar/ulsan',
  '/labs/7',
  '/이런주소는없다',
]
</script>

<template>
  <div class="router-demo">
    <el-alert type="info" :closable="false" class="intro">
      아래는 현재 이 앱에 실제로 등록된 라우터 설정입니다.
      주소를 입력하면 화면을 이동하지 않고 어떤 규칙에 매칭되는지 확인할 수 있습니다.
    </el-alert>

    <h4>현재 화면의 라우트 정보</h4>
    <el-descriptions :column="2" border size="small">
      <el-descriptions-item label="path">{{ route.path }}</el-descriptions-item>
      <el-descriptions-item label="name">{{ route.name }}</el-descriptions-item>
      <el-descriptions-item label="params">{{ JSON.stringify(route.params) }}</el-descriptions-item>
      <el-descriptions-item label="meta.title">{{ route.meta.title }}</el-descriptions-item>
    </el-descriptions>

    <h4>등록된 라우트 규칙</h4>
    <el-table :data="routeRules" size="small" style="width: 100%">
      <el-table-column prop="path" label="path" min-width="150" />
      <el-table-column prop="name" label="name" min-width="110" />
      <el-table-column prop="title" label="meta.title" min-width="100" />
      <el-table-column label="지연 로딩" min-width="80">
        <template #default="{ row }">
          <el-tag :type="row.lazy ? 'success' : 'danger'" size="small">
            {{ row.lazy ? '적용' : '미적용' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <h4>동적 경로 매칭 테스트</h4>
    <el-input v-model="testPath" size="small" placeholder="예: /weather/city_01">
      <template #prepend>주소</template>
    </el-input>

    <div class="sample-row">
      <el-button
        v-for="path in SAMPLE_PATHS"
        :key="path"
        size="small"
        text
        type="primary"
        @click="testPath = path"
      >
        {{ path }}
      </el-button>
    </div>

    <el-descriptions :column="1" border size="small" class="result">
      <el-descriptions-item label="매칭된 name">
        <el-tag :type="resolved.isCatchAll ? 'warning' : 'success'" size="small">
          {{ resolved.name }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="추출된 params">
        {{ JSON.stringify(resolved.params) }}
      </el-descriptions-item>
      <el-descriptions-item label="해석">
        {{
          resolved.isCatchAll
            ? '등록된 규칙이 없어 Catch-all 라우트가 404 화면을 담당합니다.'
            : '동적 세그먼트가 params로 추출되어 해당 View에 전달됩니다.'
        }}
      </el-descriptions-item>
    </el-descriptions>

    <h4>Programmatic Navigation</h4>
    <p class="note">
      실습 1~3에서는 상세보기가 <code>window.alert()</code>였지만,
      실습 4부터는 <code>router.push()</code>로 화면을 이동합니다.
    </p>
    <el-button size="small" type="primary" plain @click="router.push('/weather/city_01')">
      router.push('/weather/city_01') 실행
    </el-button>
  </div>
</template>

<style scoped>
.intro {
  margin-bottom: 16px;
}

h4 {
  margin: 20px 0 8px;
  padding-left: 8px;
  border-left: 3px solid var(--el-color-primary);
  font-size: 14px;
}

h4:first-of-type {
  margin-top: 0;
}

.sample-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin: 8px 0;
}

.result {
  margin-top: 10px;
}

.note {
  margin: 0 0 10px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

code {
  padding: 1px 5px;
  border-radius: 4px;
  background-color: var(--el-fill-color-light);
  font-size: 12px;
}
</style>
