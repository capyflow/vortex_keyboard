export interface Theme {
  id: string
  name: string
  emoji: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    gradient: [string, string, string]
  }
}

export const themes: Theme[] = [
  {
    id: 'purple-dream',
    name: '紫色梦境',
    emoji: '💜',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#1a1a2e',
      gradient: ['#667eea', '#764ba2', '#f093fb'],
    },
  },
  {
    id: 'blue-ocean',
    name: '蓝色海洋',
    emoji: '💙',
    colors: {
      primary: '#4facfe',
      secondary: '#00f2fe',
      accent: '#43e97b',
      background: '#0a1628',
      gradient: ['#4facfe', '#00f2fe', '#43e97b'],
    },
  },
  {
    id: 'sunset-orange',
    name: '日落橙光',
    emoji: '🧡',
    colors: {
      primary: '#f12711',
      secondary: '#f5af19',
      accent: '#ff9a9e',
      background: '#2d132c',
      gradient: ['#f12711', '#f5af19', '#ff9a9e'],
    },
  },
  {
    id: 'forest-green',
    name: '森林绿意',
    emoji: '💚',
    colors: {
      primary: '#134e5e',
      secondary: '#71b280',
      accent: '#c9d6ff',
      background: '#0f2027',
      gradient: ['#134e5e', '#71b280', '#c9d6ff'],
    },
  },
  {
    id: 'pink-sakura',
    name: '粉色樱花',
    emoji: '🌸',
    colors: {
      primary: '#ff9a9e',
      secondary: '#fecfef',
      accent: '#a18cd1',
      background: '#2d1b2e',
      gradient: ['#ff9a9e', '#fecfef', '#a18cd1'],
    },
  },
  {
    id: 'cyber-punk',
    name: '赛博朋克',
    emoji: '🤖',
    colors: {
      primary: '#00f2fe',
      secondary: '#4facfe',
      accent: '#f093fb',
      background: '#0f0c29',
      gradient: ['#00f2fe', '#4facfe', '#f093fb'],
    },
  },
  {
    id: 'golden-hour',
    name: '金色时光',
    emoji: '✨',
    colors: {
      primary: '#f7971e',
      secondary: '#ffd200',
      accent: '#11998e',
      background: '#1a1a2e',
      gradient: ['#f7971e', '#ffd200', '#11998e'],
    },
  },
  {
    id: 'midnight-blue',
    name: '午夜深蓝',
    emoji: '🌙',
    colors: {
      primary: '#2c3e50',
      secondary: '#4ca1af',
      accent: '#e0eafc',
      background: '#0f2027',
      gradient: ['#2c3e50', '#4ca1af', '#e0eafc'],
    },
  },
]

export function getThemeById(id: string): Theme | undefined {
  return themes.find(t => t.id === id)
}

export function getDefaultTheme(): Theme {
  return themes[0]! // 紫色梦境
}
