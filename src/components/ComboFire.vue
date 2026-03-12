<template>
  <div class="combo-fire" :class="{ 'show': show, 'level-1': level >= 1, 'level-2': level >= 2, 'level-3': level >= 3 }">
    <div class="fire-container">
      <div v-for="i in flameCount" :key="i" class="flame" :style="getFlameStyle(i)"></div>
    </div>
    <div class="fire-glow"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  combo: number
}>()

const show = computed(() => props.combo >= 10)
const level = computed(() => {
  if (props.combo >= 50) return 3
  if (props.combo >= 30) return 2
  if (props.combo >= 10) return 1
  return 0
})

const flameCount = computed(() => {
  if (props.combo >= 50) return 15
  if (props.combo >= 30) return 10
  if (props.combo >= 10) return 5
  return 0
})

function getFlameStyle(index: number) {
  const delay = Math.random() * 0.5
  const duration = 0.5 + Math.random() * 0.5
  const left = 20 + (index / flameCount.value) * 60
  const height = 20 + Math.random() * 30
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--left': `${left}%`,
    '--height': `${height}px`,
  } as any
}
</script>

<style scoped>
.combo-fire {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 60px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.combo-fire.show {
  opacity: 1;
}

.fire-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.flame {
  position: absolute;
  bottom: 0;
  left: var(--left);
  width: 8px;
  height: var(--height);
  background: linear-gradient(to top, #ff6b6b, #ffd93d, transparent);
  border-radius: 50% 50% 0 0;
  filter: blur(2px);
  animation: flame-flicker var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

.fire-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 40px;
  background: radial-gradient(ellipse at center, rgba(255, 107, 107, 0.5) 0%, transparent 70%);
  filter: blur(10px);
  animation: glow-pulse 1s ease-in-out infinite;
}

@keyframes flame-flicker {
  0%, 100% {
    transform: scaleY(0.8) scaleX(0.9);
    opacity: 0.7;
  }
  50% {
    transform: scaleY(1.1) scaleX(1.1);
    opacity: 1;
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translateX(-50%) scale(1.1);
  }
}

/* 不同等级的火焰颜色 */
.combo-fire.level-1 .flame {
  background: linear-gradient(to top, #ffd93d, #ff6b6b, transparent);
}

.combo-fire.level-2 .flame {
  background: linear-gradient(to top, #ff6b6b, #ffd93d, #fff, transparent);
}

.combo-fire.level-3 .flame {
  background: linear-gradient(to top, #667eea, #ff6b6b, #ffd93d, #fff, transparent);
}

.combo-fire.level-3 .fire-glow {
  background: radial-gradient(ellipse at center, rgba(102, 126, 234, 0.5) 0%, rgba(255, 107, 107, 0.3) 50%, transparent 70%);
}
</style>
