<template>
  <div class="app">
    <!-- 首页 -->
    <LandingPage v-if="showLanding" @start="handleStartGame" />

    <!-- 游戏主界面 -->
    <template v-else>
      <!-- 动态背景和音乐 -->
      <DynamicBackground
        v-if="currentLevelData"
        :colors="currentLevelData.colors"
        :bpm="currentLevelData.bpm"
        :theme="currentLevelData.theme"
        :show-bpm="isPlaying"
      />

      <!-- 主内容 -->
      <div class="content">
        <!-- 头部 -->
        <header class="header">
          <h1 class="logo">
            <span class="logo-icon">🎹</span>
            <span class="logo-text">Vortex Keyboard</span>
          </h1>
          <nav class="nav">
            <button @click="showLanding = true; isPlaying = false; music.stopLevel()" class="nav-btn">
              🏠 首页
            </button>
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import { useMusic } from '@/composables/useMusic'
import { useTheme } from '@/composables/useTheme'
import { useSound } from '@/composables/useSound'
import LandingPage from '@/components/LandingPage.vue'
import LevelSelect from '@/components/LevelSelect.vue'
import GameBoard from '@/components/GameBoard.vue'
import ResultModal from '@/components/ResultModal.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import AchievementsPanel from '@/components/AchievementsPanel.vue'
import DynamicBackground from '@/components/DynamicBackground.vue'
import { getLevel } from '@/data/levels'

const gameStore = useGameStore()
const userStore = useUserStore()
const music = useMusic()
const theme = useTheme()
const sound = useSound()

// 初始化加载
onMounted(() => {
  userStore.loadStats()
  music.loadSettings()
  sound.loadSettings()
  theme.loadTheme()
})

// 当前关卡的背景和音乐
const currentLevelData = computed(() => getLevel(currentLevelId.value))

const showLanding = ref(true)
const currentView = ref<'levels' | 'stats' | 'achievements' | 'game'>('levels')
const currentLevelId = ref(1)
const isPlaying = ref(false)
const showResult = ref(false)
const showSettings = ref(false)
const lastStats = ref<{ time: number; accuracy: number; combo: number; chars: number; wrongChars: number } | null>(null)

function handleStartGame() {
  showLanding.value = false
  currentView.value = 'levels'
}

function startGame(levelId: number) {
  currentLevelId.value = levelId
  isPlaying.value = true
  currentView.value = 'game'
  gameStore.setLevel(levelId)
  
  // 播放关卡音乐
  const level = getLevel(levelId)
  if (level) {
    music.playLevel(level.bpm, level.theme)
  }
}

function handleComplete(stats: { time: number; accuracy: number; combo: number; chars: number; wrongChars: number }) {
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
  music.stopLevel()
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

.content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  flex-wrap: wrap;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  font-size: 1.5rem;
  font-family: 'Fredoka One', cursive;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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
  flex: 1;
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

/* 响应式 */
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
  }
  
  .nav-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
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
</style>
