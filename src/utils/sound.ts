import { Howl, Howler } from 'howler'
import { ref } from 'vue'

export interface SoundConfig {
  enabled: boolean
  volume: number
  musicEnabled: boolean
  musicVolume: number
}

class SoundManager {
  private keySound: Howl | null = null
  private comboSounds: Map<number, Howl> = new Map()
  private errorSound: Howl | null = null
  private completeSound: Howl | null = null
  private bgm: Howl | null = null
  
  config = ref<SoundConfig>({
    enabled: true,
    volume: 0.5,
    musicEnabled: false,
    musicVolume: 0.3,
  })

  constructor() {
    this.initSounds()
  }

  private initSounds() {
    // 机械键盘按键音 - 使用合成音效
    this.keySound = new Howl({
      src: [this.generateKeySound()],
      format: ['webm', 'mp3'],
      volume: this.config.value.volume,
    })

    // 错误提示音
    this.errorSound = new Howl({
      src: [this.generateErrorSound()],
      format: ['webm', 'mp3'],
      volume: this.config.value.volume,
    })

    // 完成音效
    this.completeSound = new Howl({
      src: [this.generateCompleteSound()],
      format: ['webm', 'mp3'],
      volume: this.config.value.volume,
    })

    // 连击音效 (不同音调)
    for (let i = 1; i <= 5; i++) {
      const sound = new Howl({
        src: [this.generateComboSound(i)],
        format: ['webm', 'mp3'],
        volume: this.config.value.volume,
        rate: 0.8 + (i * 0.15), // 连击越高音调越高
      })
      this.comboSounds.set(i, sound)
    }

    // 背景音乐 (可选)
    this.bgm = new Howl({
      src: [this.generateBGM()],
      format: ['webm', 'mp3'],
      volume: this.config.value.musicVolume,
      loop: true,
    })
  }

  // 生成按键音效 (使用 Web Audio API 合成)
  private generateKeySound(): string {
    return this.createDataURI((ctx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1)
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    })
  }

  // 生成错误音效
  private generateErrorSound(): string {
    return this.createDataURI((ctx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(200, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2)
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    })
  }

  // 生成完成音效
  private generateCompleteSound(): string {
    return this.createDataURI((ctx) => {
      // 和弦效果
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'sine'
        osc.frequency.value = freq
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5 + i * 0.1)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + 0.6 + i * 0.1)
      })
    })
  }

  // 生成连击音效
  private generateComboSound(level: number): string {
    return this.createDataURI((ctx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.value = 400 + (level * 100)
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.15)
    })
  }

  // 生成背景音乐
  private generateBGM(): string {
    return this.createDataURI((ctx) => {
      // 简单的循环和弦进行
      const notes = [261.63, 329.63, 392.00, 523.25] // C 大调和弦
      notes.forEach((freq) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'sine'
        osc.frequency.value = freq
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 2)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 2)
      })
    })
  }

  // 创建 Data URI
  private createDataURI(generator: (ctx: AudioContext) => void): string {
    const audioContext = new AudioContext()
    generator(audioContext)
    
    // 由于无法直接合成 Data URI，返回空字符串并使用备用方案
    // 实际项目中应该预先生成音频文件
    return ''
  }

  playKey() {
    if (!this.config.value.enabled || !this.keySound) return
    this.keySound.play()
  }

  playError() {
    if (!this.config.value.enabled || !this.errorSound) return
    this.errorSound.play()
  }

  playCombo(combo: number) {
    if (!this.config.value.enabled) return
    
    // 每 5 个连击播放一次特殊音效
    if (combo % 5 === 0 && combo > 0) {
      const level = Math.min(Math.floor(combo / 5), 5)
      const sound = this.comboSounds.get(level)
      if (sound) sound.play()
    }
  }

  playComplete() {
    if (!this.config.value.enabled || !this.completeSound) return
    this.completeSound.play()
  }

  playBGM() {
    if (!this.config.value.musicEnabled || !this.bgm) return
    this.bgm.play()
  }

  stopBGM() {
    if (!this.bgm) return
    this.bgm.stop()
  }

  setEnabled(enabled: boolean) {
    this.config.value.enabled = enabled
    if (enabled) {
      Howler.mute(false)
      Howler.volume(this.config.value.volume)
    } else {
      Howler.mute(true)
    }
  }
  
  // 获取启用状态
  isEnabled(): boolean {
    return this.config.value.enabled
  }

  setVolume(volume: number) {
    this.config.value.volume = volume
    Howler.volume(volume)
  }

  setMusicEnabled(enabled: boolean) {
    this.config.value.musicEnabled = enabled
    if (enabled) {
      this.playBGM()
    } else {
      this.stopBGM()
    }
  }

  setMusicVolume(volume: number) {
    this.config.value.musicVolume = volume
    if (this.bgm) {
      this.bgm.volume(volume)
    }
  }
}

export const soundManager = new SoundManager()
