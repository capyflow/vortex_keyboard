<template>
  <ScreenShake ref="screenShakeRef">
    <div class="game-container">
      <!-- 连击火焰 -->
      <ComboFire :combo="gameStore.state.combo" />
      
      <!-- 按键粒子 -->
      <KeyParticles ref="keyParticlesRef" />
      
      <!-- 顶部信息栏 -->
      <div class="top-bar">
      <div class="stat-item">
        <span class="stat-icon">🔥</span>
        <span class="stat-value combo-text" :class="{ 'combo-animate': comboAnimating }">
          {{ formatCombo(gameStore.state.combo) }}
        </span>
        <span class="stat-label">连击</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">⚡</span>
        <span class="stat-value">{{ gameStore.multiplier.toFixed(2) }}x</span>
        <span class="stat-label">速度</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">⏱️</span>
        <span class="stat-value">{{ formatTime(gameStore.state.elapsedTime) }}</span>
        <span class="stat-label">时间</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">🎯</span>
        <span class="stat-value">{{ gameStore.accuracy }}%</span>
        <span class="stat-label">准确率</span>
      </div>
    </div>

    <!-- 吉祥物角色 -->
    <div class="mascot-container">
      <div class="mascot" :class="mascotClass">
        <div class="mascot-face">
          <div class="eyes">
            <div class="eye left"></div>
            <div class="eye right"></div>
          </div>
          <div class="mouth" :class="mouthClass"></div>
        </div>
        <div class="mascot-body">
          <div class="keyboard-keys">
            <span v-for="i in 6" :key="i" class="key"></span>
          </div>
        </div>
      </div>
      <div class="mascot-name">键盘小精灵</div>
    </div>

    <!-- 文字显示区域 -->
    <div class="text-display" @click="focusInput">
      <div class="target-text">
        <span
          v-for="(char, index) in targetText"
          :key="index"
          :class="getCharClass(index)"
        >{{ char }}</span>
      </div>
      <div class="input-hint">
        <span v-if="userInput.length > 0" class="user-input">{{ userInput }}</span>
        <span v-else class="placeholder">在此输入上方文字...</span>
      </div>
      <!-- 隐藏的输入框，用于移动端键盘 -->
      <input
        ref="hiddenInputRef"
        v-model="userInput"
        type="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        inputmode="text"
        class="hidden-input"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>

    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: gameStore.state.progress + '%' }"></div>
      </div>
      <div class="progress-text">
        {{ currentCharIndex }} / {{ targetText.length }}
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="controls">
      <button @click="handlePause" class="btn btn-secondary">
        {{ gameStore.state.isPaused ? '继续' : '暂停' }}
      </button>
      <button @click="handleRestart" class="btn btn-primary">
        重新开始
      </button>
    </div>
    </div>
  </ScreenShake>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import { useSound } from '@/composables/useSound'
import { formatCombo } from '@/utils/combo'
import { getLevel } from '@/data/levels'
import ComboFire from '@/components/ComboFire.vue'
import KeyParticles from '@/components/KeyParticles.vue'
import ScreenShake from '@/components/ScreenShake.vue'

const props = defineProps<{
  levelId: number
}>()

const emit = defineEmits<{
  complete: [stats: { time: number; accuracy: number; combo: number; chars: number; wrongChars: number }]
  error: []
}>()

const gameStore = useGameStore()
const userStore = useUserStore()
const sound = useSound()

// 加载音效设置
sound.loadSettings()

const userInput = ref('')
const currentCharIndex = ref(0)
const mascotMood = ref<'happy' | 'focused' | 'frustrated' | 'celebrating'>('focused')
const comboAnimating = ref(false)
const lastCombo = ref(0)
const keyParticlesRef = ref<InstanceType<typeof KeyParticles>>()
const screenShakeRef = ref<InstanceType<typeof ScreenShake>>()
const hiddenInputRef = ref<HTMLInputElement>()

const level = computed(() => getLevel(props.levelId))

// 监听关卡变化，重置状态
watch(() => props.levelId, () => {
  resetGameState()
}, { immediate: true })

