<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

/**
 * 클라이언트에서 API 키에 접근이 되는지 실제로 시도해 본다.
 * 서버리스 함수로 옮긴 뒤에는 전부 undefined 여야 정상이다.
 */
const KEY_NAMES = [
  { name: 'OPENWEATHER_API_KEY', use: 'OpenWeather 날씨·예보' },
  { name: 'DATA_GO_KR_API_KEY', use: '전력거래소 태양광 실측' },
  { name: 'OPINET_API_KEY', use: '오피넷 유가' },
]

const keyAccess = computed(() =>
  KEY_NAMES.map((item) => {
    // VITE_ 접두사가 붙은 옛 이름과 새 이름 양쪽을 모두 시도한다.
    const withPrefix = import.meta.env[`VITE_${item.name}`]
    const withoutPrefix = import.meta.env[item.name]
    const leaked = Boolean(withPrefix || withoutPrefix)

    return { name: item.name, use: item.use, leaked }
  }),
)

const allSafe = computed(() => keyAccess.value.every((item) => !item.leaked))

/** import.meta.env에 실제로 무엇이 들어 있는지 그대로 보여준다. */
const clientEnvKeys = computed(() => Object.keys(import.meta.env).sort())

const buildInfo = computed(() => [
  { label: '실행 모드', value: import.meta.env.MODE },
  { label: '개발 서버 여부', value: import.meta.env.DEV ? 'DEV (npm run dev)' : 'PROD (빌드 결과)' },
  { label: 'BASE_URL', value: import.meta.env.BASE_URL },
])

// 키 없이도 서버 함수를 통해 데이터를 받아오는지 확인한다.
const proxyResult = ref(null)
const proxyError = ref('')
const isTesting = ref(false)

const testProxy = async () => {
  isTesting.value = true
  proxyResult.value = null
  proxyError.value = ''

  try {
    const response = await axios.get('/api/openweather', {
      params: { path: 'weather', q: 'Seoul,KR' },
    })

    proxyResult.value = {
      requestUrl: '/api/openweather?path=weather&q=Seoul,KR',
      status: response.status,
      city: response.data.name,
      temp: response.data.main?.temp,
    }
  } catch (error) {
    proxyError.value = `${error.message} (status: ${error.response?.status ?? '없음'})`
  } finally {
    isTesting.value = false
  }
}

const checkPath = ref('/존재하지-않는-주소')

const catchAllResult = computed(() => {
  const match = router.resolve(checkPath.value || '/')

  return { name: match.name, isNotFound: match.name === 'NotFound' }
})

const CHECKLIST = [
  { item: 'ESLint Error 0건', how: 'npm run lint:eslint -- --no-fix', done: true },
  { item: '프로덕션 빌드 성공', how: 'npm run build', done: true },
  { item: '.env를 .gitignore로 제외', how: 'git status에 .env가 보이지 않음', done: true },
  { item: 'API 키를 서버로 분리', how: 'api/ 서버리스 함수에서만 사용', done: true },
  { item: '빌드 결과에 키 없음', how: 'grep -r "키" dist/assets/ → 결과 없음', done: true },
  { item: 'SPA 직접 접속 대응', how: 'vercel.json rewrite (api 경로 제외)', done: true },
  { item: '화면 단위 코드 분할', how: '라우터 지연 로딩 (8개 View)', done: true },
]
</script>

<template>
  <div class="quality-demo">
    <el-alert type="info" :closable="false" class="intro">
      이 화면은 지금 실행 중인 앱에서 <strong>실제로 API 키에 접근을 시도</strong>한 결과입니다.
      키를 서버리스 함수로 옮긴 뒤에는 클라이언트에서 읽을 수 없어야 정상입니다.
    </el-alert>

    <h4>클라이언트에서 API 키 접근 시도</h4>
    <el-table :data="keyAccess" size="small" style="width: 100%">
      <el-table-column prop="name" label="키 이름" min-width="200" />
      <el-table-column prop="use" label="용도" min-width="150" />
      <el-table-column label="브라우저에서 읽힘?" min-width="140">
        <template #default="{ row }">
          <el-tag :type="row.leaked ? 'danger' : 'success'" size="small">
            {{ row.leaked ? '노출됨 (위험)' : '읽을 수 없음' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-alert
      :type="allSafe ? 'success' : 'error'"
      :closable="false"
      class="verdict"
    >
      <template v-if="allSafe">
        <strong>안전합니다.</strong>
        세 개 키 모두 클라이언트 코드에서 접근할 수 없습니다.
        <code>VITE_</code> 접두사를 떼고 <code>api/</code> 서버리스 함수로 옮겼기 때문에,
        빌드 결과물에도 키가 포함되지 않고 개발자 도구의 Network 탭에도 나타나지 않습니다.
      </template>
      <template v-else>
        <strong>키가 노출되어 있습니다.</strong>
        <code>VITE_</code> 접두사가 붙은 변수는 빌드 시 번들에 삽입됩니다.
      </template>
    </el-alert>

    <h4>클라이언트 번들이 실제로 가진 환경변수 전체</h4>
    <div class="env-list">
      <el-tag v-for="key in clientEnvKeys" :key="key" size="small" effect="plain">
        {{ key }}
      </el-tag>
    </div>
    <p class="note">
      Vite가 클라이언트에 넘겨주는 값은 위가 전부입니다. API 키 이름이 하나도 없습니다.
      <code>VITE_</code> 접두사가 없는 변수는 <code>process.env</code>로만 읽을 수 있고,
      그건 서버에서만 동작합니다.
    </p>

    <h4>키 없이 데이터를 받아오는지 확인</h4>
    <el-button type="primary" size="small" :loading="isTesting" @click="testProxy">
      /api/openweather 호출해 보기
    </el-button>

    <el-alert v-if="proxyError" type="error" :closable="false" class="proxy-box">
      요청 실패: {{ proxyError }}
    </el-alert>

    <el-descriptions v-else-if="proxyResult" :column="1" border size="small" class="proxy-box">
      <el-descriptions-item label="브라우저가 보낸 주소">
        <code>{{ proxyResult.requestUrl }}</code>
      </el-descriptions-item>
      <el-descriptions-item label="응답 상태">
        <el-tag type="success" size="small">HTTP {{ proxyResult.status }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="받아온 데이터">
        {{ proxyResult.city }} · {{ proxyResult.temp }}℃
      </el-descriptions-item>
      <el-descriptions-item label="해석">
        주소에 키가 없는데도 데이터가 왔습니다. 키는 서버가 붙였습니다.
        개발자 도구 Network 탭에서도 이 주소만 보입니다.
      </el-descriptions-item>
    </el-descriptions>

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
      배포 환경의 rewrite 규칙은 <code>/api/</code> 경로를 제외해야 서버 함수가 가려지지 않습니다.
    </p>

    <h4>품질 관리 체크리스트</h4>
    <el-table :data="CHECKLIST" size="small" style="width: 100%">
      <el-table-column label="" width="50">
        <template #default="{ row }">{{ row.done ? '✅' : '⬜' }}</template>
      </el-table-column>
      <el-table-column prop="item" label="항목" min-width="180" />
      <el-table-column prop="how" label="확인 방법" min-width="250" />
    </el-table>
  </div>
</template>

<style scoped>
.intro {
  margin-bottom: 16px;
}

h4 {
  margin: 22px 0 8px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
  font-size: 14px;
}

h4:first-of-type {
  margin-top: 0;
}

.verdict {
  margin-top: 12px;
  line-height: 1.8;
}

.env-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.proxy-box {
  margin-top: 12px;
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
