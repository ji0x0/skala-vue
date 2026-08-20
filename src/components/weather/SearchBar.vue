<script setup>
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

defineEmits(['update-query'])
</script>

<template>
  <div class="search-bar">
    <input
      type="text"
      :value="currentQuery"
      placeholder="검색할 도시 이름 입력"
      @input="$emit('update-query', $event.target.value)"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>
