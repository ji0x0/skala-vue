<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 환경변수가 주입됐는지만 확인한다.
 * 키 값 자체는 화면에 절대 출력하지 않고 길이만 표시한다.
 */
const ENV_KEYS = [
  { name: 'VITE_OPENWEATHER_API_KEY', use: 'OpenWeather 날씨·예보' },
  { name: 'VITE_DATA_GO_KR_API_KEY', use: '전력거래소 태양광 실측' },
  { name: 'VITE_OPINET_API_KEY', use: '오피넷 유가' },
]

const envStatus = computed(() =>
  ENV_KEYS.map((item) => {
    const value = import.meta.env[item.name]

    return {
      name: item.name,
      use: item.use,
      injected: Boolean(value),
      length: value ? String(value).length : 0,
    }
  }),
)

const buildInfo = computed(() => [
  { label: '실행 모드', value: import.meta.env.MODE },
  { label: '개발 서버 여부', value: import.meta.env.DEV ? 'DEV (npm run dev)' : 'PROD (빌드 결과)' },
  { label: 'BASE_URL', value: import.meta.env.BASE_URL },
])

// Catch-all 라우트가 실제로 동작하는지 이동하지 않고 확인한다.
const checkPath = ref('/존재하지-않는-주소')

const catchAllResult = computed(() => {
  const match = router.resolve(checkPath.value || '/')

  return { name: match.name, isNotFound: match.name === 'NotFound' }
})

const CHECKLIST = [
  { item: 'ESLint Error 0건', how: 'npm run lint:eslint -- --no-fix', done: true },
  { item: '프로덕션 빌드 성공', how: 'npm run build', done: true },
  { item: '.env를 .gitignore로 제외', how: 'git status에 .env가 보이지 않음', done: true },
  { item: '.env.example로 필요한 키 안내', how: '키 이름만 기록, 값은 없음', done: true },
  { item: 'SPA 직접 접속 대응', how: 'vercel.json rewrite', done: true },
  { item: '화면 단위 코드 분할', how: '라우터 지연 로딩 (8개 View)', done: true },
]
</script>

<template>
  <div class="quality-demo">
    <el-alert type="info" :closable="false" class="intro">
      이 화면은 지금 실행 중인 앱의 실제 빌드 정보를 읽어서 보여줍니다.
      <strong>API 키 값은 출력하지 않고</strong> 주입 여부와 길이만 표시합니다.
    </el-alert>

    <h4>환경변수 주입 상태</h4>
    <el-table :data="envStatus" size="small" style="width: 100%">
      <el-table-column prop="name" label="변수명" min-width="220" />
      <el-table-column prop="use" label="용도" min-width="150" />
      <el-table-column label="주입" min-width="80">
        <template #default="{ row }">
          <el-tag :type="row.injected ? 'success' : 'danger'" size="small">
            {{ row.injected ? '정상' : '없음' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="길이" min-width="70">
        <template #default="{ row }">{{ row.length }}자</template>
      </el-table-column>
    </el-table>

    <el-alert type="warning" :closable="false" class="warn">
      <strong>주의:</strong> <code>VITE_</code> 접두사가 붙은 변수는 빌드 시 클라이언트 번들에
      문자열로 삽입됩니다. <code>.gitignore</code>는 저장소 노출만 막을 뿐,
      배포된 사이트의 개발자 도구에서는 키가 보입니다.
      완전히 숨기려면 서버리스 함수를 두고 키를 서버에만 보관해야 합니다.
    </el-alert>

    <h4>빌드 정보</h4>
    <el-descriptions :column="1" border size="small">
      <el-descriptions-item v-for="info in buildInfo" :key="info.label" :label="info.label">
        {{ info.value }}
      </el-descriptions-item>
    </el-descriptions>

    <h4>Catch-all 라우트 동작 확인</h4>
    <el-input v-model="checkPath" size="small" placeholder="아무 주소나 입력해 보세요">
      <template #prepend>주소</template>
      <template #append>
        <el-tag :type="catchAllResult.isNotFound ? 'warning' : 'success'" size="small">
          {{ catchAllResult.name }}
        </el-tag>
      </template>
    </el-input>
    <p class="note">
      등록되지 않은 주소는 <code>/:pathMatch(.*)*</code> 규칙이 받아 404 화면으로 보냅니다.
      배포 환경에서는 <code>vercel.json</code>의 rewrite가 먼저 <code>index.html</code>을
      돌려줘야 이 규칙이 동작합니다.
    </p>

    <h4>품질 관리 체크리스트</h4>
    <el-table :data="CHECKLIST" size="small" style="width: 100%">
      <el-table-column label="" width="50">
        <template #default="{ row }">{{ row.done ? '✅' : '⬜' }}</template>
      </el-table-column>
      <el-table-column prop="item" label="항목" min-width="180" />
      <el-table-column prop="how" label="확인 방법" min-width="230" />
    </el-table>
  </div>
</template>

<style scoped>
.intro {
  margin-bottom: 16px;
}

h4 {
  margin: 20px 0 8px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
  font-size: 14px;
}

h4:first-of-type {
  margin-top: 0;
}

.warn {
  margin-top: 12px;
  line-height: 1.7;
}

.note {
  margin: 10px 0 0;
  color: #606266;
  line-height: 1.7;
}

code {
  padding: 1px 5px;
  border-radius: 4px;
  background-color: #f5f7fa;
  font-size: 12px;
}
</style>
