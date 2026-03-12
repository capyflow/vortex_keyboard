# 🎵 关卡音乐与背景系统

> v0.4.0 新增功能 - 每个关卡都是独特的视听体验

---

## 🎹 音乐系统

### 程序化音乐生成

使用 **Web Audio API** 实时生成每个关卡的专属音乐，无需音频文件！

#### 音乐元素
```typescript
{
  bpm: 60-210,           // 关卡速度（难度越高越快）
  theme: string,         // 主题名称
  oscillatorType:        // 音色选择
    - triangle (轻松)
    - square (电子)
    - sawtooth (激烈)
    - sine (柔和)
  chordProgression:      // 和弦进行
    - I-V-vi-IV (经典)
    - 变体 (根据主题)
}
```

### BPM 分布

| 难度 | 关卡 | BPM 范围 | 音乐风格 |
|-----|------|---------|---------|
| 🌱 简单 | 1-8 | 60-95 | 轻松钢琴、吉他、长笛 |
| 🌿 中等 | 9-16 | 100-135 | 电子乐、摇滚、爵士 |
| 🌳 困难 | 17-24 | 140-175 | 金属乐、电子舞曲、交响乐 |
| 👑 专家 | 25-30 | 180-210 | 史诗级、黑暗电子、融合音乐 |

### 主题音色映射

```typescript
switch (theme) {
  case '清晨花园' / '阳光海滩':
    oscillatorType = 'triangle' // 柔和三角波
    frequency = 400Hz
    break
  case '都市夜景' / '未来城市':
    oscillatorType = 'square'   // 电子方波
    frequency = 150Hz
    break
  case '火焰山谷' / '极速赛道':
    oscillatorType = 'sawtooth' // 激烈锯齿波
    frequency = 100Hz
    break
}
```

---

## 🎨 动态背景系统

### 渐变背景

每个关卡有专属的渐变色方案：

```typescript
colors: [string, string] | [string, string, string, string]
```

#### 示例配色

| 关卡 | 主题 | 配色 |
|-----|------|------|
| 1 | 清晨花园 | `#667eea` → `#764ba2` (紫罗兰) |
| 2 | 阳光海滩 | `#4facfe` → `#00f2fe` (海洋蓝) |
| 3 | 春日草原 | `#43e97b` → `#38f9d7` (薄荷绿) |
| 18 | 矩阵空间 | `#000000` → `#00ff00` (黑客绿) |
| 30 | 神之领域 | 四色渐变 `#f12711` → `#f5af19` → `#667eea` → `#764ba2` |

### 粒子效果

```vue
<DynamicBackground
  :colors="level.colors"
  :bpm="level.bpm"
  :theme="level.theme"
  :show-bpm="isPlaying"
/>
```

#### 效果层
1. **渐变层** - 主背景色
2. **粒子层** - 30 个漂浮粒子
3. **主题装饰层** - 20 个主题元素
4. **BPM 指示器** - 右上角显示当前 BPM

### 动画系统

```css
/* 粒子漂浮 */
@keyframes float-up {
  from { transform: translateY(0); opacity: 0; }
  50% { opacity: 1; }
  to { transform: translateY(-100vh); opacity: 0; }
}

/* 主题元素浮动 */
@keyframes float-around {
  0%, 100% { transform: translate(0, 0) rotate(var(--rotation)); }
  50% { transform: translate(20px, -20px) rotate(calc(var(--rotation) + 180deg)); }
}

/* BPM 脉动 */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}
```

---

## 🎼 30 关卡完整配置

### 🌱 简单难度 (60-95 BPM)

| ID | 名称 | BPM | 主题 | 配色 | 音乐风格 |
|---|------|-----|------|------|---------|
| 1 | 热身运动 | 60 | 清晨花园 | 紫罗兰 | 轻松钢琴 |
| 2 | 基础单词 | 65 | 阳光海滩 | 海洋蓝 | 轻快吉他 |
| 3 | 短句练习 | 70 | 春日草原 | 薄荷绿 | 欢快长笛 |
| 4 | 每日问候 | 75 | 温馨小屋 | 粉红黄 | 温暖弦乐 |
| 5 | 数字练习 | 80 | 星空夜景 | 粉蓝渐变 | 梦幻合成器 |
| 6 | 颜色世界 | 85 | 彩虹天空 | 粉红渐变 | 明亮钢琴 |
| 7 | 动物乐园 | 90 | 热带雨林 | 蓝紫渐变 | 活泼木琴 |
| 8 | 食物时光 | 95 | 甜品世界 | 玫红渐变 | 甜美音乐盒 |

### 🌿 中等难度 (100-135 BPM)

| ID | 名称 | BPM | 主题 | 音乐风格 |
|---|------|-----|------|---------|
| 9 | 中级挑战 | 100 | 都市夜景 | 动感电子乐 |
| 10 | 速度提升 | 105 | 高速公路 | 快节奏摇滚 |
| 11 | 长句练习 | 110 | 代码空间 | 科技感电子 |
| 12 | 名言警句 | 115 | 晨曦山峰 | 激昂交响乐 |
| 13 | 科技世界 | 120 | 未来城市 | 赛博朋克风 |
| 14 | 旅行日记 | 125 | 欧洲小镇 | 法式手风琴 |
| 15 | 天气预报 | 130 | 雨后彩虹 | 清新自然音 |
| 16 | 运动健康 | 135 | 健身房 | 活力健身音乐 |

