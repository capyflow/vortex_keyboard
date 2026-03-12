<template>
  <div class="key-particles">
    <TransitionGroup name="particle">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="{
          left: particle.x + 'px',
          top: particle.y + 'px',
          backgroundColor: particle.color,
          transform: `translate(${particle.vx * 10}px, ${particle.vy * 10}px) scale(${particle.scale})`,
        }"
      ></div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  scale: number
  life: number
}

const particles = ref<Particle[]>([])
let particleId = 0
let cleanupInterval: number | null = null

// 创建粒子
function spawnParticles(x: number, y: number, count: number = 10, isCorrect: boolean = true) {
  const colors = isCorrect 
    ? ['#4ECDC4', '#FFE66D', '#95E1D3', '#43e97b']  // 正确：青绿色系
    : ['#FF6B6B', '#FF8B94', '#ff6b6b', '#f12711']  // 错误：红色系
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const speed = 2 + Math.random() * 3
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed
    
    particles.value.push({
      id: particleId++,
      x,
      y,
      vx,
      vy,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      scale: 0.5 + Math.random() * 0.5,
      life: 1,
    })
  }
}

// 清理过期粒子
cleanupInterval = window.setInterval(() => {
  particles.value = particles.value.filter(p => {
    p.life -= 0.02
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.1 // 重力
    return p.life > 0
  })
}, 16) as unknown as number

onUnmounted(() => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
  }
})

defineExpose({ spawnParticles })
</script>

<style scoped>
.key-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0.8;
  transition: opacity 0.1s ease;
}

.particle-enter-active {
  animation: particle-fade-in 0.2s ease;
}

.particle-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: scale(0);
}

@keyframes particle-fade-in {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 0.8;
    transform: scale(1);
  }
}
</style>
