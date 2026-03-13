<template>
  <div v-if="visible" class="anti-cheat-warning-overlay">
    <div class="warning-modal">
      <div class="warning-icon">⚠️</div>
      <h2 class="warning-title">检测到异常输入</h2>
      <p class="warning-message">
        系统检测到您的输入可能存在异常，为了公平起见，本次成绩将标记为"待验证"。
      </p>
      
      <div class="warning-reasons" v-if="reasons.length > 0">
        <h3>检测到的问题：</h3>
        <ul>
          <li v-for="(reason, index) in reasons" :key="index">{{ reason }}</li>
        </ul>
      </div>

      <div class="warning-stats" v-if="stats">
        <h3>输入统计：</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">平均按键间隔</span>
            <span class="stat-value">{{ stats.avgDelta?.toFixed(1) }} ms</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">按键间隔标准差</span>
            <span class="stat-value">{{ stats.stdDev?.toFixed(1) }} ms</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">输入速度</span>
            <span class="stat-value">{{ charsPerSecond?.toFixed(1) }} 字/秒</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">风险评分</span>
            <span class="stat-value risk">{{ riskScore }}</span>
          </div>
        </div>
      </div>

      <div class="warning-actions">
        <button @click="handleContinue" class="btn btn-primary">
          继续提交
        </button>
        <button @click="handleRetry" class="btn btn-secondary">
          重新挑战
        </button>
      </div>

      <p class="warning-note">
        💡 提示：使用自然、均匀的打字速度可以避免被误判。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { CheatDetectionResult } from '@/utils/antiCheat'

interface InputStats {
  avgDelta?: number
  stdDev?: number
  totalKeys?: number
  duration?: number
}

const props = defineProps<{
  detectionResult: CheatDetectionResult | null
  inputStats: InputStats | null
}>()

const emit = defineEmits<{
  continue: []
  retry: []
}>()

const visible = ref(false)
const reasons = ref<string[]>([])
const stats = ref<InputStats | null>(null)

// 计算输入速度
const charsPerSecond = computed(() => {
  if (!stats.value?.duration || !stats.value?.totalKeys) return 0
  return stats.value.totalKeys / (stats.value.duration / 1000)
})

// 风险评分
const riskScore = computed(() => {
  return props.detectionResult?.riskScore || 0
})

// 监听检测结果
watch(() => props.detectionResult, (result) => {
  if (result?.isCheating && result.riskScore >= 60) {
    reasons.value = result.reasons
    stats.value = props.inputStats
    visible.value = true
  }
}, { immediate: true })

function handleContinue() {
  visible.value = false
  emit('continue')
}

function handleRetry() {
  visible.value = false
  emit('retry')
}
</script>

<style scoped>
.anti-cheat-warning-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.warning-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid #e94560;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.warning-icon {
  font-size: 64px;
  text-align: center;
  margin-bottom: 20px;
  animation: iconPulse 1s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.warning-title {
  font-size: 28px;
  font-weight: bold;
  color: #e94560;
  text-align: center;
  margin-bottom: 15px;
}

.warning-message {
  font-size: 16px;
  color: #a0a0a0;
  text-align: center;
  margin-bottom: 25px;
  line-height: 1.6;
}

.warning-reasons {
  background: rgba(233, 69, 96, 0.1);
  border-left: 4px solid #e94560;
  padding: 20px;
  margin-bottom: 25px;
  border-radius: 8px;
}

.warning-reasons h3 {
  font-size: 16px;
  color: #e94560;
  margin-bottom: 10px;
}

.warning-reasons ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.warning-reasons li {
  color: #f0f0f0;
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
}

.warning-reasons li::before {
  content: "•";
  color: #e94560;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.warning-stats {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
}

.warning-stats h3 {
  font-size: 16px;
  color: #f0f0f0;
  margin-bottom: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 13px;
  color: #a0a0a0;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #4ecca3;
}

.stat-value.risk {
  color: #e94560;
}

.warning-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #4ecca3 0%, #38b590 100%);
  color: #1a1a2e;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(78, 204, 163, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #f0f0f0;
  border: 2px solid #a0a0a0;
}

.btn-secondary:hover {
  border-color: #f0f0f0;
  background: rgba(255, 255, 255, 0.1);
}

.warning-note {
  font-size: 14px;
  color: #a0a0a0;
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .warning-actions {
    flex-direction: column;
  }
}
</style>
