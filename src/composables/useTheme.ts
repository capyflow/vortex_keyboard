import { ref, readonly, watch } from 'vue'
import { getThemeById, getDefaultTheme, themes, type Theme } from '@/data/themes'

const STORAGE_KEY = 'vortex_keyboard_theme'

export function useTheme() {
  const currentTheme = ref<Theme>(getDefaultTheme())
  const isLoaded = ref(false)

  // 加载主题
  function loadTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const theme = getThemeById(saved)
        if (theme) {
          currentTheme.value = theme
        }
      }
    } catch (e) {
      console.error('Failed to load theme:', e)
    }
    isLoaded.value = true
    applyTheme(currentTheme.value)
  }

  // 保存主题
  function saveTheme() {
    try {
      localStorage.setItem(STORAGE_KEY, currentTheme.value.id)
    } catch (e) {
      console.error('Failed to save theme:', e)
    }
  }

  // 应用主题到 CSS 变量
  function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.style.setProperty('--theme-primary', theme.colors.primary)
    root.style.setProperty('--theme-secondary', theme.colors.secondary)
    root.style.setProperty('--theme-accent', theme.colors.accent)
    root.style.setProperty('--theme-background', theme.colors.background)
    root.style.setProperty('--theme-gradient-1', theme.colors.gradient[0])
    root.style.setProperty('--theme-gradient-2', theme.colors.gradient[1])
    root.style.setProperty('--theme-gradient-3', theme.colors.gradient[2])
  }

  // 切换主题
  function setTheme(themeId: string) {
    const theme = getThemeById(themeId)
    if (theme) {
      currentTheme.value = theme
      applyTheme(theme)
      saveTheme()
    }
  }

  // 切换到下一个主题
  function nextTheme() {
    const currentIndex = themes.findIndex(t => t.id === currentTheme.value.id)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    if (nextTheme) {
      setTheme(nextTheme.id)
    }
  }

  // 监听主题变化
  watch(currentTheme, () => {
    applyTheme(currentTheme.value)
  })

  return {
    theme: readonly(currentTheme),
    themes,
    isLoaded: readonly(isLoaded),
    loadTheme,
    setTheme,
    nextTheme,
  }
}
