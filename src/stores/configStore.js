import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const UNIT_KEY = 'briefing.unit'
const THEME_KEY = 'briefing.theme'

/** 저장된 설정이 없으면 운영체제 설정을 따른다. */
const detectInitialTheme = () => {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useConfigStore = defineStore('config', () => {
  // ===== state =====
  // 1. 단위를 저장하는 변수 (초기값은 'celsius')
  const unit = ref(localStorage.getItem(UNIT_KEY) === 'fahrenheit' ? 'fahrenheit' : 'celsius')

  // 2. 화면 테마 ('light' 또는 'dark')
  const theme = ref(detectInitialTheme())

  // ===== getters =====
  // 현재 단위 상태에 맞춰 화면에 뿌릴 기호(℃ / ℉)를 실시간 리턴
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

  const unitLabel = computed(() => (unit.value === 'celsius' ? '섭씨(℃)' : '화씨(℉)'))

  const isDark = computed(() => theme.value === 'dark')

  const themeLabel = computed(() => (isDark.value ? '다크 모드' : '라이트 모드'))

  // ===== actions =====
  // 버튼 클릭 시 'celsius'와 'fahrenheit'를 토글(스위칭)하는 함수
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function setUnit(value) {
    unit.value = value === 'fahrenheit' ? 'fahrenheit' : 'celsius'
  }

  function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  function setTheme(value) {
    theme.value = value === 'dark' ? 'dark' : 'light'
  }

  /** Element Plus는 html의 dark 클래스를 보고 색상 변수를 바꾼다. */
  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // 값이 바뀔 때마다 화면에 반영하고 브라우저에 저장한다.
  watch(theme, (value) => {
    applyTheme()
    localStorage.setItem(THEME_KEY, value)
  })

  watch(unit, (value) => {
    localStorage.setItem(UNIT_KEY, value)
  })

  applyTheme()

  return {
    unit,
    theme,
    unitSymbol,
    unitLabel,
    isDark,
    themeLabel,
    toggleUnit,
    setUnit,
    toggleTheme,
    setTheme,
  }
})
