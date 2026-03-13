/**
 * Vortex Keyboard - 反作弊 Composable
 * 集成到 Vue 组件中
 */

import { ref } from 'vue'
import { antiCheat, type CheatDetectionResult } from '../utils/antiCheat'

export function useAntiCheat() {
  const isCheatingDetected = ref(false)
  const detectionResult = ref<CheatDetectionResult | null>(null)
  const showWarning = ref(false)

  // 监听键盘事件
  const handleKeydown = (e: KeyboardEvent) => {
    // 记录按键
    antiCheat.recordKey(e.key, Date.now())

    // 记录退格
    if (e.key === 'Backspace') {
      antiCheat.recordBackspace()
    }
  }

  // 监听输入事件
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    if (target) {
      antiCheat.recordInput(target.value)
    }
  }

  // 监听粘贴事件（可选：阻止粘贴）
  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault()
    console.warn('[AntiCheat] 粘贴已被阻止')

    // 记录可疑行为
    const text = e.clipboardData?.getData('text') || ''
    if (text.length > 0) {
      antiCheat.recordInput(text)
    }
  }

  // 提交时验证
  const validateSubmission = (expectedText: string): CheatDetectionResult => {
    const result = antiCheat.detectCheat(expectedText)

    detectionResult.value = result

    if (result.isCheating) {
      isCheatingDetected.value = true

      if (result.riskScore >= 80) {
        // 严重：显示警告并阻止提交
        showWarning.value = true
        console.error('[AntiCheat] 检测到严重作弊行为:', result.reasons)
      } else if (result.riskScore >= 60) {
        // 中等：警告但允许提交
        console.warn('[AntiCheat] 检测到可疑行为:', result.reasons)
      }
    }

    return result
  }

  // 获取统计数据
  const getStats = () => {
    return antiCheat.getStats()
  }

  // 重置
  const reset = () => {
    antiCheat.reset()
    isCheatingDetected.value = false
    detectionResult.value = null
    showWarning.value = false
  }

  // 手动绑定事件（在组件中调用）
  const bindEvents = () => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('input', handleInput)
    document.addEventListener('paste', handlePaste, true)
  }

  const unbindEvents = () => {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('input', handleInput)
    document.removeEventListener('paste', handlePaste, true)
  }

  return {
    isCheatingDetected,
    detectionResult,
    showWarning,
    validateSubmission,
    getStats,
    reset,
    bindEvents,
    unbindEvents
  }
}
