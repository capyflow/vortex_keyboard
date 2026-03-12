<template>
  <div class="result-modal">
    <div class="modal-content">
      <div class="celebration" v-if="isNewRecord">
        <span class="confetti">🎉</span>
        <span class="confetti">✨</span>
        <span class="confetti">🎊</span>
      </div>
      
      <!-- 互动语句 -->
      <div class="interaction-message" v-if="interactionMessage">
        <div class="message-emoji">{{ interactionMessage.emoji }}</div>
        <div class="message-text">{{ interactionMessage.text }}</div>
      </div>
      
      <h2 class="title">{{ isNewRecord ? '🏆 新纪录!' : '✅ 完成!' }}</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-label">耗时</div>
          <div class="stat-value">{{ formatTime(stats.time) }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-label">准确率</div>
          <div class="stat-value">{{ stats.accuracy }}%</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-label">最高连击</div>
          <div class="stat-value">{{ stats.combo }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-label">WPM</div>
          <div class="stat-value">{{ wpm }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-label">正确字符</div>
          <div class="stat-value">{{ stats.chars }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">❌</div>
          <div class="stat-label">错误字符</div>
          <div class="stat-value">{{ stats.wrongChars }}</div>
        </div>
      </div>
      
      <div class="comparison" v-if="previousBest">
        <div class="comparison-item">
          <span class="label">之前最佳</span>
          <span class="value">{{ formatTime(previousBest) }}</span>
        </div>
        <div class="comparison-arrow">↓</div>
        <div class="comparison-item highlight">
          <span class="label">本次</span>
          <span class="value">{{ formatTime(stats.time) }}</span>
        </div>
        <div class="improvement" v-if="improvement > 0">
          提升了 {{ formatTime(improvement) }}!
        </div>
      </div>
      
      <div class="actions">
        <button @click="emit('next')" class="btn btn-primary" v-if="hasNextLevel">
          下一关 →
        </button>
        <button @click="emit('restart')" class="btn btn-secondary">
          🔄 再玩一次
        </button>
        <button @click="emit('back')" class="btn btn-outline">
          ← 返回关卡选择
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSound } from '@/composables/useSound'
import { getInteractionMessage, type LevelStats } from '@/data/interactions'
import { levels } from '@/data/levels'

const sound = useSound()

// 播放完成音效
onMounted(() => {
  sound.loadSettings()
  sound.playComplete()
})

// 计算互动语句
const interactionStats = computed<LevelStats>(() => {
  if (!props.stats) {
    return {
      accuracy: 0,
      wpm: 0,
      time: 0,
      combo: 0,
      chars: 0,
      wrongChars: 0,
    }
  }
  return {
    accuracy: props.stats.accuracy,
    wpm: wpm.value,
    time: props.stats.time,
    combo: props.stats.combo,
    chars: props.stats.chars,
    wrongChars: props.stats.wrongChars,
  }
})

const interactionMessage = computed(() => {
  return getInteractionMessage(interactionStats.value)
})

interface Stats {
  time: number
  accuracy: number
  combo: number
  chars: number
  wrongChars: number
}

const props = defineProps<{
  stats: Stats
  levelId: number
}>()

const emit = defineEmits<{
  next: []
  restart: []
  back: []
}>()

const userStore = useUserStore()

const previousStats = computed(() => userStore.getLevelStats(props.levelId))
const previousBest = computed(() => previousStats.value?.bestTime)
const isNewRecord = computed(() => {
  return !previousBest.value || props.stats.time < previousBest.value
})
const improvement = computed(() => {
  if (!previousBest.value) return 0
  return Math.max(0, previousBest.value - props.stats.time)
})
const hasNextLevel = computed(() => {
  return props.levelId < levels.length
})
const wpm = computed(() => {
  if (props.stats.time === 0) return 0
  const minutes = props.stats.time / 60
  const words = props.stats.chars / 5
  return Math.round(words / minutes)
})

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
  position: relative;
  animation: slideUp 0.4s ease;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
  }
}

.celebration {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.confetti {
  animation: bounce 0.6s infinite;
}

.confetti:nth-child(2) {
  animation-delay: 0.1s;
}

.confetti:nth-child(3) {
  animation-delay: 0.2s;
}

.title {
  font-size: 2rem;
  font-family: 'Fredoka One', cursive;
  color: #292F36;
  margin-bottom: 2rem;
}

/* 互动语句样式 */
.interaction-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideIn 0.5s ease;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.message-emoji {
  font-size: 3rem;
  flex-shrink: 0;
  animation: bounce 1s ease-in-out infinite;
}

.message-text {
  flex: 1;
  font-size: 1.125rem;
  color: white;
  font-weight: 600;
  line-height: 1.5;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@media (max-width: 768px) {
  .interaction-message {
    padding: 1rem;
  }
  
  .message-emoji {
    font-size: 2.5rem;
  }
  
  .message-text {
    font-size: 1rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}

.stat-card {
  background: linear-gradient(135deg, #F7FFF7 0%, #E8F5E9 100%);
  border-radius: 12px;
  padding: 1rem;
}

@media (max-width: 480px) {
  .stat-card {
    padding: 0.75rem;
  }
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

@media (max-width: 480px) {
  .stat-icon {
    font-size: 1.25rem;
  }
}

.stat-label {
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
}

@media (max-width: 480px) {
  .stat-label {
    font-size: 0.65rem;
  }
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Fredoka One', cursive;
  color: #292F36;
}

@media (max-width: 480px) {
  .stat-value {
    font-size: 1.25rem;
  }
}

.comparison {
  background: #F3F4F6;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.comparison-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}

.comparison-item.highlight {
  background: #FFE66D;
  border-radius: 8px;
  font-weight: 700;
}

.comparison-arrow {
  text-align: center;
  font-size: 1.5rem;
  color: #10B981;
}

.improvement {
  text-align: center;
  color: #10B981;
  font-weight: 600;
  margin-top: 0.5rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8B94 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.btn-secondary {
  background: #F3F4F6;
  color: #292F36;
}

.btn-secondary:hover {
  background: #E5E7EB;
}

.btn-outline {
  background: transparent;
  border: 2px solid #E5E7EB;
  color: #6B7280;
}

.btn-outline:hover {
  border-color: #FF6B6B;
  color: #FF6B6B;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
