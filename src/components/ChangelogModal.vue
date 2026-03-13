<template>
  <div class="changelog-modal" @click.self="handleClose">
    <div class="changelog-content">
      <div class="changelog-header">
        <h2>📋 更新日志</h2>
        <button @click="handleClose" class="close-btn">✕</button>
      </div>

      <div class="changelog-body">
        <div v-for="version in changelog" :key="version.version" class="version-block">
          <div class="version-header">
            <h3>{{ version.version }}</h3>
            <span class="version-date">{{ version.date }}</span>
          </div>
          
          <div class="version-changes">
            <div v-for="(change, idx) in version.changes" :key="idx" 
                 :class="['change-item', 'change-' + change.type]">
              <span class="change-icon">{{ getChangeIcon(change.type) }}</span>
              <span class="change-text">{{ change.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="changelog-footer">
        <button @click="handleClose" class="btn-primary">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Change {
  type: 'feat' | 'fix' | 'chore' | 'docs' | 'style' | 'refactor'
  text: string
}

interface VersionLog {
  version: string
  date: string
  changes: Change[]
}

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// 更新日志数据
const changelog = ref<VersionLog[]>([
  {
    version: 'v1.6.0 - 反作弊系统',
    date: '2026-03-13 22:50',
    changes: [
      { type: 'feat', text: '实现反作弊系统，防止自动化脚本刷关' },
      { type: 'feat', text: '输入行为检测（按键间隔分析、标准差计算）' },
      { type: 'feat', text: '风险评分系统（0-100 分），多层检测规则' },
      { type: 'feat', text: '自动阻止粘贴功能' },
      { type: 'fix', text: '修复检测到作弊后弹窗不显示的问题' },
      { type: 'fix', text: '优化事件绑定逻辑，确保按键被正确记录' },
      { type: 'docs', text: '添加完整的反作弊文档 ANTI_CHEAT.md' }
    ]
  },
  {
    version: 'v1.5.0',
    date: '2026-03-13 00:18',
    changes: [
      { type: 'chore', text: '更新版本号至 v1.5.0' },
      { type: 'feat', text: '首页底部显示版本号和最后更新时间' },
      { type: 'style', text: '日期精确到分钟' }
    ]
  },
  {
    version: 'v1.4.0',
    date: '2026-03-13 00:06',
    changes: [
      { type: 'fix', text: '修复移动端重复输入问题' },
      { type: 'fix', text: '修复错误检测逻辑，检查 currentCharIndex 是否增加' },
      { type: 'fix', text: '错误输入后立即停止，等待用户重新输入' }
    ]
  },
  {
    version: 'v1.3.0',
    date: '2026-03-13 00:03',
    changes: [
      { type: 'fix', text: '修复移动端输入错误' },
      { type: 'fix', text: 'processInputChar 错误时重置 userInput 和隐藏输入框' },
      { type: 'fix', text: '确保移动端输入错误后输入框内容正确同步' }
    ]
  },
  {
    version: 'v1.2.0',
    date: '2026-03-13 00:00',
    changes: [
      { type: 'fix', text: '修复 TypeScript 错误' },
      { type: 'fix', text: '修复 music.ts 和 sound.ts 类型问题' }
    ]
  }
])

function getChangeIcon(type: string): string {
  const icons: Record<string, string> = {
    feat: '✨',
    fix: '🐛',
    chore: '🔧',
    docs: '📝',
    style: '💄',
    refactor: '♻️'
  }
  return icons[type] || '•'
}

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.changelog-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.changelog-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.changelog-header {
  padding: 25px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.changelog-header h2 {
  margin: 0;
  font-size: 24px;
  color: #f0f0f0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #a0a0a0;
  font-size: 24px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f0f0f0;
}

.changelog-body {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

.version-block {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.version-block:last-child {
  border-bottom: none;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.version-header h3 {
  margin: 0;
  font-size: 18px;
  color: #4ecca3;
  font-weight: bold;
}

.version-date {
  font-size: 13px;
  color: #a0a0a0;
}

.version-changes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.change-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid transparent;
}

.change-feat {
  border-left-color: #4ecca3;
}

.change-fix {
  border-left-color: #e94560;
}

.change-chore {
  border-left-color: #f0932b;
}

.change-docs {
  border-left-color: #5352ed;
}

.change-style {
  border-left-color: #ff9ff3;
}

.change-refactor {
  border-left-color: #00d2d3;
}

.change-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.change-text {
  color: #f0f0f0;
  font-size: 14px;
  line-height: 1.6;
}

.changelog-footer {
  padding: 20px 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #4ecca3 0%, #38b590 100%);
  color: #1a1a2e;
  border: none;
  padding: 12px 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(78, 204, 163, 0.4);
}

/* 滚动条样式 */
.changelog-body::-webkit-scrollbar {
  width: 8px;
}

.changelog-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.changelog-body::-webkit-scrollbar-thumb {
  background: rgba(78, 204, 163, 0.5);
  border-radius: 4px;
}

.changelog-body::-webkit-scrollbar-thumb:hover {
  background: rgba(78, 204, 163, 0.7);
}

@media (max-width: 640px) {
  .changelog-content {
    width: 95%;
    max-height: 90vh;
  }

  .changelog-header {
    padding: 20px;
  }

  .changelog-body {
    padding: 20px;
  }

  .version-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
