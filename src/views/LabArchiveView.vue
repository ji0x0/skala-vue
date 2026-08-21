<script setup>
import { useRouter } from 'vue-router'
import { LABS } from '@/data/labs.js'

const router = useRouter()

/** 실습 결과물을 화면에서 직접 볼 수 있는 단계인지 표시한다. */
const hasLiveDemo = (lab) => Boolean(lab.liveComponent)
</script>

<template>
  <div class="lab-archive">
    <section class="view-head">
      <div>
        <h2>📚 실습 아카이브</h2>
        <small>
          이 서비스가 실습 1단계부터 8단계까지 어떻게 발전했는지 단계별로 기록했습니다.
        </small>
      </div>
      <el-tag type="info" size="large">전 {{ LABS.length }}단계</el-tag>
    </section>

    <el-timeline class="lab-timeline">
      <el-timeline-item
        v-for="lab in LABS"
        :key="lab.step"
        :timestamp="`실습 ${lab.step} · ${lab.unit}`"
        placement="top"
        type="primary"
        size="large"
      >
        <el-card shadow="hover" class="lab-card">
          <div class="lab-head">
            <strong>{{ lab.title }}</strong>
            <el-tag v-if="hasLiveDemo(lab)" size="small" type="success">실행 가능</el-tag>
          </div>

          <p class="lab-summary">{{ lab.summary }}</p>

          <div class="lab-meta">
            <el-tag size="small" effect="plain">요구사항 {{ lab.requirements.length }}개</el-tag>
            <el-tag size="small" effect="plain" type="warning">
              개인 확장 {{ lab.customization.length }}건
            </el-tag>
          </div>

          <el-button
            class="lab-btn"
            type="primary"
            link
            @click="router.push(`/labs/${lab.step}`)"
          >
            상세 보기 →
          </el-button>
        </el-card>
      </el-timeline-item>
    </el-timeline>

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
  margin-bottom: 20px;
}

.view-head h2 {
  margin: 0 0 2px;
}

.view-head small {
  color: #909399;
}

.lab-timeline {
  padding-left: 4px;
}

.lab-card {
  margin-bottom: 4px;
}

.lab-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.lab-summary {
  margin: 0 0 10px;
  color: #606266;
  line-height: 1.6;
}

.lab-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.lab-btn {
  margin-top: 8px;
  padding: 0;
}

.back-btn {
  margin-top: 12px;
}
</style>