### 🌳 困难难度 (140-175 BPM)

| ID | 名称 | BPM | 主题 | 音乐风格 |
|---|------|-----|------|---------|
| 17 | 高级挑战 | 140 | 火焰山谷 | 激烈金属乐 |
| 18 | 代码片段 | 145 | 矩阵空间 | 数字电子乐 |
| 19 | 极速模式 | 150 | 极速赛道 | 高速电子舞曲 |
| 20 | 商业邮件 | 155 | 摩天大楼 | 商务爵士乐 |
| 21 | 学术论文 | 160 | 图书馆 | 古典钢琴 |
| 22 | 法律条文 | 165 | 法庭 | 庄严管风琴 |
| 23 | 诗歌韵律 | 170 | 月光海岸 | 诗意小提琴 |
| 24 | 新闻播报 | 175 | 新闻演播室 | 紧张新闻配乐 |

### 👑 专家难度 (180-210 BPM)

| ID | 名称 | BPM | 主题 | 音乐风格 |
|---|------|-----|------|---------|
| 25 | 专家考验 | 180 | 混沌空间 | 迷幻电子 |
| 26 | 医学报告 | 185 | 手术室 | 紧张氛围音 |
| 27 | 哲学思考 | 190 | 星空深处 | 深邃 ambient |
| 28 | 复杂代码 | 195 | 黑客帝国 | 黑暗电子 |
| 29 | 多国混排 | 200 | 世界地球 | 世界音乐融合 |
| 30 | 终极挑战 | 210 | 神之领域 | 史诗级交响电子 |

---

## 🎮 游戏体验提升

### 视听联动

1. **BPM 同步**
   - 背景粒子速度 = 60/BPM 秒
   - BPM 指示器随节拍脉动
   - 音乐节奏与游戏速度匹配

2. **难度感知**
   - 简单关卡：柔和色彩 + 慢节奏
   - 专家关卡：强烈对比 + 快节奏
   - 玩家通过视听直观感受难度

3. **沉浸感**
   - 每个关卡独特主题
   - 程序化音乐永不重复
   - 动态背景持续变化

---

## 🔧 技术实现

### 文件结构

```
src/
├── components/
│   └── DynamicBackground.vue  # 动态背景组件
├── composables/
│   └── useMusic.ts            # 音乐管理 Hook
├── data/
│   └── levels.ts              # 关卡配置（新增 bpm/theme/colors/music）
├── utils/
│   └── music.ts               # 音乐管理器（Web Audio API）
└── App.vue                    # 集成背景和音乐
```

### 核心代码

#### 音乐管理器
```typescript
class MusicManager {
  private audioContext: AudioContext
  
  playLevelMusic(bpm: number, theme: string) {
    this.createRhythm(theme, startTime, beatInterval)
    this.createChordProgression(bpm, theme, startTime)
  }
  
  private createRhythm(theme: string, startTime: number, interval: number) {
    // 根据主题选择音色，创建节奏循环
  }
  
  private createChordProgression(bpm: number, theme: string, startTime: number) {
    // 创建和弦进行，每和弦持续 4 拍
  }
}
```

#### 动态背景
```vue
<template>
  <div class="dynamic-background">
    <div class="gradient-layer" :style="gradientStyle"></div>
    <div class="particles-layer">
      <span v-for="i in 30" :key="i" class="particle"></span>
    </div>
    <div class="bpm-indicator" v-if="showBpm">
      {{ bpm }} BPM
    </div>
  </div>
</template>
```

---

## 🎯 性能优化

### 音频优化
- ✅ 使用 AudioContext 实时合成（无网络请求）
- ✅ 自动清理旧上下文（防止内存泄漏）
- ✅ 音量平滑过渡（避免爆音）

### 渲染优化
- ✅ CSS 动画（GPU 加速）
- ✅ 粒子数量限制（30 个）
- ✅ 响应式断点（移动端减少元素）

### 内存管理
```typescript
onUnmounted(() => {
  music.stopLevel() // 清理 AudioContext
})
```

---

## 🎹 未来扩展

### 音乐增强
- [ ] 真实音频文件（高品质）
- [ ] 多层音轨混合
- [ ] 连击触发特殊音效
- [ ] 完成关卡的庆祝音乐变奏

### 背景增强
- [ ] 更多粒子效果类型
- [ ] 主题专属动画（动物/代码/新闻等）
- [ ] 成就解锁特殊背景
- [ ] 玩家自定义背景上传

### 互动增强
- [ ] 音乐节奏与打字判定同步
- [ ] 背景随游戏状态变化（连击/错误）
- [ ] 主题道具收集系统

---

*让每个关卡都成为独特的视听之旅！* 🎵🎨