// 监听连击变化，触发动画
watch(() => gameStore.state.combo, (newCombo) => {
  if (newCombo > lastCombo.value && newCombo > 0) {
    // 连击增加，触发动画
    comboAnimating.value = true
    setTimeout(() => {
      comboAnimating.value = false
    }, 300)
  }
  lastCombo.value = newCombo
})

// 聚焦隐藏输入框（移动端）
function focusInput() {
  if (hiddenInputRef.value) {
    hiddenInputRef.value.focus()
    // 防止页面滚动到顶部
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }
}

// 处理聚焦 - 防止页面滚动
function handleFocus() {
  // 保存当前滚动位置
  const scrollY = window.scrollY
  setTimeout(() => {
    window.scrollTo(0, scrollY)
  }, 50)
}

// 处理失焦
function handleBlur() {
  // 可以在这里处理失焦逻辑
}

// 处理输入变化
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const newValue = target.value
  
  // 处理移动端输入 - 逐个字符处理
  if (newValue.length > userInput.value.length) {
    // 有新增字符 - 获取实际新增的字符（从 currentCharIndex 位置开始）
    const addedChar = newValue[userInput.value.length]
    if (addedChar) {
      processInputChar(addedChar)
    }
  } else if (newValue.length < userInput.value.length) {
    // 有删除字符
    if (currentCharIndex.value > 0) {
      currentCharIndex.value--
      gameStore.updateProgress(currentCharIndex.value, targetText.value.length)
    }
  }
  
  userInput.value = newValue
}

// 处理单个字符输入
function processInputChar(char: string) {
  if (!gameStore.state.isPlaying || gameStore.state.isPaused) return
  
  const targetChar = targetText.value[currentCharIndex.value]
  
  if (char === targetChar) {
    // 正确输入
    currentCharIndex.value++
    gameStore.handleCorrectInput(1, char)
    gameStore.updateProgress(currentCharIndex.value, targetText.value.length)
    mascotMood.value = gameStore.state.combo > 5 ? 'happy' : 'focused'

    // 播放音效
    sound.playKey()
    
    // 生成粒子效果
    if (keyParticlesRef.value) {
      const inputElement = document.querySelector('.input-hint')
      if (inputElement) {
        const rect = inputElement.getBoundingClientRect()
        keyParticlesRef.value.spawnParticles(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          8,
          true
        )
      }
    }
    
    // 每 5 个连击播放特殊音效
    if (gameStore.state.combo % 5 === 0 && gameStore.state.combo > 0) {
      sound.playCombo(gameStore.state.combo)
    }

    // 检查是否完成
    if (currentCharIndex.value >= targetText.value.length) {
      completeLevel()
    }
  } else {
    // 错误输入 - 不前进 currentCharIndex，只记录错误
    gameStore.handleWrongInput(targetChar || '', char)
    mascotMood.value = 'frustrated'
    sound.playError()
    emit('error')

    // 屏幕震动
    if (screenShakeRef.value) {
      screenShakeRef.value.shake('medium', 300)
    }
    
    // 生成错误粒子
    if (keyParticlesRef.value) {
      const inputElement = document.querySelector('.input-hint')
      if (inputElement) {
        const rect = inputElement.getBoundingClientRect()
        keyParticlesRef.value.spawnParticles(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          15,
          false
        )
      }
    }

    // 震动反馈
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }
    
    // 重置输入框，只保留已正确输入的部分
    userInput.value = targetText.value.substring(0, currentCharIndex.value)
    if (hiddenInputRef.value) {
      hiddenInputRef.value.value = userInput.value
    }
  }
}

function resetGameState() {
  userInput.value = ''
  currentCharIndex.value = 0
  mascotMood.value = 'focused'
  lastCombo.value = 0
  comboAnimating.value = false
  gameStore.resetGame()
  gameStore.startGame()
  
  // 重置隐藏输入框
  if (hiddenInputRef.value) {
    hiddenInputRef.value.value = ''
  }
}
const targetText = computed(() => level.value?.text || '')

