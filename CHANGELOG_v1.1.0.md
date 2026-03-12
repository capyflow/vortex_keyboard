# Vortex Keyboard 修改日志

## v1.1.0 (2026-03-12)

### 修复
- **音效默认开启**：修复音效设置加载时，如果没有 `enabled` 字段默认为 `true`
- **设置持久化**：清除浏览器缓存后音效默认开启

---

## v1.0.0 (2026-03-12)

### 重大修复
- **移除重复事件监听**：移除输入框上的 `@keydown` 事件监听，只保留 `window.addEventListener`
- **修复重复震动问题**：桌面端每按一个键，`handleKeydown` 不再执行两次

### 技术说明
- 关卡代码是统一的 `GameBoard.vue`，所有关卡共用
- 不同关卡通过 `levelId` prop 传入
- 关卡数据在 `data/levels.ts` 中定义

---

## v0.9.0 (2026-03-12)

### 修复
- **输入防重复**：添加 `isProcessingInput` 标志，防止 `handleInput` 和 `handleKeydown` 同时触发
- **音乐循环播放**：和弦进行从单次播放改为递归调度，无限循环

### 技术细节
```typescript
// 之前：只播放一次
progression?.forEach((chord, index) => { ... })

// 现在：循环播放
const scheduleChord = (time: number, chordIndex: number) => {
  // 播放和弦...
  scheduleChord(time + chordDuration, chordIndex + 1)  // 无限循环
}
```

---

## v0.8.0 (2026-03-12)

### 修复
- **错误输入震动**：恢复错误输入时的震动和粒子效果
- **正确输入不震动**：修复之前正确输入也震动的问题

### 行为对比
| 输入类型 | v0.7.0 | v0.8.0 |
|----------|--------|--------|
| 正确输入 | ❌ 震动 | ✅ 不震动 |
| 错误输入 | ❌ 不震动 | ✅ 震动 |

---

## v0.7.0 (2026-03-12)

### 修复
- **错误记录统计**：恢复 `gameStore.handleWrongInput()` 调用，记录错误统计
- **音乐默认开启**：`enabled` 默认值从 `false` 改为 `true`
- **startGame 重新加载设置**：确保音乐设置生效

---

## v0.6.0 (2026-03-12)

### 修复
- **桌面端错误输入**：错误输入不再触发震动（只停止不前进）
- **音效开关同步**：`useSound.config` 和 `soundManager.config` 同步更新

---

## v0.5.0 (2026-03-12)

### 修复
- **音效开关同步问题**：`toggleSound()` 同步更新 `soundManager.config.value.enabled`
- **输入重复抖动**：`handleInput` 仅移动端处理，桌面端只同步值

### 核心问题
```typescript
// useSound.ts - 修复前
function toggleSound() {
  config.value.enabled = !config.value.enabled
  soundManager.setEnabled(config.value.enabled)  // ← soundManager.config 没更新！
}

// 修复后
function toggleSound() {
  config.value.enabled = !config.value.enabled
  soundManager.config.value.enabled = config.value.enabled  // ← 同步更新
  soundManager.setEnabled(config.value.enabled)
}
```

---

## v0.4.0 (2026-03-12)

### 新增
- **设置全局保存**：新增 `settings.ts` store，统一管理字体大小/主题/音效等设置
- **移动端输入优化**：修复隐藏输入框聚焦时页面滚动到顶部的问题
- **进度统计**：修复移动端键盘输入时进度不统计的问题

### 新增文件
- `src/stores/settings.ts` - 全局设置 Store

### 修改文件
- `src/App.vue` - 初始化加载 settings store
- `src/components/SettingsModal.vue` - 使用 settings store 保存字体大小
- `src/components/GameBoard.vue` - 修复移动端输入逻辑和样式

---

## 技术总结

### 核心架构
```
src/
├── components/
│   ├── GameBoard.vue        # 统一游戏逻辑（所有关卡共用）
│   ├── SettingsModal.vue    # 设置面板
│   └── LandingPage.vue      # 首页
├── composables/
│   ├── useSound.ts          # 音效管理 Hook
│   └── useMusic.ts          # 音乐管理 Hook
├── stores/
│   ├── game.ts              # 游戏状态 Store
│   ├── user.ts              # 用户数据 Store
│   └── settings.ts          # 设置 Store
├── utils/
│   ├── sound.ts             # 音效管理器 (Web Audio API)
│   └── music.ts             # 音乐管理器 (Web Audio API)
└── data/
    └── levels.ts            # 30 个关卡配置
```

### 关键修复点

1. **事件监听重复**
   - 问题：`@keydown` 和 `window.addEventListener` 同时注册
   - 解决：只保留 `window.addEventListener`

2. **状态同步**
   - 问题：`useSound.config` 和 `soundManager.config` 不同步
   - 解决：`toggleSound()` 同时更新两个配置

3. **移动端输入**
   - 问题：`handleInput` 和 `handleKeydown` 同时触发
   - 解决：添加 `isProcessingInput` 标志防重复

4. **音乐循环**
   - 问题：和弦进行只播放一次
   - 解决：递归调度实现无限循环

---

## 部署路径
`/home/aaron/deploy/vortex_keyboard/`

## GitHub
https://github.com/capyflow/vortex_keyboard
