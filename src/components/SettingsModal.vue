<template>
  <div class="settings-modal" @click.self="emit('close')">
    <div class="modal-content">
      <h2 class="title">⚙️ 设置</h2>
      
      <div class="settings-section">
        <h3 class="section-title">🔊 音效设置</h3>
        
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-icon">🔊</span>
            <span>启用音效</span>
          </div>
          <label class="toggle">
            <input
              type="checkbox"
              :checked="sound.config.value.enabled"
              @change="handleToggleSound"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-icon">📢</span>
            <span>音效音量</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            :value="sound.config.value.volume * 100"
            @input="handleSetVolume"
            class="slider"
          />
          <span class="value">{{ Math.round(sound.config.value.volume * 100) }}%</span>
        </div>
      </div>
      
      <div class="settings-section">
        <h3 class="section-title">🎵 关卡音乐</h3>
        
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-icon">🎹</span>
            <span>动态音乐</span>
          </div>
          <label class="toggle">
            <input
              type="checkbox"
              :checked="music.enabled.value"
              @change="handleToggleMusic"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-icon">🎼</span>
            <span>音乐音量</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            :value="music.volume.value * 100"
            @input="handleSetMusicVolume"
            class="slider"
          />
          <span class="value">{{ Math.round(music.volume.value * 100) }}%</span>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-icon">ℹ️</span>
            <span>说明</span>
          </div>
          <span class="setting-desc">每个关卡有独特的 BPM 和主题音乐</span>
        </div>
      </div>
      
      <!-- 主题选择 -->
      <ThemeSelector
        v-model="currentThemeId"
      />
      
      <div class="settings-section">
        <h3 class="section-title">🎨 显示设置</h3>
        
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-icon">📝</span>
            <span>字体大小</span>
          </div>
          <select :value="settingsStore.settings.fontSize" @change="handleSetFontSize" class="select">
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </div>
      </div>
      
      <div class="settings-section">
        <h3 class="section-title">📊 数据管理</h3>
        
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-icon">💾</span>
            <span>清除所有进度</span>
          </div>
          <button @click="handleClearData" class="btn btn-danger">
            清除数据
          </button>
        </div>
      </div>
      
      <div class="actions">
        <button @click="emit('close')" class="btn btn-primary">
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useSound } from '@/composables/useSound'
import { useMusic } from '@/composables/useMusic'
import { useTheme } from '@/composables/useTheme'
import { useSettingsStore } from '@/stores/settings'
import ThemeSelector from '@/components/ThemeSelector.vue'

const emit = defineEmits<{
  close: []
}>()

const sound = useSound()
const music = useMusic()
const theme = useTheme()
const settingsStore = useSettingsStore()
const currentThemeId = ref(theme.theme.value.id)

// 加载设置
onMounted(() => {
  settingsStore.loadSettings()
  music.loadSettings()
  theme.loadTheme()
  sound.loadSettings()
})

// 监听主题选择变化
watch(currentThemeId, (newId) => {
  theme.setTheme(newId)
  settingsStore.setTheme(newId)
})

// 监听主题变化
watch(() => theme.theme.value.id, (newId) => {
  currentThemeId.value = newId
})

function handleToggleSound() {
  sound.toggleSound()
  // 重新加载设置确保同步
  setTimeout(() => {
    sound.loadSettings()
  }, 100)
}

function handleSetVolume(event: Event) {
  const value = (event.target as HTMLInputElement).value
  sound.setVolume(Number(value) / 100)
  settingsStore.setSoundVolume(Number(value) / 100)
}

function handleToggleMusic() {
  music.toggle()
  settingsStore.setMusicEnabled(music.enabled.value)
}

function handleSetMusicVolume(event: Event) {
  const value = (event.target as HTMLInputElement).value
  music.setVolume(Number(value) / 100)
  settingsStore.setMusicVolume(Number(value) / 100)
}

function handleSetFontSize(event: Event) {
  const value = (event.target as HTMLSelectElement).value as 'small' | 'medium' | 'large'
  settingsStore.setFontSize(value)
}

function handleClearData() {
  if (confirm('确定要清除所有游戏进度吗？此操作不可恢复！')) {
    localStorage.clear()
    location.reload()
  }
}
</script>

<style scoped>
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
  }
}

.title {
  font-size: 1.75rem;
  font-family: 'Fredoka One', cursive;
  color: #292F36;
  text-align: center;
  margin-bottom: 2rem;
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #F3F4F6;
}

.settings-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #292F36;
  margin-bottom: 1rem;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  font-size: 1rem;
  color: #292F36;
}

.setting-icon {
  font-size: 1.25rem;
}

/* 开关样式 */
.toggle {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #E5E7EB;
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle input:checked + .toggle-slider {
  background-color: #FF6B6B;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* 滑块样式 */
.slider {
  width: 120px;
  height: 6px;
  border-radius: 3px;
  background: #E5E7EB;
  outline: none;
  -webkit-appearance: none;
}

@media (max-width: 480px) {
  .slider {
    width: 100%;
  }
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #FF6B6B;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #FF6B6B;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.value {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: #6B7280;
}

.setting-desc {
  font-size: 0.75rem;
  color: #9CA3AF;
  font-style: italic;
}

/* 下拉框 */
.select {
  padding: 0.5rem 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  color: #292F36;
  background: white;
  cursor: pointer;
}

.select:focus {
  outline: none;
  border-color: #FF6B6B;
}

/* 按钮 */
.actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8B94 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.btn-danger {
  background: #FEE2E2;
  color: #DC2626;
}

.btn-danger:hover {
  background: #FECACA;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