const mascotClass = computed(() => ({
  'mascot-happy': mascotMood.value === 'happy',
  'mascot-focused': mascotMood.value === 'focused',
  'mascot-frustrated': mascotMood.value === 'frustrated',
  'mascot-celebrating': mascotMood.value === 'celebrating',
}))

const mouthClass = computed(() => ({
  'mouth-smile': mascotMood.value === 'happy' || mascotMood.value === 'celebrating',
  'mouth-neutral': mascotMood.value === 'focused',
  'mouth-sad': mascotMood.value === 'frustrated',
}))

function getCharClass(index: number) {
  if (index < currentCharIndex.value) {
    return 'char-completed'
  }
  if (index === currentCharIndex.value) {
    return 'char-current'
  }
  return 'char-pending'
}

function handleKeydown(event: KeyboardEvent) {
  if (!gameStore.state.isPlaying || gameStore.state.isPaused) return

  const targetChar = targetText.value[currentCharIndex.value]
  const inputChar = event.key

  // 忽略修饰键
  if (inputChar.length > 1) return

  // 阻止默认行为
  event.preventDefault()

  // 桌面端直接处理，移动端由 handleInput 处理
  if (!isMobile()) {
    if (inputChar === targetChar) {
      // 正确输入
      currentCharIndex.value++
      userInput.value = targetText.value.substring(0, currentCharIndex.value)
      gameStore.handleCorrectInput(1, inputChar)
      gameStore.updateProgress(currentCharIndex.value, targetText.value.length)
      mascotMood.value = gameStore.state.combo > 5 ? 'happy' : 'focused'

      // 播放音效
      sound.playKey()
      
      // 生成粒子效果
      if (keyParticlesRef.value) {
        const inputElement = document.querySelector('.input-hint')
        if (inputElement) {
          const rect = inputElement.getBoundingClientRect()
          keyParticlesRef.value.spawnParticles(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            8,
            true
          )
        }
      }
      
      // 每 5 个连击播放特殊音效
      if (gameStore.state.combo % 5 === 0 && gameStore.state.combo > 0) {
        sound.playCombo(gameStore.state.combo)
      }

      // 检查是否完成
      if (currentCharIndex.value >= targetText.value.length) {
        completeLevel()
      }
    } else {
      // 错误输入
      gameStore.handleWrongInput(targetChar || '', inputChar)
      mascotMood.value = 'frustrated'
      sound.playError()
      emit('error')

      // 屏幕震动
      if (screenShakeRef.value) {
        screenShakeRef.value.shake('medium', 300)
      }
      
      // 生成错误粒子
      if (keyParticlesRef.value) {
        const inputElement = document.querySelector('.input-hint')
        if (inputElement) {
          const rect = inputElement.getBoundingClientRect()
          keyParticlesRef.value.spawnParticles(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            15,
            false
          )
        }
      }

      // 震动反馈
      if (navigator.vibrate) {
        navigator.vibrate(100)
      }
    }
  }
}

// 检测是否移动设备
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function completeLevel() {
  gameStore.stopGame()
  mascotMood.value = 'celebrating'
  sound.playComplete()

  const stats = {
    time: gameStore.state.elapsedTime,
    accuracy: gameStore.accuracy,
    combo: gameStore.state.maxCombo,
    chars: targetText.value.length,
    wrongChars: gameStore.state.wrongChars,
  }

  userStore.updateLevelStats(props.levelId, stats.time, stats.accuracy, stats.combo, stats.chars, stats.wrongChars)
  
  // 检查成就解锁（在父组件中处理）
  // 成就检查会在 AchievementsPanel 中自动进行
  
  emit('complete', stats)
}

function handlePause() {
  if (gameStore.state.isPaused) {
    gameStore.resumeGame()
  } else {
    gameStore.pauseGame()
  }
}

