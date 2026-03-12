export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: AchievementStats) => boolean
  unlocked: boolean
  unlockedAt?: number
  progress?: (stats: AchievementStats) => number
  maxProgress: number
  category: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface AchievementStats {
  totalLevelsCompleted: number
  totalCharacters: number
  totalPlayTime: number
  bestCombo: number
  bestAccuracy: number
  bestWPM: number
  levelsCompleted: Record<number, { time: number; accuracy: number; combo: number }>
  consecutiveDays: number
}

export const achievements: Achievement[] = [
  // ==================== 新手成就 ====================
  {
    id: 'first_blood',
    name: '首战告捷',
    description: '完成第一个关卡',
    icon: '🎉',
    category: 'beginner',
    unlocked: false,
    maxProgress: 1,
    condition: (stats) => stats.totalLevelsCompleted >= 1,
    progress: (stats) => Math.min(stats.totalLevelsCompleted, 1),
  },
  {
    id: 'warm_up',
    name: '热身完成',
    description: '完成 3 个关卡',
    icon: '🔥',
    category: 'beginner',
    unlocked: false,
    maxProgress: 3,
    condition: (stats) => stats.totalLevelsCompleted >= 3,
    progress: (stats) => Math.min(stats.totalLevelsCompleted, 3),
  },
  {
    id: 'getting_started',
    name: '渐入佳境',
    description: '完成 5 个关卡',
    icon: '📈',
    category: 'beginner',
    unlocked: false,
    maxProgress: 5,
    condition: (stats) => stats.totalLevelsCompleted >= 5,
    progress: (stats) => Math.min(stats.totalLevelsCompleted, 5),
  },
  {
    id: 'first_combo',
    name: '小试牛刀',
    description: '达到 10 连击',
    icon: '⚡',
    category: 'beginner',
    unlocked: false,
    maxProgress: 10,
    condition: (stats) => stats.bestCombo >= 10,
    progress: (stats) => Math.min(stats.bestCombo, 10),
  },
  {
    id: 'accurate_start',
    name: '精准入门',
    description: '准确率达到 90%',
    icon: '🎯',
    category: 'beginner',
    unlocked: false,
    maxProgress: 90,
    condition: (stats) => stats.bestAccuracy >= 90,
    progress: (stats) => Math.min(stats.bestAccuracy, 90),
  },
  
  // ==================== 中级成就 ====================
  {
    id: 'dedicated',
    name: '坚持不懈',
    description: '完成 10 个关卡',
    icon: '💪',
    category: 'intermediate',
    unlocked: false,
    maxProgress: 10,
    condition: (stats) => stats.totalLevelsCompleted >= 10,
    progress: (stats) => Math.min(stats.totalLevelsCompleted, 10),
  },
  {
    id: 'combo_master',
    name: '连击高手',
    description: '达到 25 连击',
    icon: '🔥🔥',
    category: 'intermediate',
    unlocked: false,
    maxProgress: 25,
    condition: (stats) => stats.bestCombo >= 25,
    progress: (stats) => Math.min(stats.bestCombo, 25),
  },
  {
    id: 'speed_demon',
    name: '速度恶魔',
    description: 'WPM 达到 60',
    icon: '💨',
    category: 'intermediate',
    unlocked: false,
    maxProgress: 60,
    condition: (stats) => stats.bestWPM >= 60,
    progress: (stats) => Math.min(stats.bestWPM, 60),
  },
  {
    id: 'perfectionist',
    name: '完美主义者',
    description: '准确率达到 95%',
    icon: '💎',
    category: 'intermediate',
    unlocked: false,
    maxProgress: 95,
    condition: (stats) => stats.bestAccuracy >= 95,
    progress: (stats) => Math.min(stats.bestAccuracy, 95),
  },
  {
    id: 'time_invested',
    name: '时间投入',
    description: '累计练习 1 小时',
    icon: '⏰',
    category: 'intermediate',
    unlocked: false,
    maxProgress: 3600,
    condition: (stats) => stats.totalPlayTime >= 3600,
    progress: (stats) => Math.min(stats.totalPlayTime, 3600),
  },
  {
    id: 'character_counter',
    name: '字符收集者',
    description: '累计输入 10000 个字符',
    icon: '📝',
    category: 'intermediate',
    unlocked: false,
    maxProgress: 10000,
    condition: (stats) => stats.totalCharacters >= 10000,
    progress: (stats) => Math.min(stats.totalCharacters, 10000),
  },
  
  // ==================== 高级成就 ====================
  {
    id: 'halfway',
    name: '半途而...不废！',
    description: '完成 15 个关卡',
    icon: '🏆',
    category: 'advanced',
    unlocked: false,
    maxProgress: 15,
    condition: (stats) => stats.totalLevelsCompleted >= 15,
    progress: (stats) => Math.min(stats.totalLevelsCompleted, 15),
  },
  {
    id: 'combo_legend',
    name: '连击传奇',
    description: '达到 50 连击',
    icon: '🔥🔥🔥',
    category: 'advanced',
    unlocked: false,
    maxProgress: 50,
    condition: (stats) => stats.bestCombo >= 50,
    progress: (stats) => Math.min(stats.bestCombo, 50),
  },
  {
    id: 'speed_master',
    name: '速度大师',
    description: 'WPM 达到 80',
    icon: '🚀',
    category: 'advanced',
    unlocked: false,
    maxProgress: 80,
    condition: (stats) => stats.bestWPM >= 80,
    progress: (stats) => Math.min(stats.bestWPM, 80),
  },
  {
    id: 'near_perfect',
    name: '接近完美',
    description: '准确率达到 98%',
    icon: '🌟',
    category: 'advanced',
    unlocked: false,
    maxProgress: 98,
    condition: (stats) => stats.bestAccuracy >= 98,
    progress: (stats) => Math.min(stats.bestAccuracy, 98),
  },
  {
    id: 'dedicated_practice',
    name: '刻苦练习',
    description: '累计练习 5 小时',
    icon: '📚',
    category: 'advanced',
    unlocked: false,
    maxProgress: 18000,
    condition: (stats) => stats.totalPlayTime >= 18000,
    progress: (stats) => Math.min(stats.totalPlayTime, 18000),
  },
  {
    id: 'marathon',
    name: '马拉松',
    description: '累计输入 50000 个字符',
    icon: '📖',
    category: 'advanced',
    unlocked: false,
    maxProgress: 50000,
    condition: (stats) => stats.totalCharacters >= 50000,
    progress: (stats) => Math.min(stats.totalCharacters, 50000),
  },
  
  // ==================== 专家成就 ====================
  {
    id: 'all_clear',
    name: '全 clearance',
    description: '完成所有 30 个关卡',
    icon: '👑',
    category: 'expert',
    unlocked: false,
    maxProgress: 30,
    condition: (stats) => stats.totalLevelsCompleted >= 30,
    progress: (stats) => Math.min(stats.totalLevelsCompleted, 30),
  },
  {
    id: 'combo_god',
    name: '连击之神',
    description: '达到 100 连击',
    icon: '🔥🔥🔥🔥',
    category: 'expert',
    unlocked: false,
    maxProgress: 100,
    condition: (stats) => stats.bestCombo >= 100,
    progress: (stats) => Math.min(stats.bestCombo, 100),
  },
  {
    id: 'typing_god',
    name: '打字之神',
    description: 'WPM 达到 100',
    icon: '⚡⚡⚡',
    category: 'expert',
    unlocked: false,
    maxProgress: 100,
    condition: (stats) => stats.bestWPM >= 100,
    progress: (stats) => Math.min(stats.bestWPM, 100),
  },
  {
    id: 'flawless',
    name: '无懈可击',
    description: '准确率达到 100%',
    icon: '💫',
    category: 'expert',
    unlocked: false,
    maxProgress: 100,
    condition: (stats) => stats.bestAccuracy >= 100,
    progress: (stats) => Math.min(stats.bestAccuracy, 100),
  },
  {
    id: 'century',
    name: '世纪练习',
    description: '累计练习 100 小时',
    icon: '⌛',
    category: 'expert',
    unlocked: false,
    maxProgress: 360000,
    condition: (stats) => stats.totalPlayTime >= 360000,
    progress: (stats) => Math.min(stats.totalPlayTime, 360000),
  },
  {
    id: 'millionaire',
    name: '百万富翁',
    description: '累计输入 100 万字符',
    icon: '💰',
    category: 'expert',
    unlocked: false,
    maxProgress: 1000000,
    condition: (stats) => stats.totalCharacters >= 1000000,
    progress: (stats) => Math.min(stats.totalCharacters, 1000000),
  },
]

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(a => a.id === id)
}

export function getAchievementsByCategory(category: string): Achievement[] {
  return achievements.filter(a => a.category === category)
}

export function calculateProgress(achievement: Achievement, stats: AchievementStats): number {
  if (achievement.progress) {
    return achievement.progress(stats)
  }
  return achievement.condition(stats) ? achievement.maxProgress : 0
}
