export interface Level {
  id: number
  name: string
  text: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  description: string
}

export const levels: Level[] = [
  // ==================== 简单难度 (1-8) ====================
  {
    id: 1,
    name: '热身运动',
    text: 'the quick brown fox jumps over the lazy dog',
    difficulty: 'easy',
    description: '经典的英文字母练习句',
  },
  {
    id: 2,
    name: '基础单词',
    text: 'hello world welcome to vortex keyboard practice makes perfect',
    difficulty: 'easy',
    description: '常用单词组合',
  },
  {
    id: 3,
    name: '短句练习',
    text: 'coding is fun typing fast is awesome keep going you are doing great',
    difficulty: 'easy',
    description: '鼓励短句',
  },
  {
    id: 4,
    name: '每日问候',
    text: 'good morning have a nice day good night see you later take care',
    difficulty: 'easy',
    description: '日常问候用语',
  },
  {
    id: 5,
    name: '数字练习',
    text: 'one two three four five six seven eight nine ten eleven twelve',
    difficulty: 'easy',
    description: '英文数字拼写',
  },
  {
    id: 6,
    name: '颜色世界',
    text: 'red blue green yellow orange purple pink black white brown gray',
    difficulty: 'easy',
    description: '颜色单词练习',
  },
  {
    id: 7,
    name: '动物乐园',
    text: 'cat dog elephant lion tiger monkey zebra giraffe rabbit panda',
    difficulty: 'easy',
    description: '动物名称练习',
  },
  {
    id: 8,
    name: '食物时光',
    text: 'apple banana orange pizza burger sushi noodle rice bread cheese',
    difficulty: 'easy',
    description: '食物单词练习',
  },
  
  // ==================== 中等难度 (9-16) ====================
  {
    id: 9,
    name: '中级挑战',
    text: 'the five boxing wizards jump quickly at the crazy party while eating pizza',
    difficulty: 'medium',
    description: '包含更多字母组合',
  },
  {
    id: 10,
    name: '速度提升',
    text: 'pack my box with five dozen liquor jugs and three bottles of wine for the trip',
    difficulty: 'medium',
    description: '全字母句子',
  },
  {
    id: 11,
    name: '长句练习',
    text: 'programming is the art of telling another human what one wants the computer to do with precision and clarity',
    difficulty: 'medium',
    description: '编程相关句子',
  },
  {
    id: 12,
    name: '名言警句',
    text: 'the only way to do great work is to love what you do and never give up on your dreams',
    difficulty: 'medium',
    description: '励志名言练习',
  },
  {
    id: 13,
    name: '科技世界',
    text: 'artificial intelligence machine learning deep learning neural networks and data science are changing the world',
    difficulty: 'medium',
    description: '科技术语练习',
  },
  {
    id: 14,
    name: '旅行日记',
    text: 'yesterday i traveled to paris and visited the eiffel tower the louvre museum and notre dame cathedral',
    difficulty: 'medium',
    description: '旅行场景描述',
  },
  {
    id: 15,
    name: '天气预报',
    text: 'today is sunny with a high of twenty five degrees tomorrow will be cloudy with a chance of rain in the evening',
    difficulty: 'medium',
    description: '天气描述练习',
  },
  {
    id: 16,
    name: '运动健康',
    text: 'regular exercise healthy eating and enough sleep are the three pillars of a healthy lifestyle',
    difficulty: 'medium',
    description: '健康主题练习',
  },
  
  // ==================== 困难难度 (17-24) ====================
  {
    id: 17,
    name: '高级挑战',
    text: 'sphinx of black quartz judge my vow and accept the challenge that lies ahead with courage',
    difficulty: 'hard',
    description: '高难度字母组合',
  },
  {
    id: 18,
    name: '代码片段',
    text: 'function hello() { return world } const greeting = hello() console.log(greeting)',
    difficulty: 'hard',
    description: '基础代码练习',
  },
  {
    id: 19,
    name: '极速模式',
    text: 'the rapid brown fox leaps over the sleepy dog while the moon shines bright above the quiet forest',
    difficulty: 'hard',
    description: '长句速度挑战',
  },
  {
    id: 20,
    name: '商业邮件',
    text: 'dear mr smith i am writing to follow up on our previous discussion regarding the project proposal and budget allocation',
    difficulty: 'hard',
    description: '商务邮件写作',
  },
  {
    id: 21,
    name: '学术论文',
    text: 'the methodology employed in this study involves quantitative analysis of survey data collected from over five hundred participants',
    difficulty: 'hard',
    description: '学术写作风格',
  },
  {
    id: 22,
    name: '法律条文',
    text: 'pursuant to the terms and conditions set forth in section three paragraph b of the agreement all parties must comply',
    difficulty: 'hard',
    description: '法律文本练习',
  },
  {
    id: 23,
    name: '诗歌韵律',
    text: 'the fog comes on little cat feet it sits looking over harbor and city on silent haunches and then moves on',
    difficulty: 'hard',
    description: '英文诗歌练习',
  },
  {
    id: 24,
    name: '新闻播报',
    text: 'breaking news the stock market reached record highs today as investors responded positively to the federal reserve announcement',
    difficulty: 'hard',
    description: '新闻稿练习',
  },
  
  // ==================== 专家难度 (25-30) ====================
  {
    id: 25,
    name: '专家考验',
    text: 'xyz abcdefghijklmnopqrstuvwxyz 0123456789 special characters like @#$%^&*() and punctuation marks too',
    difficulty: 'expert',
    description: '综合字符练习',
  },
  {
    id: 26,
    name: '医学报告',
    text: 'the patient presented with symptoms including persistent cough fever of thirty nine degrees celsius and difficulty breathing requiring immediate hospitalization',
    difficulty: 'expert',
    description: '医学术语练习',
  },
  {
    id: 27,
    name: '哲学思考',
    text: 'the unexamined life is not worth living said socrates but what does it mean to examine ones life in the modern digital age',
    difficulty: 'expert',
    description: '哲学主题练习',
  },
  {
    id: 28,
    name: '复杂代码',
    text: 'const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)',
    difficulty: 'expert',
    description: '高级代码片段',
  },
  {
    id: 29,
    name: '多国混排',
    text: 'hello 你好 こんにちは 안녕 Bonjour Hola Ciao Guten Tag Namaste 世界',
    difficulty: 'expert',
    description: '多语言混合练习',
  },
  {
    id: 30,
    name: '终极挑战',
    text: 'the quick brown fox jumps over the lazy dog while sphinx of black quartz judges my vow and packs five dozen liquor jugs into my box',
    difficulty: 'expert',
    description: '经典句子大集合',
  },
]

export function getLevel(id: number): Level | undefined {
  return levels.find(l => l.id === id)
}

export function getNextLevel(id: number): Level | undefined {
  return levels.find(l => l.id === id + 1)
}

export function getLevelsByDifficulty(difficulty: string): Level[] {
  return levels.filter(l => l.difficulty === difficulty)
}
