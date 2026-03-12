<template>
  <div class="achievements-panel">
    <h2 class="title">🏆 成就系统</h2>
    
    <!-- 进度概览 -->
    <div class="overview">
      <div class="progress-circle">
        <svg viewBox="0 0 100 100">
          <circle
            class="progress-bg"
            cx="50"
            cy="50"
            r="45"
          />
          <circle
            class="progress-fill"
            cx="50"
            cy="50"
            r="45"
            :style="{ strokeDashoffset: 283 - (283 * progress) / 100 }"
          />
        </svg>
        <div class="progress-text">
          <span class="progress-number">{{ unlockedCount }}</span>
          <span class="progress-total">/{{ totalCount }}</span>
        </div>
      </div>
      <div class="overview-stats">
        <div class="stat">
          <span class="stat-value">{{ unlockedCount }}</span>
          <span class="stat-label">已解锁</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ totalCount - unlockedCount }}</span>
          <span class="stat-label">未解锁</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ progress }}%</span>
          <span class="stat-label">完成度</span>
        </div>
      </div>
    </div>
    
    <!-- 分类筛选 -->
    <div class="filters">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        :class="{ active: selectedCategory === cat.id }"
        class="filter-btn"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>
    
    <!-- 成就列表 -->
    <div class="achievements-grid">
      <div
        v-for="achievement in filteredAchievements"
        :key="achievement.id"
        class="achievement-card"
        :class="{
          unlocked: isUnlocked(achievement.id),
          locked: !isUnlocked(achievement.id),
        }"
      >
        <div class="achievement-icon">
          {{ achievement.icon }}
        </div>
        <div class="achievement-info">
          <h3 class="achievement-name">{{ achievement.name }}</h3>
          <p class="achievement-desc">{{ achievement.description }}</p>
          <div class="achievement-progress" v-if="!isUnlocked(achievement.id)">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: getProgress(achievement) + '%' }"
              ></div>
            </div>
            <span class="progress-text">
              {{ getProgressValue(achievement) }} / {{ achievement.maxProgress }}
            </span>
          </div>
          <div class="achievement-unlocked" v-else>
            <span class="checkmark">✅</span>
            <span class="unlock-date">{{ getUnlockDate(achievement.id) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { achievements, type Achievement, calculateProgress } from '@/data/achievements'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const selectedCategory = ref<string>('all')
const achievementStats = ref<any>(null)

const categories = [
  { id: 'all', name: '全部', icon: '📋' },
  { id: 'beginner', name: '新手', icon: '🌱' },
  { id: 'intermediate', name: '中级', icon: '🌿' },
  { id: 'advanced', name: '高级', icon: '🌳' },
  { id: 'expert', name: '专家', icon: '👑' },
]

const filteredAchievements = computed(() => {
  if (selectedCategory.value === 'all') {
    return achievements
  }
  return achievements.filter(a => a.category === selectedCategory.value)
})

const unlockedCount = computed(() => userStore.getUnlockedAchievementsCount())
const totalCount = computed(() => userStore.getTotalAchievementsCount())
const progress = computed(() => userStore.getAchievementProgress())

function isUnlocked(achievementId: string): boolean {
  return userStore.isAchievementUnlocked(achievementId)
}

function getProgress(achievement: Achievement): number {
  if (!achievementStats.value) return 0
  const value = calculateProgress(achievement, achievementStats.value)
  return Math.min((value / achievement.maxProgress) * 100, 100)
}

function getProgressValue(achievement: Achievement): number {
  if (!achievementStats.value) return 0
  return calculateProgress(achievement, achievementStats.value)
}

function getUnlockDate(achievementId: string): string {
  const achievement = userStore.stats.achievements[achievementId]
  if (!achievement?.unlockedAt) return ''
  const date = new Date(achievement.unlockedAt)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 更新成就统计
function updateAchievementStats() {
  const levelsCompleted: Record<number, { time: number; accuracy: number; combo: number }> = {}
  
  Object.entries(userStore.stats.levels).forEach(([levelId, stats]: any) => {
    levelsCompleted[Number(levelId)] = {
      time: stats.bestTime || 0,
      accuracy: stats.bestAccuracy,
      combo: stats.bestCombo,
    }
  })
  
  achievementStats.value = {
    totalLevelsCompleted: userStore.stats.totalLevelsCompleted,
    totalCharacters: userStore.stats.totalCharacters,
    totalPlayTime: userStore.stats.totalPlayTime,
    bestCombo: userStore.stats.bestCombo,
    bestAccuracy: userStore.stats.bestAccuracy,
    bestWPM: userStore.stats.bestWPM,
    levelsCompleted,
    consecutiveDays: 0, // TODO: 实现连续天数统计
  }
  
  // 检查并解锁成就
  checkAchievements()
}

function checkAchievements() {
  if (!achievementStats.value) return
  
  achievements.forEach(achievement => {
    if (!isUnlocked(achievement.id) && achievement.condition(achievementStats.value!)) {
      userStore.unlockAchievement(achievement.id)
      // TODO: 播放解锁动画/音效
    }
  })
}

onMounted(() => {
  updateAchievementStats()
})
</script>

<style scoped>
.achievements-panel {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  font-family: 'Fredoka One', cursive;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 概览 */
.overview {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
}

.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-circle svg {
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 10;
}

.progress-fill {
  fill: none;
  stroke: #FFE66D;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.progress-number {
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Fredoka One', cursive;
}

.progress-total {
  font-size: 0.875rem;
  opacity: 0.8;
}

.overview-stats {
  display: flex;
  gap: 3rem;
  flex: 1;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Fredoka One', cursive;
  color: white;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 筛选器 */
.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.filter-btn.active {
  background: white;
  color: #764ba2;
}

/* 成就卡片 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  border: 2px solid #FFE66D;
  box-shadow: 0 4px 16px rgba(255, 230, 109, 0.3);
}

.achievement-card.locked {
  opacity: 0.7;
  filter: grayscale(0.5);
}

.achievement-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #292F36;
  margin-bottom: 0.25rem;
}

.achievement-desc {
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.75rem;
}

.achievement-progress {
  margin-top: 0.5rem;
}

.progress-bar {
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress-bar .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B6B 0%, #FFE66D 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #6B7280;
}

.achievement-unlocked {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #10B981;
  font-weight: 600;
}

.checkmark {
  font-size: 1rem;
}

.unlock-date {
  color: #9CA3AF;
  font-weight: 400;
}

/* 响应式 */
@media (max-width: 768px) {
  .overview {
    flex-direction: column;
    text-align: center;
  }
  
  .overview-stats {
    width: 100%;
    justify-content: space-around;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>
