<template>
  <div class="dynamic-background" :style="backgroundStyle">
    <!-- 渐变背景 -->
    <div class="gradient-layer" :style="gradientStyle"></div>
    
    <!-- 粒子效果 -->
    <div class="particles-layer">
      <span
        v-for="i in particleCount"
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></span>
    </div>
    
    <!-- 主题装饰 -->
    <div class="theme-overlay" :class="themeClass">
      <div class="theme-elements">
        <span v-for="i in elementCount" :key="i" class="theme-element" :style="getElementStyle(i)"></span>
      </div>
    </div>
    
    <!-- BPM 指示器 -->
    <div class="bpm-indicator" v-if="showBpm">
      <div class="bpm-circle" :style="bpmCircleStyle">
        <span class="bpm-text">{{ bpm }}</span>
        <span class="bpm-label">BPM</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  colors: [string, string] | [string, string, string, string]
  bpm: number
  theme: string
  showBpm?: boolean
}>()

const particleCount = 30
const elementCount = 20

const backgroundStyle = computed(() => ({
  '--transition-speed': `${60 / props.bpm}s`,
}))

const gradientStyle = computed(() => {
  if (props.colors.length === 4) {
    return {
      background: `linear-gradient(135deg, ${props.colors[0]} 0%, ${props.colors[1]} 50%, ${props.colors[2]} 50%, ${props.colors[3]} 100%)`,
    }
  }
  return {
    background: `linear-gradient(135deg, ${props.colors[0]} 0%, ${props.colors[1]} 100%)`,
  }
})

const themeClass = computed(() => `theme-${props.theme.replace(/\s+/g, '-')}`)

const bpmCircleStyle = computed(() => ({
  animation: `pulse ${60 / props.bpm / 2}s ease-in-out infinite`,
}))

function getParticleStyle(_index: number) {
  const delay = Math.random() * 5
  const duration = 3 + Math.random() * 4
  const left = Math.random() * 100
  const size = 4 + Math.random() * 8
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--left': `${left}%`,
    '--size': `${size}px`,
  } as any
}

function getElementStyle(_index: number) {
  const delay = Math.random() * 10
  const duration = 5 + Math.random() * 5
  const left = Math.random() * 100
  const top = Math.random() * 100
  const rotation = Math.random() * 360
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--left': `${left}%`,
    '--top': `${top}%`,
    '--rotation': `${rotation}deg`,
  } as any
}
</script>

<style scoped>
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  transition: background 0.5s ease;
  pointer-events: none;
}

.gradient-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: background 1s ease;
}

.particles-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  left: var(--left);
  bottom: -20px;
  animation: float-up var(--duration) ease-in infinite;
  animation-delay: var(--delay);
}

.theme-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.theme-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.theme-element {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  left: var(--left);
  top: var(--top);
  transform: rotate(var(--rotation));
  animation: float-around var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

/* BPM 指示器 */
.bpm-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.bpm-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: pulse 1s ease-in-out infinite;
}

.bpm-text {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: 'Fredoka One', cursive;
  line-height: 1;
}

.bpm-label {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 0.25rem;
}

/* 动画 */
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

@keyframes float-around {
  0%, 100% {
    transform: translate(0, 0) rotate(var(--rotation));
    opacity: 0.3;
  }
  50% {
    transform: translate(20px, -20px) rotate(calc(var(--rotation) + 180deg));
    opacity: 0.8;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .bpm-indicator {
    top: 10px;
    right: 10px;
  }
  
  .bpm-circle {
    width: 60px;
    height: 60px;
  }
  
  .bpm-text {
    font-size: 1.5rem;
  }
  
  .bpm-label {
    font-size: 0.65rem;
  }
  
  .particle {
    width: calc(var(--size) * 0.7);
    height: calc(var(--size) * 0.7);
  }
}
</style>
