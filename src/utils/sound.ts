import { ref } from 'vue'

export interface SoundConfig {
  enabled: boolean
  volume: number
  musicEnabled: boolean
  musicVolume: number
}

class SoundManager {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private bgmGain: GainNode | null = null
  private bgmTimer: number | null = null
  private isBgmPlaying = false

  config = ref<SoundConfig>({
    enabled: true,
    volume: 0.5,
    musicEnabled: false,
    musicVolume: 0.3,
  })

  private ensureAudioContext(): AudioContext | null {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = this.config.value.enabled ? this.config.value.volume : 0
      this.masterGain.connect(this.audioContext.destination)

      this.bgmGain = this.audioContext.createGain()
      this.bgmGain.gain.value = this.config.value.musicVolume
      this.bgmGain.connect(this.masterGain)
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    return this.audioContext
  }

  private connectToMaster(node: AudioNode) {
    if (this.masterGain) {
      node.connect(this.masterGain)
    }
  }

  playKey() {
    if (!this.config.value.enabled) return
    const ctx = this.ensureAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    osc.connect(gain)
    this.connectToMaster(gain)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  }

  playError() {
    if (!this.config.value.enabled) return
    const ctx = this.ensureAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2)

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    osc.connect(gain)
    this.connectToMaster(gain)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  }

  playCombo(combo: number) {
    if (!this.config.value.enabled) return

    if (combo % 5 !== 0 || combo <= 0) return
    const level = Math.min(Math.floor(combo / 5), 5)

    const ctx = this.ensureAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = 400 + (level * 100)

    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)

    osc.connect(gain)
    this.connectToMaster(gain)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  }

  playComplete() {
    if (!this.config.value.enabled) return
    const ctx = this.ensureAudioContext()
    if (!ctx) return

    const frequencies = [523.25, 659.25, 783.99, 1046.5]

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      const start = ctx.currentTime + i * 0.1
      gain.gain.setValueAtTime(0.2, start)
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.5)

      osc.connect(gain)
      this.connectToMaster(gain)

      osc.start(start)
      osc.stop(start + 0.6)
    })
  }

  private scheduleBgm() {
    if (!this.isBgmPlaying) return
    const ctx = this.ensureAudioContext()
    if (!ctx || !this.bgmGain) return

    const notes = [261.63, 329.63, 392.0, 523.25]
    const start = ctx.currentTime

    notes.forEach((freq) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      gain.gain.setValueAtTime(0.1, start)
      gain.gain.linearRampToValueAtTime(0.01, start + 2)

      osc.connect(gain)
      if (this.bgmGain) {
        gain.connect(this.bgmGain)
      }

      osc.start(start)
      osc.stop(start + 2)
    })

    this.bgmTimer = window.setTimeout(() => this.scheduleBgm(), 2000)
  }

  playBGM() {
    if (!this.config.value.musicEnabled || this.isBgmPlaying) return
    this.isBgmPlaying = true
    this.scheduleBgm()
  }

  stopBGM() {
    this.isBgmPlaying = false
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer)
      this.bgmTimer = null
    }
  }

  setEnabled(enabled: boolean) {
    this.config.value.enabled = enabled
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(
        enabled ? this.config.value.volume : 0,
        this.audioContext.currentTime
      )
    }

    if (!enabled) {
      this.stopBGM()
    }
  }

  isEnabled(): boolean {
    return this.config.value.enabled
  }

  setVolume(volume: number) {
    this.config.value.volume = volume
    if (this.masterGain && this.audioContext && this.config.value.enabled) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime)
    }
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
    if (this.bgmGain && this.audioContext) {
      this.bgmGain.gain.setValueAtTime(volume, this.audioContext.currentTime)
    }
  }
}

export const soundManager = new SoundManager()
