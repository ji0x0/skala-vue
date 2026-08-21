<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const route = useRoute()
const router = useRouter()

const MENUS = [
  { index: '/', label: '운영 브리핑', icon: '📋' },
  { index: '/about', label: '서비스 소개', icon: 'ℹ️' },
  { index: '/labs', label: '실습 아카이브', icon: '📚' },
  { index: '/troubleshooting', label: '트러블슈팅', icon: '🛠️' },
]

/** 상세 화면에서도 상위 메뉴가 선택된 상태로 보이게 한다. */
const activeIndex = computed(() => {
  const path = route.path

  if (path.startsWith('/labs')) return '/labs'
  if (path.startsWith('/weather') || path.startsWith('/solar')) return '/'
  if (path.startsWith('/troubleshooting')) return '/troubleshooting'
  if (path.startsWith('/about')) return '/about'

  return '/'
})

const handleSelect = (index) => {
  if (index !== route.path) {
    router.push(index)
  }
}
</script>

<template>
  <header class="nav-bar">
    <div class="brand" @click="handleSelect('/')">
      <span class="brand-mark">🏭</span>
      <div class="brand-text">
        <strong>제조현장 데일리 운영 브리핑</strong>
        <small>Factory Daily Briefing</small>
      </div>
    </div>

    <el-menu
      :default-active="activeIndex"
      class="nav-menu"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item v-for="menu in MENUS" :key="menu.index" :index="menu.index">
        {{ menu.icon }} {{ menu.label }}
      </el-menu-item>
    </el-menu>

    <UnitToggler />
  </header>
</template>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.brand-mark {
  font-size: 28px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.brand-text strong {
  font-size: 16px;
  color: #303133;
}

.brand-text small {
  color: #909399;
  font-size: 11px;
  letter-spacing: 0.04em;
}

.nav-menu {
  flex: 1 1 380px;
  border-bottom: 0;
}

.nav-menu :deep(.el-menu-item) {
  padding: 0 14px;
  font-size: 13px;
}

@media (max-width: 900px) {
  .nav-menu {
    flex-basis: 100%;
    order: 3;
  }
}
</style>
