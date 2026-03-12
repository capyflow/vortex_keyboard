import { ref, readonly, onUnmounted } from 'vue'
import { musicManager } from '@/utils/music'

const STORAGE_KEY = 'vortex_keyboard_music_settings'

export function useMusic() {
  const isPlaying = ref(false)
  const volume = ref(0.3)
  const currentBpm = ref(60)
  const currentTheme = ref('')

  // 加载设置
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const config = JSON.parse(saved)
        volume.value = config.volume || 0.3
        musicManager.setVolume(volume.value)
      }
    } catch (e) {
      console.error('Failed to load music settings:', e)
    }
  }

  // 保存设置
  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume: volume.value }))
    } catch (e) {
      console.error('Failed to save music settings:', e)
    }
  }

  // 播放关卡音乐
  async function playLevel(bpm: number, theme: string) {
    try {
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
    currentBpm.value = 0
    currentTheme.value = ''
  }

  // 设置音量
  function setVolume(newVolume: number) {
    volume.value = Math.max(0, Math.min(1, newVolume))
    musicManager.setVolume(volume.value)
    saveSettings()
  }

  // 切换播放状态
  function toggle() {
    if (isPlaying.value) {
      stopLevel()
    } else {
      if (currentBpm.value > 0) {
        playLevel(currentBpm.value, currentTheme.value)
      }
    }
  }

  // 清理
  onUnmounted(() => {
    stopLevel()
  })

  return {
    isPlaying: readonly(isPlaying),
    volume: readonly(volume),
    currentBpm: readonly(currentBpm),
    currentTheme: readonly(currentTheme),
    loadSettings,
    playLevel,
    stopLevel,
    setVolume,
    toggle,
  }
}