function handleRestart() {
  gameStore.resetGame()
  userInput.value = ''
  currentCharIndex.value = 0
  mascotMood.value = 'focused'
  gameStore.startGame()
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 游戏循环 - 更新计时器
let timerInterval: number | null = null
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  // gameStore.startGame() 已在 watch 中调用
  
  // 移动端自动聚焦
  if (isMobile()) {
    setTimeout(() => {
      focusInput()
    }, 500)
  }

  timerInterval = window.setInterval(() => {
    gameStore.updateElapsedTime()
  }, 100) as unknown as number
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  color: white;
}

/* 顶部信息栏 */
.top-bar {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 768px) {
  .top-bar {
    gap: 1rem;
    padding: 0.5rem;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .stat-icon {
    font-size: 1rem;
  }
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'Fredoka One', cursive;
  transition: transform 0.1s ease;
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 1rem;
  }
}

/* 连击动画 */
.combo-text {
  display: inline-block;
}

.combo-animate {
  animation: comboJump 0.3s ease;
}

@keyframes comboJump {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
    color: #FFE66D;
  }
  100% {
    transform: scale(1);
  }
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .stat-label {
    font-size: 0.65rem;
  }
}

/* 吉祥物 */
.mascot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.mascot {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  animation: bounce-slow 2s infinite;
}

@media (max-width: 768px) {
  .mascot {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .mascot {
    width: 60px;
    height: 60px;
  }
}

.mascot-happy {
  transform: scale(1.1);
}

.mascot-frustrated {
  animation: shake 0.2s ease-in-out;
}

.mascot-celebrating {
  animation: bounce 0.5s infinite;
}

.mascot-face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.eyes {
  display: flex;
  gap: 1.5rem;
}

.eye {
  width: 12px;
  height: 12px;
  background: #292F36;
  border-radius: 50%;
}

.mouth {
  width: 20px;
  height: 10px;
  background: #292F36;
  border-radius: 0 0 10px 10px;
}

.mouth-neutral {
  height: 4px;
  border-radius: 2px;
}

.mouth-sad {
  border-radius: 10px 10px 0 0;
}

.mascot-body {
  margin-top: 0.5rem;
}

.keyboard-keys {
  display: flex;
  gap: 4px;
}

.key {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
}

.mascot-name {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

/* 文字显示 */
.text-display {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .text-display {
    padding: 1rem;
  }
}

.target-text {
  font-size: 1.25rem;
  line-height: 1.8;
  font-family: 'Nunito', sans-serif;
  color: #9CA3AF;
  margin-bottom: 1rem;
  word-break: break-word;
}

@media (max-width: 768px) {
  .target-text {
    font-size: 1rem;
    line-height: 1.6;
  }
}

@media (max-width: 480px) {
  .target-text {
    font-size: 0.875rem;
  }
}

.char-completed {
  color: #10B981;
  font-weight: 600;
}

.char-current {
  color: #292F36;
  background: #FFE66D;
  border-radius: 4px;
  padding: 2px 4px;
  animation: pulse 1s infinite;
}

.char-pending {
  color: #9CA3AF;
}

.input-hint {
  font-size: 1.125rem;
  min-height: 2rem;
  border-top: 2px dashed #E5E7EB;
  padding-top: 0.75rem;
}

@media (max-width: 768px) {
  .input-hint {
    font-size: 1rem;
  }
}

.user-input {
  color: #4ECDC4;
  font-weight: 600;
}

.placeholder {
  color: #9CA3AF;
  font-style: italic;
}

/* 隐藏输入框 - 移动端使用 */
.hidden-input {
  position: fixed;
  opacity: 0;
  top: -1000px;
  left: -1000px;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .text-display {
    cursor: text;
  }
  
  .input-hint {
    min-height: 3rem;
  }
  
  /* 防止移动端输入时页面滚动 */
  .game-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
}

/* 进度条 */
.progress-container {
  width: 100%;
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4 0%, #FFE66D 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

/* 控制按钮 */
.controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 768px) {
  .controls {
    width: 100%;
  }
}

.btn {
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 120px;
}

@media (max-width: 768px) {
  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    min-width: 100px;
  }
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
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
