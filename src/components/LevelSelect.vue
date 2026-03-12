<template>
  <div class="level-select">
    <h2 class="title">🎮 选择关卡</h2>
    
    <div class="levels-grid">
      <div
        v-for="level in levels"
        :key="level.id"
        @click="selectLevel(level.id)"
        class="level-card"
        :class="{
          'locked': isLevelLocked(level.id),
          'selected': selectedLevel === level.id,
          [`difficulty-${level.difficulty}`]: true,
        }"
      >
        <div class="level-header">
          <span class="level-number">{{ level.id }}</span>
          <span class="level-icon">{{ getDifficultyIcon(level.difficulty) }}</span>
        </div>
        
        <div class="level-info">
          <h3 class="level-name">{{ level.name }}</h3>
          <p class="level-desc">{{ level.description }}</p>
        </div>
        
        <div class="level-stats" v-if="!isLevelLocked(level.id)">
          <div class="stat">
            <span class="stat-label">⏱️ 最佳</span>
            <span class="stat-value">{{ formatTime(getLevelStats(level.id)?.bestTime) }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">🎯 准确率</span>
            <span class="stat-value">{{ getLevelStats(level.id)?.bestAccuracy || 0 }}%</span>
          </div>
          <div class="stat">
            <span class="stat-label">🔥 连击</span>
            <span class="stat-value">{{ getLevelStats(level.id)?.bestCombo || 0 }}</span>
          </div>
        </div>
        
        <div class="lock-overlay" v-if="isLevelLocked(level.id)">
          <span class="lock-icon">🔒</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { levels } from '@/data/levels'
import { useUserStore } from '@/stores/user'

const emit = defineEmits<{
  select: [levelId: number]
}>()

const userStore = useUserStore()

const selectedLevel = computed(() => 1)

function getDifficultyIcon(difficulty: string) {
  const icons: Record<string, string> = {
    easy: '🌱',
    medium: '🌿',
    hard: '🌳',
    expert: '👑',
  }
  return icons[difficulty] || '🌱'
}

function isLevelLocked(levelId: number): boolean {
  if (levelId === 1) return false
  const prevLevel = userStore.getLevelStats(levelId - 1)
  return !prevLevel || prevLevel.completedCount === 0
}

function getLevelStats(levelId: number) {
  return userStore.getLevelStats(levelId)
}

function selectLevel(levelId: number) {
  if (!isLevelLocked(levelId)) {
    emit('select', levelId)
  }
}

function formatTime(seconds: number | null | undefined): string {
  if (!seconds) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.level-select {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 1.75rem;
  font-family: 'Fredoka One', cursive;
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .levels-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .levels-grid {
    grid-template-columns: 1fr;
  }
}

.level-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .level-card {
    padding: 1rem;
  }
}

.level-card:hover:not(.locked) {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.level-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.level-card.selected {
  ring: 4px solid #FF6B6B;
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.3);
}

.difficulty-easy {
  border-left: 4px solid #95E1D3;
}

.difficulty-medium {
  border-left: 4px solid #FFE66D;
}

.difficulty-hard {
  border-left: 4px solid #FF8B94;
}

.difficulty-expert {
  border-left: 4px solid #764ba2;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.level-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #292F36;
}

.level-icon {
  font-size: 1.5rem;
}

.level-info {
  margin-bottom: 1rem;
}

.level-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #292F36;
  margin-bottom: 0.5rem;
}

.level-desc {
  font-size: 0.875rem;
  color: #6B7280;
}

.level-stats {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E5E7EB;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6B7280;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #292F36;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-icon {
  font-size: 3rem;
}
</style>
