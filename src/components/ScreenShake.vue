<template>
  <div class="screen-shake" :class="{ 'shake': isShaking, 'shake-intensity': intensity }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isShaking = ref(false)
const intensity = ref<'light' | 'medium' | 'heavy'>('light')

let shakeTimeout: number | null = null

function shake(type: 'light' | 'medium' | 'heavy' = 'light', duration: number = 300) {
  if (shakeTimeout) {
    clearTimeout(shakeTimeout)
  }
  
  intensity.value = type
  isShaking.value = true
  
  shakeTimeout = window.setTimeout(() => {
    isShaking.value = false
  }, duration) as unknown as number
}

defineExpose({ shake })
</script>

<style scoped>
.screen-shake {
  transition: transform 0.1s ease;
}

.screen-shake.shake {
  animation: shake-animation 0.3s ease-in-out;
}

.screen-shake.shake.shake-light {
  animation-duration: 0.2s;
}

.screen-shake.shake.shake-medium {
  animation-duration: 0.3s;
}

.screen-shake.shake.shake-heavy {
  animation-duration: 0.5s;
}

@keyframes shake-animation {
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  10% {
    transform: translateX(-5px) translateY(-3px);
  }
  20% {
    transform: translateX(5px) translateY(3px);
  }
  30% {
    transform: translateX(-5px) translateY(-3px);
  }
  40% {
    transform: translateX(5px) translateY(3px);
  }
  50% {
    transform: translateX(-3px) translateY(-2px);
  }
  60% {
    transform: translateX(3px) translateY(2px);
  }
  70% {
    transform: translateX(-3px) translateY(-2px);
  }
  80% {
    transform: translateX(3px) translateY(2px);
  }
  90% {
    transform: translateX(-1px) translateY(-1px);
  }
}
</style>
