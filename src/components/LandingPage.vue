<template>
  <div class="landing-page">
    <!-- 动态背景 -->
    <div class="hero-background">
      <div class="gradient-layer"></div>
      <div class="gradient-overlay"></div>
      <div class="particles-layer">
        <span v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></span>
      </div>
      <div class="grid-layer"></div>
    </div>

    <!-- 主内容区 -->
    <div class="hero-content">
      <!-- Logo 和标题 -->
      <div class="hero-header">
        <div class="logo-container">
          <div class="logo-icon">🎹</div>
          <div class="logo-ring"></div>
          <div class="logo-ring ring-outer"></div>
        </div>
        
        <h1 class="title">
          <span class="title-main">Vortex Keyboard</span>
          <span class="title-sub">漩涡键盘</span>
        </h1>
        
        <p class="tagline">让每一次敲击都成为节奏的狂欢</p>
      </div>

      <!-- 开始游戏按钮 -->
      <div class="cta-section">
        <button @click="handleStart" class="start-btn">
          <span class="btn-text">开始游戏</span>
          <span class="btn-icon">→</span>
          <div class="btn-glow"></div>
          <div class="btn-shine"></div>
        </button>
        
        <div class="btn-hints">
          <span class="hint">🎮 30 个精心设计的关卡</span>
          <span class="hint">🏆 22 个成就等你解锁</span>
          <span class="hint">🎵 每关独特音乐和背景</span>
        </div>
      </div>

      <!-- 特性展示 -->
      <div class="features-section">
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>节奏加速</h3>
          <p>连续正确输入会加速，保持连击挑战极限</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>精美视觉</h3>
          <p>30 个关卡专属背景和动态效果</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎵</div>
          <h3>动态音乐</h3>
          <p>每关独特 BPM 和主题音乐</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🏅</div>
          <h3>成就系统</h3>
          <p>22 个成就记录你的成长轨迹</p>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-value">30</div>
          <div class="stat-label">关卡</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">22</div>
          <div class="stat-label">成就</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">60-210</div>
          <div class="stat-label">BPM 范围</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">🎹</div>
          <div class="stat-label">打字音游</div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="hero-footer">
      <div class="footer-text">
        <span>💡 提示：连续正确输入会加速，错误会减速</span>
      </div>
      <div class="footer-links">
        <a href="https://github.com/capyflow/vortex_keyboard" target="_blank" class="footer-link">
          <span>GitHub</span>
          <span class="link-icon">↗</span>
        </a>
        <span class="footer-divider">•</span>
        <span class="footer-version">v0.5.0</span>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div class="scroll-hint">
      <div class="scroll-arrow"></div>
      <span>了解更多</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  start: []
}>()

function handleStart() {
  emit('start')
}

function getParticleStyle(_index: number) {
  const delay = Math.random() * 10
  const duration = 15 + Math.random() * 10
  const left = Math.random() * 100
  const size = 2 + Math.random() * 4
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--left': `${left}%`,
    '--size': `${size}px`,
  } as any
}
</script>

<style scoped>
.landing-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 英雄背景 */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.gradient-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c, #667eea);
  background-size: 400% 400%;
  animation: gradient-flow 15s ease infinite;
  opacity: 0.8;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(-45deg, #4facfe, #00f2fe, #43e97b, #667eea, #4facfe);
  background-size: 400% 400%;
  animation: gradient-flow 20s ease infinite reverse;
  opacity: 0.3;
  mix-blend-mode: overlay;
}

@keyframes gradient-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.particles-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  left: var(--left);
  bottom: -10px;
  animation: float-up var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  filter: blur(1px);
}

/* 添加光晕效果 */
.hero-background::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: glow-pulse 10s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glow-pulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
}

.grid-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 100px 100px;
  animation: grid-move 30s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes grid-move {
  0%, 100% { 
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% { 
    transform: translateY(50px) scale(1.05);
    opacity: 0.3;
  }
}

/* 主内容区 */
.hero-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: white;
}

/* Logo 和标题 */
.hero-header {
  margin-bottom: 3rem;
}

.logo-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.logo-icon {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  z-index: 2;
  animation: logo-float 3s ease-in-out infinite;
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.logo-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: ring-pulse 2s ease-in-out infinite;
}

.ring-outer {
  width: 140%;
  height: 140%;
  border-color: rgba(255, 255, 255, 0.15);
  animation-delay: 0.5s;
}

@keyframes ring-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.5;
  }
}

.title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.title-main {
  font-size: 3.5rem;
  font-weight: 900;
  font-family: 'Fredoka One', cursive;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  background: linear-gradient(135deg, #fff 0%, #FFE66D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-sub {
  font-size: 1.5rem;
  font-weight: 700;
  opacity: 0.9;
  letter-spacing: 8px;
}

.tagline {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  font-weight: 300;
}

/* 开始游戏按钮 */
.cta-section {
  margin-bottom: 4rem;
}

.start-btn {
  position: relative;
  padding: 1.25rem 4rem;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Fredoka One', cursive;
  color: white;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8B94 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 40px rgba(255, 107, 107, 0.4);
  z-index: 1;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 50px rgba(255, 107, 107, 0.6);
}

.start-btn:active {
  transform: translateY(-1px);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-icon {
  margin-left: 0.5rem;
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.start-btn:hover .btn-icon {
  transform: translateX(5px);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: glow 3s infinite;
}

@keyframes glow {
  0% { left: -100%; }
  100% { left: 100%; }
}

.btn-shine {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.start-btn:hover .btn-shine {
  width: 300px;
  height: 300px;
}

.btn-hints {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.hint {
  font-size: 0.875rem;
  opacity: 0.8;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

/* 特性展示 */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  width: 100%;
  margin-bottom: 3rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.3);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.875rem;
  opacity: 0.8;
  line-height: 1.5;
}

/* 统计信息 */
.stats-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 1.5rem 3rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Fredoka One', cursive;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

/* 底部信息 */
.hero-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  color: white;
  opacity: 0.8;
  font-size: 0.875rem;
}

.footer-text {
  font-style: italic;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: white;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.footer-link:hover {
  opacity: 1;
}

.link-icon {
  font-size: 0.75rem;
}

.footer-divider {
  opacity: 0.5;
}

.footer-version {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* 滚动提示 */
.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
  opacity: 0.7;
  font-size: 0.75rem;
  animation: bounce 2s infinite;
}

.scroll-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title-main {
    font-size: 2.5rem;
  }
  
  .title-sub {
    font-size: 1.25rem;
    letter-spacing: 4px;
  }
  
  .start-btn {
    padding: 1rem 2.5rem;
    font-size: 1.25rem;
  }
  
  .btn-hints {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .features-section {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .stats-section {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }
  
  .stat-divider {
    display: none;
  }
  
  .hero-footer {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .logo-container {
    width: 100px;
    height: 100px;
  }
  
  .logo-icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .title-main {
    font-size: 2rem;
  }
  
  .tagline {
    font-size: 1rem;
  }
  
  .feature-card {
    padding: 1rem;
  }
  
  .feature-icon {
    font-size: 2rem;
  }
}
</style>
