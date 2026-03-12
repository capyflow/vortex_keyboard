import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LevelStats {
  level: number
  bestTime: number | null
  bestAccuracy: number
  bestCombo: number
  completedCount: number
  lastPlayed: number | null
}

export interface UserStats {
  totalPlayTime: number
  totalLevelsCompleted: number
  totalCharacters: number
  levels: Record<number, LevelStats>
  achievements: Record<string, { unlocked: boolean; unlockedAt?: number }>
  bestCombo: number
  bestAccuracy: number
  bestWPM: number
}

const STORAGE_KEY = 'vortex_keyboard_stats'

export const useUserStore = defineStore('user', () => {
  const stats = ref<UserStats>({
    totalPlayTime: 0,
    totalLevelsCompleted: 0,
    totalCharacters: 0,
    levels: {},
    achievements: {},
    bestCombo: 0,
    bestAccuracy: 0,
    bestWPM: 0,
  })

  // 从 localStorage 加载
  function loadStats() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        stats.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load stats:', e)
    }
  }

  // 保存到 localStorage
  function saveStats() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
    } catch (e) {
      console.error('Failed to save stats:', e)
    }
  }

  function updateLevelStats(level: number, time: number, accuracy: number, combo: number, chars: number) {
    const existing = stats.value.levels[level] || {
      level,
      bestTime: null,
      bestAccuracy: 0,
      bestCombo: 0,
      completedCount: 0,
      lastPlayed: null,
    }

    // 更新最佳记录
    if (!existing.bestTime || time < existing.bestTime) {
      existing.bestTime = time
    }
    if (accuracy > existing.bestAccuracy) {
      existing.bestAccuracy = accuracy
    }
    if (combo > existing.bestCombo) {
      existing.bestCombo = combo
    }

    existing.completedCount++
    existing.lastPlayed = Date.now()

    stats.value.levels[level] = existing
    stats.value.totalLevelsCompleted++
    stats.value.totalCharacters += chars
    
    // 更新全局最佳
    if (combo > stats.value.bestCombo) {
      stats.value.bestCombo = combo
    }
    if (accuracy > stats.value.bestAccuracy) {
      stats.value.bestAccuracy = accuracy
    }
    
    // 计算 WPM
    const wpm = Math.round((chars / 5) / (time / 60))
    if (wpm > stats.value.bestWPM) {
      stats.value.bestWPM = wpm
    }

    saveStats()
  }

  function addPlayTime(seconds: number) {
    stats.value.totalPlayTime += seconds
    saveStats()
  }

  function getLevelStats(level: number): LevelStats | null {
    return stats.value.levels[level] || null
  }

  function getBestCombo(): number {
    return Math.max(...Object.values(stats.value.levels).map(l => l.bestCombo), 0)
  }

  function getTotalPlayTimeFormatted(): string {
    const hours = Math.floor(stats.value.totalPlayTime / 3600)
    const minutes = Math.floor((stats.value.totalPlayTime % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
  
  // 成就相关
  function unlockAchievement(achievementId: string) {
    if (!stats.value.achievements[achievementId]) {
      stats.value.achievements[achievementId] = {
        unlocked: true,
        unlockedAt: Date.now(),
      }
      saveStats()
      return true // 新解锁
    }
    return false // 已解锁
  }
  
  function isAchievementUnlocked(achievementId: string): boolean {
    return stats.value.achievements[achievementId]?.unlocked || false
  }
  
  function getUnlockedAchievementsCount(): number {
    return Object.values(stats.value.achievements).filter(a => a.unlocked).length
  }
  
  function getTotalAchievementsCount(): number {
    return 22 // 总成就数
  }
  
  function getAchievementProgress(): number {
    const unlocked = getUnlockedAchievementsCount()
    const total = getTotalAchievementsCount()
    return Math.round((unlocked / total) * 100)
  }

  return {
    stats,
    loadStats,
    saveStats,
    updateLevelStats,
    addPlayTime,
    getLevelStats,
    getBestCombo,
    getTotalPlayTimeFormatted,
    unlockAchievement,
    isAchievementUnlocked,
    getUnlockedAchievementsCount,
    getTotalAchievementsCount,
    getAchievementProgress,
  }
})
