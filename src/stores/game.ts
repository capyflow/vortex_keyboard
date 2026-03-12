import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface GameState {
  isPlaying: boolean
  isPaused: boolean
  combo: number
  maxCombo: number
  speed: number
  baseSpeed: number
  progress: number
  startTime: number | null
  elapsedTime: number
  correctChars: number
  totalChars: number
  currentLevel: number
}

const BASE_SPEED = 1 // 基础速度

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState>({
    isPlaying: false,
    isPaused: false,
    combo: 0,
    maxCombo: 0,
    speed: BASE_SPEED,
    baseSpeed: BASE_SPEED,
    progress: 0,
    startTime: null,
    elapsedTime: 0,
    correctChars: 0,
    totalChars: 0,
    currentLevel: 1,
  })

  const multiplier = computed(() => state.value.speed / BASE_SPEED)
  const accuracy = computed(() => {
    if (state.value.totalChars === 0) return 100
    return Math.round((state.value.correctChars / state.value.totalChars) * 100)
  })
  const wpm = computed(() => {
    if (state.value.elapsedTime === 0) return 0
    const minutes = state.value.elapsedTime / 60
    const words = state.value.correctChars / 5
    return Math.round(words / minutes)
  })

  function startGame() {
    state.value.isPlaying = true
    state.value.isPaused = false
    state.value.startTime = Date.now()
    state.value.elapsedTime = 0
  }

  function pauseGame() {
    state.value.isPaused = true
  }

  function resumeGame() {
    state.value.isPaused = false
  }

  function stopGame() {
    state.value.isPlaying = false
    state.value.isPaused = false
    state.value.startTime = null
  }

  function resetGame() {
    state.value = {
      isPlaying: false,
      isPaused: false,
      combo: 0,
      maxCombo: 0,
      speed: BASE_SPEED,
      baseSpeed: BASE_SPEED,
      progress: 0,
      startTime: null,
      elapsedTime: 0,
      correctChars: 0,
      totalChars: 0,
      currentLevel: state.value.currentLevel,
    }
  }

  function handleCorrectInput(charCount: number = 1) {
    state.value.combo++
    state.value.maxCombo = Math.max(state.value.maxCombo, state.value.combo)
    state.value.correctChars += charCount
    state.value.totalChars += charCount

    // 计算速度加成：连击越高速度越快，最高 +50%
    const bonus = Math.min(state.value.combo * 0.05, 0.5)
    state.value.speed = BASE_SPEED * (1 + bonus)
  }

  function handleWrongInput() {
    // 错误惩罚：连击越高惩罚越重
    const penalty = state.value.combo > 5 ? 0.4 : 0.2
    state.value.speed = Math.max(BASE_SPEED * (1 - penalty), BASE_SPEED * 0.5)
    state.value.combo = 0
  }

  function updateProgress(current: number, total: number) {
    state.value.progress = (current / total) * 100
  }

  function updateElapsedTime() {
    if (state.value.isPlaying && !state.value.isPaused && state.value.startTime) {
      state.value.elapsedTime = (Date.now() - state.value.startTime) / 1000
    }
  }

  function setLevel(level: number) {
    state.value.currentLevel = level
    resetGame()
  }

  return {
    state,
    multiplier,
    accuracy,
    wpm,
    startGame,
    pauseGame,
    resumeGame,
    stopGame,
    resetGame,
    handleCorrectInput,
    handleWrongInput,
    updateProgress,
    updateElapsedTime,
    setLevel,
  }
})
