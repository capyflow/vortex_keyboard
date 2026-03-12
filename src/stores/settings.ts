import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SettingsState {
  fontSize: 'small' | 'medium' | 'large'
  theme: string
  soundEnabled: boolean
  soundVolume: number
  musicEnabled: boolean
  musicVolume: number
}

const STORAGE_KEY = 'vortex_keyboard_settings'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<SettingsState>({
    fontSize: 'medium',
    theme: 'default',
    soundEnabled: true,
    soundVolume: 0.5,
    musicEnabled: false,
    musicVolume: 0.3,
  })

  // 从 localStorage 加载
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        settings.value = { ...settings.value, ...parsed }
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }

  // 保存到 localStorage
  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
      applySettings()
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  // 应用设置到 DOM
  function applySettings() {
    const root = document.documentElement
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }
    root.style.setProperty('--base-font-size', fontSizeMap[settings.value.fontSize])
  }

  function setFontSize(size: 'small' | 'medium' | 'large') {
    settings.value.fontSize = size
    saveSettings()
  }

  function setTheme(themeId: string) {
    settings.value.theme = themeId
    saveSettings()
  }

  function setSoundEnabled(enabled: boolean) {
    settings.value.soundEnabled = enabled
    saveSettings()
  }

  function setSoundVolume(volume: number) {
    settings.value.soundVolume = volume
    saveSettings()
  }

  function setMusicEnabled(enabled: boolean) {
    settings.value.musicEnabled = enabled
    saveSettings()
  }

  function setMusicVolume(volume: number) {
    settings.value.musicVolume = volume
    saveSettings()
  }

  return {
    settings,
    loadSettings,
    saveSettings,
    setFontSize,
    setTheme,
    setSoundEnabled,
    setSoundVolume,
    setMusicEnabled,
    setMusicVolume,
  }
})
