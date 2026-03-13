# 🛡️ Vortex Keyboard - 反作弊系统

## 📋 概述

Vortex Keyboard 反作弊系统通过多层检测机制，有效防止自动化脚本刷关行为，确保成绩的真实性和公平性。

---

## 🎯 防护目标

**防止以下作弊行为：**
- ⚠️ 自动化脚本输入（Selenium、Puppeteer 等）
- ⚠️ 键盘事件模拟（document.dispatchEvent）
- ⚠️ 直接修改输入框值
- ⚠️ 粘贴复制文本
- ⚠️ 浏览器自动化工具

---

## 🔧 技术实现

### 1. 输入行为检测 (`src/utils/antiCheat.ts`)

**核心检测指标：**

```typescript
// 按键间隔分析
{
  key: string,           // 按键
  delta: number,         // 与上一个按键的时间间隔（ms）
  timestamp: number      // 时间戳
}
```

**检测规则：**

| 检测项 | 阈值 | 说明 |
|--------|------|------|
| 输入速度 | > 30 字/秒 | 超过人类极限 |
| 按键间隔标准差 | < 5ms | 过于均匀（机器特征） |
| 平均按键间隔 | < 50ms | 过快 |
| 错误率 | < 1% | 过于完美（长文本） |
| 退格使用率 | < 1% | 几乎不纠正错误 |

**风险评分：**
- `riskScore >= 80`: 严重作弊 → 封禁
- `riskScore >= 60`: 可疑行为 → 要求验证
- `riskScore >= 40`: 轻微异常 → 记录日志

---

### 2. Vue 集成 (`src/composables/useAntiCheat.ts`)

**使用方法：**

```typescript
import { useAntiCheat } from '@/composables/useAntiCheat'

const {
  validateSubmission,  // 提交时验证
  getStats,           // 获取统计数据
  reset               // 重置
} = useAntiCheat()

// 关卡完成时验证
function completeLevel() {
  const result = validateSubmission(targetText.value)
  
  if (result.isCheating) {
    console.warn('检测到作弊:', result.reasons)
    // 显示警告或阻止提交
  }
}
```

---

### 3. 游戏界面集成 (`src/components/GameBoard.vue`)

**自动监听：**
- ✅ 键盘按键事件（keydown）
- ✅ 输入变化事件（input）
- ✅ 粘贴事件（paste，自动阻止）

**完成关卡时：**
```typescript
const detectionResult = validateSubmission(targetText.value)
const antiCheatStats = getStats()

if (detectionResult.isCheating) {
  // 显示警告弹窗
  // 标记成绩为"待验证"
}
```

---

### 4. 警告提示组件 (`src/components/AntiCheatWarning.vue`)

**显示内容：**
- 🔴 检测到的问题列表
- 📊 输入统计（平均间隔、标准差、速度）
- ⚠️ 风险评分
- 💡 改进建议

**用户选项：**
- **继续提交** - 成绩标记为"待验证"
- **重新挑战** - 重置并重新开始

---

## 📊 检测示例

### 正常人类输入
```json
{
  "avgDelta": 150.5,      // 平均间隔 150ms
  "stdDev": 45.2,         // 标准差 45ms（自然波动）
  "errors": 3,            // 3 次错误
  "backspaces": 2,        // 2 次退格
  "riskScore": 15         // 低风险
}
```

### 机器脚本输入
```json
{
  "avgDelta": 35.0,       // 平均间隔 35ms（过快）
  "stdDev": 2.1,          // 标准差 2ms（过于均匀）
  "errors": 0,            // 0 错误（完美）
  "backspaces": 0,        // 0 退格（可疑）
  "riskScore": 85,        // 高风险
  "reasons": [
    "输入速度异常：28.5 字/秒",
    "按键间隔过于均匀（标准差：2.1ms）",
    "错误率异常低（几乎完美）",
    "几乎没有使用退格键"
  ]
}
```

---

## 🎮 用户体验

### 正常用户
- ✅ 无感知运行
- ✅ 不影响游戏流程
- ✅ 成绩正常提交

