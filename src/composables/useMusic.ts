import { ref, readonly } from 'vue'
import { musicManager } from '@/utils/music'
import { useSettingsStore } from '@/stores/settings'

const STORAGE_KEY = 'vortex_keyboard_music_settings'

const isPlaying = ref(false)
const volume = ref(0.3)
const currentBpm = ref(60)
const currentTheme = ref('')
const enabled = ref(true)

export function useMusic() {
  const settingsStore = useSettingsStore()
  // 加载设置
  function loadSettings() {
    try {
      settingsStore.loadSettings()
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const config = JSON.parse(saved)
        volume.value = config.volume || 0.3
        enabled.value = typeof config.enabled === 'boolean' ? config.enabled : true
        musicManager.setVolume(volume.value)
      }
      if (typeof settingsStore.settings.musicEnabled === 'boolean') {
        enabled.value = settingsStore.settings.musicEnabled
      }
      if (typeof settingsStore.settings.musicVolume === 'number') {
        volume.value = settingsStore.settings.musicVolume
        musicManager.setVolume(volume.value)
      }
    } catch (e) {
      console.error('Failed to load music settings:', e)
    }
  }

  // 保存设置
  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        volume: volume.value,
        enabled: enabled.value 
      }))
      settingsStore.setMusicEnabled(enabled.value)
      settingsStore.setMusicVolume(volume.value)
    } catch (e) {
      console.error('Failed to save music settings:', e)
    }
  }

  // 播放关卡音乐
  async function playLevel(bpm: number, theme: string) {
    try {
      // 如果用户关闭了音乐，不播放
      if (!enabled.value) return
      
      currentBpm.value = bpm
      currentTheme.value = theme
      await musicManager.playLevelMusic(bpm, theme)
      isPlaying.value = true
    } catch (e) {
      console.error('Failed to play level music:', e)
    }
  }

  // 停止音乐
  function stopLevel() {
    musicManager.stopMusic()
    isPlaying.value = false
  }

  // 设置音量
  function setVolume(newVolume: number) {
    volume.value = Math.max(0, Math.min(1, newVolume))
    musicManager.setVolume(volume.value)
    saveSettings()
  }

  // 切换播放状态
  function toggle() {
    enabled.value = !enabled.value
    if (enabled.value) {
      // 开启音乐，如果有当前关卡则播放
      if (currentBpm.value > 0) {
        playLevel(currentBpm.value, currentTheme.value)
      }
    } else {
      // 关闭音乐
      stopLevel()
    }
    saveSettings() // 保存开关状态
  }

  // 设置启用状态
  function setEnabled(value: boolean) {
    enabled.value = value
    if (!value) {
      stopLevel()
    } else if (currentBpm.value > 0) {
      playLevel(currentBpm.value, currentTheme.value)
    }
    saveSettings()
  }

  // 更新关卡上下文（不强制播放）
  function setLevelContext(bpm: number, theme: string) {
    currentBpm.value = bpm
    currentTheme.value = theme
  }

  return {
    isPlaying: readonly(isPlaying),
    volume: readonly(volume),
    enabled: readonly(enabled),
    currentBpm: readonly(currentBpm),
    currentTheme: readonly(currentTheme),
    loadSettings,
    playLevel,
    stopLevel,
    setLevelContext,
    setVolume,
    toggle,
    setEnabled,
  }
}
