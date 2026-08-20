<script setup>
defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div
    class="weather-card"
    @click="emit('select-card', `${cityItem.city}이 선택되었습니다.`)"
  >
    <h4>{{ cityItem.city }} ({{ cityItem.condition }})</h4>
    <p>현재 기온: {{ cityItem.temp }}°C</p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

    <button class="btn-detail" @click.stop="emit('click-detail', cityItem)">상세보기</button>
  </div>
</template>