### 可疑行为
- ⚠️ 显示友好提示
- ⚠️ 解释检测原因
- ⚠️ 提供重新挑战选项

### 确认作弊
- ❌ 成绩标记为"待验证"
- ❌ 不计入排行榜
- ❌ 多次作弊限制挑战

---

## 🔧 配置选项

### 阈值调整 (`src/utils/antiCheat.ts`)

```typescript
// 调整检测阈值
const THRESHOLDS = {
  MAX_CHARS_PER_SECOND: 30,      // 最大字/秒
  MIN_STD_DEV: 5,                // 最小标准差（ms）
  MIN_AVG_DELTA: 50,             // 最小平均间隔（ms）
  MAX_ERROR_RATE: 0.01,          // 最大错误率
  MAX_BACKSPACE_RATE: 0.01,      // 最大退格率
  HIGH_RISK_SCORE: 80,           // 高风险阈值
  MEDIUM_RISK_SCORE: 60,         // 中风险阈值
}
```

### 启用/禁用

```typescript
// 开发模式下可禁用
const ENABLE_ANTI_CHEAT = import.meta.env.PROD
```

---

## 📈 数据统计

**每次挑战的统计数据：**

```typescript
interface InputStats {
  sessionId: string      // 会话 ID
  totalKeys: number      // 总按键数
  duration: number       // 总耗时（ms）
  errors: number         // 错误次数
  backspaces: number     // 退格次数
  avgDelta: number       // 平均间隔（ms）
  stdDev: number         // 标准差（ms）
  minDelta: number       // 最小间隔（ms）
  maxDelta: number       // 最大间隔（ms）
  keyTimings: Array<>    // 详细按键时间
}
```

---

## 🚀 未来增强

### Phase 2（计划中）
- [ ] 设备指纹识别
- [ ] 无头浏览器检测
- [ ] IP 地址风险评估

### Phase 3（长期）
- [ ] 机器学习模型（训练识别机器人）
- [ ] 挑战 - 响应机制（人机验证）
- [ ] 黑名单共享系统

---

## 📝 开发者指南

### 添加新的检测规则

```typescript
// src/utils/antiCheat.ts

private detectNewPattern(): void {
  // 实现检测逻辑
  if (this.isSuspicious()) {
    console.warn('[AntiCheat] 检测到新模式的作弊')
  }
}
```

### 自定义警告文案

```vue
<!-- src/components/AntiCheatWarning.vue -->
<p class="warning-message">
  自定义警告文案...
</p>
```

---

## 🐛 故障排查

### 误判处理

如果正常用户被误判：

1. **检查输入统计**
   ```typescript
   const stats = getStats()
   console.log(stats)
   ```

2. **调整阈值**
   - 提高 `MIN_STD_DEV` 阈值
   - 降低 `MAX_CHARS_PER_SECOND` 阈值

3. **添加白名单**
   ```typescript
   if (user.isTrusted) {
     return // 跳过检测
   }
   ```

### 调试模式

```typescript
// 启用调试日志
const DEBUG_MODE = true

if (DEBUG_MODE) {
  console.log('[AntiCheat] 按键统计:', this.keyTimings)
}
```

---

## 📄 相关文件

| 文件 | 说明 |
|------|------|
| `src/utils/antiCheat.ts` | 核心检测逻辑 |
| `src/composables/useAntiCheat.ts` | Vue 集成 |
| `src/components/GameBoard.vue` | 游戏界面集成 |
| `src/components/AntiCheatWarning.vue` | 警告提示组件 |

---

## 🎯 总结

Vortex Keyboard 反作弊系统通过**输入行为分析**有效识别自动化脚本，同时保持**用户友好**的体验。系统会在后台静默运行，只在检测到可疑行为时才显示提示。

**核心理念：** 宁可误判，不可漏判；友好提示，而非严厉惩罚。

---

*版本：v1.0*  
*更新时间：2026-03-13*  
*作者：小杜同学*
