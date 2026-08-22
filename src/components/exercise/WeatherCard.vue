<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp // 기본 원본 데이터는 섭씨 숫자

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }

  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})
</script>

<template>
  <div
    class="weather-card"
    @click="emit('select-card', `${cityItem.city}이 선택되었습니다.`)"
  >
    <h4>{{ cityItem.city }} ({{ cityItem.condition }})</h4>
    <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

    <el-button class="btn-detail" size="small" @click.stop="emit('click-detail', cityItem)">
      상세보기
    </el-button>
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
  margin-bottom: 10px;
  padding: 14px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background-color: var(--el-bg-color);
  cursor: pointer;
}

.weather-card:last-child {
  margin-bottom: 0;
}

.weather-card h4,
.weather-card p {
  margin: 0 0 8px;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
}

.badge.hot {
  background-color: #ff5d73;
}

.badge.cool {
  background-color: #32b5e8;
}

.btn-detail {
  position: absolute;
  top: 14px;
  right: 14px;
}
</style>
