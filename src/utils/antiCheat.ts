/**
 * Vortex Keyboard - 反作弊系统
 * 防止自动化脚本输入
 */

export interface KeyTiming {
  key: string
  delta: number
  timestamp: number
}

export interface CheatDetectionResult {
  isCheating: boolean
  confidence: number
  reasons: string[]
  riskScore: number
}

export class AntiCheatSystem {
  private keyTimings: KeyTiming[] = []
  private lastKeyTime: number = 0
  private sessionId: string
  private errors: number = 0
  private backspaces: number = 0
  private startTime: number = 0
  private inputText: string = ''

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
  }

  // 生成会话 ID
  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  }

  // 记录按键事件
  recordKey(key: string, timestamp: number = Date.now()): void {
    if (this.lastKeyTime > 0) {
      const delta = timestamp - this.lastKeyTime
      this.keyTimings.push({
        key,
        delta,
        timestamp
      })

      // 检测异常行为
      this.detectSuspiciousBehavior()
    } else {
      // 第一个按键
      this.keyTimings.push({
        key,
        delta: 0,
        timestamp
      })
    }

    this.lastKeyTime = timestamp
  }

  // 记录输入文本
  recordInput(text: string): void {
    // 检测粘贴行为（突然输入大量字符）
    if (text.length > this.inputText.length + 5) {
      const addedLength = text.length - this.inputText.length
      if (this.keyTimings.length < 5) {
        console.warn('[AntiCheat] 检测到可能的粘贴行为:', addedLength, '字符')
      }
    }
    this.inputText = text
  }

  // 记录错误
  recordError(): void {
    this.errors++
  }

  // 记录退格
  recordBackspace(): void {
    this.backspaces++
  }

  // 检测可疑行为
  private detectSuspiciousBehavior(): void {
    if (this.keyTimings.length < 10) return

    const recentDeltas = this.keyTimings.slice(-10).map(k => k.delta)
    const avg = recentDeltas.reduce((a, b) => a + b) / recentDeltas.length
    const variance = recentDeltas.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) / recentDeltas.length
    const stdDev = Math.sqrt(variance)

    // 检测 1: 固定时间间隔（机器行为）
    // 人类打字的标准差通常 > 10ms，机器可能 < 5ms
    if (stdDev < 5 && avg < 100) {
      console.warn('[AntiCheat] 检测到固定间隔输入:', { stdDev, avg })
    }

    // 检测 2: 过快输入速度
    if (avg < 30) {
      console.warn('[AntiCheat] 输入速度异常:', avg, 'ms/键')
    }
  }

  // 计算按键间隔标准差
  private calculateStdDev(values: number[]): number {
    if (values.length === 0) return 0

    const avg = values.reduce((a, b) => a + b) / values.length
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length
    return Math.sqrt(variance)
  }

  // 提交时检测作弊
  detectCheat(expectedText: string): CheatDetectionResult {
    const result: CheatDetectionResult = {
      isCheating: false,
      confidence: 0,
      reasons: [],
      riskScore: 0
    }

    const duration = Date.now() - this.startTime
    const textLength = expectedText.length

    // 1. 检测输入速度
    if (textLength > 0 && duration > 0) {
      const charsPerSecond = textLength / (duration / 1000)

      // 人类极限约 15-20 字符/秒，超过 30 肯定有问题
      if (charsPerSecond > 30) {
        result.isCheating = true
        result.confidence = 0.9
        result.reasons.push(`输入速度异常：${charsPerSecond.toFixed(1)} 字符/秒`)
        result.riskScore += 50
      }
    }

    // 2. 检测按键间隔标准差
    if (this.keyTimings.length > 10) {
      const deltas = this.keyTimings.slice(1).map(k => k.delta)
      const stdDev = this.calculateStdDev(deltas)

      // 机器输入的标准差通常很小
      if (stdDev < 5) {
        result.isCheating = true
        result.confidence = Math.max(result.confidence, 0.8)
        result.reasons.push(`按键间隔过于均匀（标准差：${stdDev.toFixed(2)}ms）`)
        result.riskScore += 40
      }
    }

    // 3. 检测错误率（人类会犯错）
    const errorRate = this.errors / Math.max(textLength, 1)
    if (errorRate < 0.01 && textLength > 100) {
      result.reasons.push('错误率异常低（几乎完美）')
      result.riskScore += 20
    }

    // 4. 检测退格使用（人类会纠正错误）
    const backspaceRate = this.backspaces / Math.max(textLength, 1)
    if (backspaceRate < 0.01 && textLength > 50) {
      result.reasons.push('几乎没有使用退格键')
      result.riskScore += 15
    }

    // 5. 检测平均按键间隔
    if (this.keyTimings.length > 5) {
      const avgDelta = this.keyTimings.slice(1).reduce((sum, k) => sum + k.delta, 0) / (this.keyTimings.length - 1)
      if (avgDelta < 50) {
        result.reasons.push(`平均按键间隔过短：${avgDelta.toFixed(1)}ms`)
        result.riskScore += 30
      }
    }

    // 判定阈值
    if (result.riskScore >= 60) {
      result.isCheating = true
      result.confidence = Math.max(result.confidence, result.riskScore / 100)
    }

    return result
  }

  // 获取输入统计数据
  getStats() {
    const duration = Date.now() - this.startTime
    const deltas = this.keyTimings.slice(1).map(k => k.delta)

    return {
      sessionId: this.sessionId,
      totalKeys: this.keyTimings.length,
      duration,
      errors: this.errors,
      backspaces: this.backspaces,
      avgDelta: deltas.length > 0 ? deltas.reduce((a, b) => a + b) / deltas.length : 0,
      stdDev: this.calculateStdDev(deltas),
      minDelta: deltas.length > 0 ? Math.min(...deltas) : 0,
      maxDelta: deltas.length > 0 ? Math.max(...deltas) : 0,
      keyTimings: this.keyTimings
    }
  }

  // 重置
  reset(): void {
    this.keyTimings = []
    this.lastKeyTime = 0
    this.errors = 0
    this.backspaces = 0
    this.startTime = Date.now()
    this.inputText = ''
    this.sessionId = this.generateSessionId()
  }
}

// 导出单例
export const antiCheat = new AntiCheatSystem()
