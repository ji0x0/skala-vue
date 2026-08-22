<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LABS, findLabByStep } from '@/data/labs.js'

const route = useRoute()
const router = useRouter()

/** 실습 결과물은 해당 화면에 들어올 때만 불러온다. */
const LIVE_COMPONENTS = {
  WeatherMockup: defineAsyncComponent(
    () => import('@/components/exercise/WeatherMockup.vue'),
  ),
  WeatherComposition: defineAsyncComponent(
    () => import('@/components/exercise/WeatherComposition.vue'),
  ),
  WeatherParent: defineAsyncComponent(
    () => import('@/components/exercise/WeatherParent.vue'),
  ),
  Lab4RouterDemo: defineAsyncComponent(() => import('@/components/lab/Lab4RouterDemo.vue')),
  Lab5StoreDemo: defineAsyncComponent(() => import('@/components/lab/Lab5StoreDemo.vue')),
  Lab6AxiosDemo: defineAsyncComponent(() => import('@/components/lab/Lab6AxiosDemo.vue')),
  Lab7UiDemo: defineAsyncComponent(() => import('@/components/lab/Lab7UiDemo.vue')),
  Lab8QualityDemo: defineAsyncComponent(() => import('@/components/lab/Lab8QualityDemo.vue')),
}

const lab = computed(() => findLabByStep(route.params.step))

const liveComponent = computed(() =>
  lab.value?.liveComponent ? LIVE_COMPONENTS[lab.value.liveComponent] : null,
)

const prevLab = computed(() => (lab.value ? findLabByStep(lab.value.step - 1) : null))
const nextLab = computed(() => (lab.value ? findLabByStep(lab.value.step + 1) : null))
</script>

<template>
  <div class="lab-detail">
    <el-result
      v-if="!lab"
      icon="warning"
      title="해당 실습 단계를 찾을 수 없습니다"
      :sub-title="`실습 단계는 1부터 ${LABS.length}까지 있습니다.`"
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/labs')">실습 아카이브로 이동</el-button>
      </template>
    </el-result>

    <template v-else>
      <el-page-header @back="router.push('/labs')">
        <template #content>
          <strong>실습 {{ lab.step }} · {{ lab.title }}</strong>
        </template>
      </el-page-header>

      <el-card class="intro-card" shadow="hover">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="단원">{{ lab.unit }}</el-descriptions-item>
          <el-descriptions-item label="단계">실습 {{ lab.step }}</el-descriptions-item>
          <el-descriptions-item label="요약" :span="2">{{ lab.summary }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <div class="detail-grid">
        <el-card shadow="hover">
          <template #header><strong>📋 과제 요구사항</strong></template>
          <ul class="check-list">
            <li v-for="(item, index) in lab.requirements" :key="index">
              <span class="check">✅</span>{{ item }}
            </li>
          </ul>
        </el-card>

        <el-card shadow="hover">
          <template #header><strong>⭐ 개인 확장 내역</strong></template>
          <ul class="check-list">
            <li v-for="(item, index) in lab.customization" :key="index">
              <span class="check">➕</span>{{ item }}
            </li>
          </ul>
        </el-card>
      </div>

      <el-card v-if="liveComponent" class="live-card" shadow="hover">
        <template #header>
          <div class="live-head">
            <strong>▶️ {{ lab.step <= 3 ? '당시 실습 결과물 실행' : '핵심 개념 데모' }}</strong>
            <el-tag size="small" type="success">실제 동작하는 컴포넌트</el-tag>
          </div>
        </template>

        <el-alert type="info" :closable="false" class="live-alert">
          <template v-if="lab.step <= 3">
            아래는 실습 {{ lab.step }}단계에서 작성한 컴포넌트를 그대로 렌더링한 것입니다.
            이후 단계에서 대시보드가 바뀌었어도 당시 결과물은 이 화면에서 계속 확인할 수 있습니다.
          </template>
          <template v-else>
            실습 {{ lab.step }}단계는 화면보다 구조를 바꾸는 단계라, 이 단계에서 배운 내용을
            직접 조작해 볼 수 있는 데모로 만들었습니다. 실제로 동작하는 이 앱의 값을 그대로 읽어 옵니다.
          </template>
        </el-alert>

        <div class="live-frame">
          <component :is="liveComponent" />
        </div>
      </el-card>

      <el-alert v-else type="warning" :closable="false" class="live-alert">
        이 단계는 실행 화면 대신 위의 요구사항과 확장 내역으로 정리했습니다.
      </el-alert>

      <div class="nav-actions">
        <el-button :disabled="!prevLab" @click="prevLab && router.push(`/labs/${prevLab.step}`)">
          ← {{ prevLab ? `실습 ${prevLab.step}` : '이전 없음' }}
        </el-button>
        <el-button type="primary" plain @click="router.push('/labs')">목록</el-button>
        <el-button :disabled="!nextLab" @click="nextLab && router.push(`/labs/${nextLab.step}`)">
          {{ nextLab ? `실습 ${nextLab.step}` : '다음 없음' }} →
        </el-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.intro-card {
  margin-top: 18px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.check-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.check-list li {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  line-height: 1.6;
}

.check-list li:last-child {
  margin-bottom: 0;
}

.check {
  flex-shrink: 0;
}

.live-card {
  margin-top: 18px;
}

.live-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.live-alert {
  margin-top: 18px;
  margin-bottom: 16px;
}

.live-frame {
  padding: 4px 12px 12px;
  border: 1px dashed var(--el-border-color-light);
  border-radius: 8px;
  background-color: var(--el-fill-color-lighter);
}

.nav-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
}
</style>
