<template>
  <div class="theme-selector">
    <h3 class="selector-title">🎨 选择主题</h3>
    
    <div class="theme-grid">
      <div
        v-for="theme in themes"
        :key="theme.id"
        @click="handleSelect(theme.id)"
        class="theme-card"
        :class="{ active: modelValue === theme.id }"
      >
        <div
          class="theme-preview"
          :style="{
            background: `linear-gradient(135deg, ${theme.colors.gradient[0]}, ${theme.colors.gradient[1]}, ${theme.colors.gradient[2]})`
          }"
        >
          <span class="theme-emoji">{{ theme.emoji }}</span>
        </div>
        <div class="theme-name">{{ theme.name }}</div>
        <div class="theme-check" v-if="modelValue === theme.id">✓</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { themes } from '@/data/themes'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [themeId: string]
}>()

function handleSelect(themeId: string) {
  emit('update:modelValue', themeId)
}
</script>

<style scoped>
.theme-selector {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.selector-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.theme-card {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  overflow: hidden;
}

.theme-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.theme-card.active {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.2);
}

.theme-preview {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.theme-emoji {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.theme-name {
  font-size: 0.875rem;
  color: white;
  text-align: center;
  font-weight: 600;
}

.theme-check {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.9);
  color: #10B981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .theme-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
  
  .theme-emoji {
    font-size: 1.5rem;
  }
  
  .theme-name {
    font-size: 0.75rem;
  }
}
</style>
