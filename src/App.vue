<template>
  <div class="app">
    <!-- 动态背景 -->
    <div class="background" :class="backgroundClass">
      <div class="vortex"></div>
      <div class="particles">
        <span v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></span>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="content">
      <!-- 头部 -->
      <header class="header">
        <h1 class="logo">
          <span class="logo-icon">🎹</span>
          <span class="logo-text">Vortex Keyboard</span>
        </h1>
        <nav class="nav">
          <button @click="currentView = 'levels'" :class="{ active: currentView === 'levels' }" class="nav-btn">
            🎮 关卡
          </button>
          <button @click="currentView = 'achievements'" :class="{ active: currentView === 'achievements' }" class="nav-btn">
            🏆 成就
          </button>
          <button @click="currentView = 'stats'" :class="{ active: currentView === 'stats' }" class="nav-btn">
            📊 统计
          </button>
          <button @click="showSettings = true" class="nav-btn">
            ⚙️ 设置
          </button>
        </nav>
      </header>

      <!-- 成就面板 -->
      <AchievementsPanel
        v-if="currentView === 'achievements' && !isPlaying"
      />

      <!-- 关卡选择 -->
      <LevelSelect
        v-if="currentView === 'levels' && !isPlaying"
        @select="startGame"
      />

      <!-- 游戏界面 -->
      <GameBoard
        v-if="isPlaying"
        :level-id="currentLevelId"
        @complete="handleComplete"
        @error="playErrorSound"
      />

      <!-- 结算画面 -->
      <ResultModal
        v-if="showResult"
        :stats="lastStats!"
        :level-id="currentLevelId"
        @next="nextLevel"
        @restart="restartLevel"
        @back="backToLevels"
      />

      <!-- 设置面板 -->
      <SettingsModal
        v-if="showSettings"
        @close="showSettings = false"
      />

      <!-- 统计页面 -->
      <div v-if="currentView === 'stats' && !isPlaying" class="stats-view">
        <h2 class="stats-title">📊 我的统计</h2>
        <div class="stats-cards">
          <div class="stats-card">
            <div class="stats-icon">⏱️</div>
            <div class="stats-value">{{ userStore.getTotalPlayTimeFormatted() }}</div>
            <div class="stats-label">总练习时长</div>
          </div>
          <div class="stats-card">
            <div class="stats-icon">🎯</div>
            <div class="stats-value">{{ userStore.stats.totalLevelsCompleted }}</div>
            <div class="stats-label">关卡完成数</div>
          </div>
          <div class="stats-card">
            <div class="stats-icon">🔥</div>
            <div class="stats-value">{{ userStore.getBestCombo() }}</div>
            <div class="stats-label">最高连击</div>
          </div>
          <div class="stats-card">
            <div class="stats-icon">⌨️</div>
            <div class="stats-value">{{ userStore.stats.totalCharacters }}</div>
            <div class="stats-label">总字符数</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import LevelSelect from '@/components/LevelSelect.vue'
import GameBoard from '@/components/GameBoard.vue'
import ResultModal from '@/components/ResultModal.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import AchievementsPanel from '@/components/AchievementsPanel.vue'

const gameStore = useGameStore()
const userStore = useUserStore()

// 初始化加载用户数据
userStore.loadStats()

const currentView = ref<'levels' | 'stats' | 'achievements' | 'game'>('levels')
const currentLevelId = ref(1)
const isPlaying = ref(false)
const showResult = ref(false)
const showSettings = ref(false)
const lastStats = ref<{ time: number; accuracy: number; combo: number; chars: number } | null>(null)

const backgroundClass = computed(() => ({
  'bg-fast': gameStore.state.speed > 1.3,
  'bg-normal': gameStore.state.speed <= 1.3,
}))

function getParticleStyle(_index: number) {
  const delay = Math.random() * 5
  const duration = 3 + Math.random() * 4
  const left = Math.random() * 100
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--left': `${left}%`,
  }
}

function startGame(levelId: number) {
  currentLevelId.value = levelId
  isPlaying.value = true
  currentView.value = 'game'
  gameStore.setLevel(levelId)
}

function handleComplete(stats: { time: number; accuracy: number; combo: number; chars: number }) {
  lastStats.value = stats
  showResult.value = true
}

function nextLevel() {
  showResult.value = false
  currentLevelId.value++
  isPlaying.value = true
  gameStore.setLevel(currentLevelId.value)
}

function restartLevel() {
  showResult.value = false
  isPlaying.value = true
  gameStore.resetGame()
  gameStore.startGame()
}

function backToLevels() {
  showResult.value = false
  isPlaying.value = false
  currentView.value = 'levels'
}

function playErrorSound() {
  // TODO: 实现音效
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 动态背景 */
.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
  overflow: hidden;
}

.background.bg-fast {
  animation: pulse-slow 1s infinite;
}

.vortex {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
  animation: spin 30s linear infinite;
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  left: var(--left);
  bottom: -20px;
  animation: float-up var(--duration) ease-in infinite;
  animation-delay: var(--delay);
}

.content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

/* 头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .header {
    padding: 0.75rem 1rem;
    flex-direction: column;
    text-align: center;
  }
  
  .logo {
    margin-bottom: 0.5rem;
  }
  
  .nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
}

@media (max-width: 768px) {
  .logo-icon {
    font-size: 1.75rem;
  }
}

.logo-text {
  font-size: 2rem;
  font-family: 'Fredoka One', cursive;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .logo-text {
    font-size: 1.5rem;
  }
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .nav-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn.active {
  background: white;
  color: #764ba2;
}

/* 统计页面 */
.stats-view {
  padding: 2rem;
}

.stats-title {
  font-size: 2rem;
  font-family: 'Fredoka One', cursive;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-card {
    padding: 1rem;
  }
  
  .stats-icon {
    font-size: 2rem;
  }
  
  .stats-value {
    font-size: 1.75rem;
  }
  
  .stats-label {
    font-size: 0.75rem;
  }
}

.stats-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.stats-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.stats-value {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Fredoka One', cursive;
  color: #292F36;
  margin-bottom: 0.5rem;
}

.stats-label {
  font-size: 1rem;
  color: #6B7280;
}

/* 动画 */
@keyframes spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes float-up {
  from {
    transform: translateY(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    transform: translateY(-100vh);
    opacity: 0;
  }
}
</style>
