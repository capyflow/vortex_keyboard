import { ref, readonly } from 'vue'
import { soundManager, type SoundConfig } from '@/utils/sound'

const STORAGE_KEY = 'vortex_keyboard_sound_settings'

export function useSound() {
  const config = ref<SoundConfig>({
    enabled: true,
    volume: 0.5,
    musicEnabled: false,
    musicVolume: 0.3,
  })

  // 加载设置
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        config.value = JSON.parse(saved)
        soundManager.config.value = config.value
        soundManager.setEnabled(config.value.enabled)
        soundManager.setVolume(config.value.volume)
        soundManager.setMusicEnabled(config.value.musicEnabled)
        soundManager.setMusicVolume(config.value.musicVolume)
      }
    } catch (e) {
      console.error('Failed to load sound settings:', e)
    }
  }

  // 保存设置
  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
    } catch (e) {
      console.error('Failed to save sound settings:', e)
    }
  }

  // 播放按键音
  function playKey() {
    soundManager.playKey()
  }

  // 播放错误音
  function playError() {
    soundManager.playError()
  }

  // 播放连击音
  function playCombo(combo: number) {
    soundManager.playCombo(combo)
  }

  // 播放完成音
  function playComplete() {
    soundManager.playComplete()
  }

  // 切换音效开关
  function toggleSound() {
    config.value.enabled = !config.value.enabled
    soundManager.setEnabled(config.value.enabled)
    saveSettings()
  }

  // 设置音量
  function setVolume(volume: number) {
    config.value.volume = volume
    soundManager.setVolume(volume)
    saveSettings()
  }

  // 切换背景音乐
  function toggleMusic() {
    config.value.musicEnabled = !config.value.musicEnabled
    soundManager.setMusicEnabled(config.value.musicEnabled)
    saveSettings()
  }

  // 设置音乐音量
  function setMusicVolume(volume: number) {
    config.value.musicVolume = volume
    soundManager.setMusicVolume(volume)
    saveSettings()
  }

  return {
    config: readonly(config),
    loadSettings,
    playKey,
    playError,
    playCombo,
    playComplete,
    toggleSound,
    setVolume,
    toggleMusic,
    setMusicVolume,
  }
}
