export interface InteractionMessage {
  id: string
  text: string
  emoji: string
  category: 'perfect' | 'excellent' | 'good' | 'needs_improvement'
  condition: (stats: LevelStats) => boolean
}

export interface LevelStats {
  accuracy: number      // 准确率 0-100
  wpm: number          // WPM
  time: number         // 耗时（秒）
  combo: number        // 最高连击
  chars: number        // 字符数
  wrongChars: number   // 错误数
}

// 互动语句库
export const interactionMessages: InteractionMessage[] = [
  // ==================== 完美表现 ====================
  {
    id: 'god_like',
    text: '天哪！你是打字机成精了吗？！这速度简直不可思议！🚀',
    emoji: '👑',
    category: 'perfect',
    condition: (stats) => stats.accuracy >= 98 && stats.wpm >= 80,
  },
  {
    id: 'speed_demon',
    text: '哇塞！这手速是开了挂吧？键盘都要被你敲出火星了！🔥',
    emoji: '⚡',
    category: 'perfect',
    condition: (stats) => stats.accuracy >= 95 && stats.wpm >= 70,
  },
  {
    id: 'perfectionist',
    text: '完美！一个错误都没有！你是怎么做到的？！🎯',
    emoji: '💎',
    category: 'perfect',
    condition: (stats) => stats.accuracy === 100 && stats.wpm >= 50,
  },
  {
    id: 'machine_gun',
    text: '哒哒哒哒！你这打字速度堪比加特林啊！💪',
    emoji: '🎹',
    category: 'perfect',
    condition: (stats) => stats.wpm >= 90,
  },
  
  // ==================== 优秀表现 ====================
  {
    id: 'excellent_speed',
    text: '太厉害了！这速度和准确率，佩服佩服！👏',
    emoji: '🌟',
    category: 'excellent',
    condition: (stats) => stats.accuracy >= 95 && stats.wpm >= 60,
  },
  {
    id: 'solid_performance',
    text: '表现很棒！继续保持这个状态！💪',
    emoji: '✨',
    category: 'excellent',
    condition: (stats) => stats.accuracy >= 90 && stats.wpm >= 50,
  },
  {
    id: 'accurate_but_slow',
    text: '准确率很高哦！不过速度可以再快一点，加油！⏱️',
    emoji: '🐢',
    category: 'excellent',
    condition: (stats) => stats.accuracy >= 95 && stats.wpm < 40,
  },
  {
    id: 'fast_but_careless',
    text: '速度很快！但是错误有点多呢，慢一点会更棒！🎯',
    emoji: '🐇',
    category: 'excellent',
    condition: (stats) => stats.wpm >= 60 && stats.accuracy < 90,
  },
  
  // ==================== 良好表现 ====================
  {
    id: 'good_job',
    text: '不错不错！已经掌握要领了！继续加油！😊',
    emoji: '👍',
    category: 'good',
    condition: (stats) => stats.accuracy >= 85 && stats.wpm >= 40,
  },
  {
    id: 'getting_better',
    text: '有进步！多练习会越来越快的！📈',
    emoji: '🌱',
    category: 'good',
    condition: (stats) => stats.accuracy >= 80 && stats.wpm >= 35,
  },
  {
    id: 'careful_typing',
    text: '很认真地在打字呢！准确率不错，速度可以再提一提～💡',
    emoji: '📚',
    category: 'good',
    condition: (stats) => stats.accuracy >= 90 && stats.wpm < 35,
  },
  {
    id: 'speed_up',
    text: '速度还可以更快！相信自己，再来一次！🚀',
    emoji: '💨',
    category: 'good',
    condition: (stats) => stats.wpm >= 45 && stats.accuracy < 85,
  },
  
  // ==================== 需要改进 ====================
  {
    id: 'keep_practicing',
    text: '没关系，多练习就会进步的！我看好你哦！💪',
    emoji: '🌈',
    category: 'needs_improvement',
    condition: (stats) => stats.accuracy >= 70 && stats.wpm < 30,
  },
  {
    id: 'dont_give_up',
    text: '别灰心！每个人都是从新手开始的，继续加油！🔥',
    emoji: '💖',
    category: 'needs_improvement',
    condition: (stats) => stats.accuracy < 70 && stats.wpm < 30,
  },
  {
    id: 'focus_on_accuracy',
    text: '速度不错！但是要注意准确率哦，慢一点没关系～🎯',
    emoji: '📍',
    category: 'needs_improvement',
    condition: (stats) => stats.wpm >= 40 && stats.accuracy < 75,
  },
  {
    id: 'take_your_time',
    text: '慢慢来，先把准确率提上去，速度会跟上来的！⏰',
    emoji: '🐌',
    category: 'needs_improvement',
    condition: (stats) => stats.accuracy < 80 && stats.wpm < 25,
  },
  
  // ==================== 特殊成就 ====================
  {
    id: 'combo_master',
    text: '哇！这个连击数太惊人了！你是怎么做到的？！🔥',
    emoji: '🎆',
    category: 'perfect',
    condition: (stats) => stats.combo >= 50,
  },
  {
    id: 'marathon',
    text: '这么长的文本都打完了！耐力惊人！🏃',
    emoji: '📜',
    category: 'excellent',
    condition: (stats) => stats.chars >= 100,
  },
  {
    id: 'comeback',
    text: '虽然错了几次但坚持完成了！这种精神值得表扬！👏',
    emoji: '🌟',
    category: 'good',
    condition: (stats) => stats.wrongChars >= 5 && stats.accuracy >= 80,
  },
]

// 获取互动语句
export function getInteractionMessage(stats: LevelStats): InteractionMessage | null {
  // 按优先级排序：perfect > excellent > good > needs_improvement
  const sortedMessages = [...interactionMessages].sort((a, b) => {
    const priority = {
      'perfect': 0,
      'excellent': 1,
      'good': 2,
      'needs_improvement': 3,
    }
    return priority[a.category] - priority[b.category]
  })

  // 找到第一个符合条件的消息
  for (const msg of sortedMessages) {
    if (msg.condition(stats)) {
      return msg
    }
  }

  // 默认消息
  return {
    id: 'default',
    text: '完成！继续加油，你会越来越棒的！',
    emoji: '✨',
    category: 'good',
    condition: () => true,
  }
}

// 获取随机鼓励语句（用于加载界面等）
export const encouragementMessages = [
  '加油！你可以的！💪',
  '相信自己！🌟',
  '专注当下，享受过程！🎯',
  '每一次练习都是进步！📈',
  '你是最棒的！✨',
  '坚持就是胜利！🏆',
  '享受打字的乐趣吧！🎹',
  '深呼吸，放松，你可以的！🧘',
]

export function getRandomEncouragement(): string {
  return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]!
}
