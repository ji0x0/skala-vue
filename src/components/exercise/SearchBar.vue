<script setup>
/**
 * 검색 입력 컴포넌트.
 *
 * v-model 대신 :value와 @input을 직접 다룬다. (실습 1 요구사항)
 * 한글은 조합 중에도 input 이벤트가 발생하므로, 값을 부모가 보관하고
 * 다시 :value로 내려주는 단방향 흐름이라야 입력 중 글자가 깨지지 않는다.
 */
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '검색할 도시 이름 입력',
  },
  // 입력값을 되비쳐 보여줄 때 앞에 붙는 문구. 빈 문자열이면 표시하지 않는다.
  echoLabel: {
    type: String,
    default: '검색 중인 도시',
  },
})

defineEmits(['update-query'])
</script>

<template>
  <div class="search-bar">
    <input
      type="text"
      :value="currentQuery"
      :placeholder="placeholder"
      @input="$emit('update-query', $event.target.value)"
    />
    <p v-if="echoLabel">
      {{ echoLabel }}: <strong>{{ currentQuery || '(입력 없음)' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 10px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
}

.search-bar input:focus {
  border-color: var(--el-color-primary);
  outline: none;
}

.search-bar p {
  margin: 8px 0 0;
  color: var(--el-text-color-regular);
}
</style>
