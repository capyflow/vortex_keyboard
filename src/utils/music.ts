import { Howl } from 'howler'

export interface MusicTrack {
  bpm: number
  key: string
  genre: string
  sound: Howl | null
}

class MusicManager {
  private audioContext: AudioContext | null = null
  private isPlaying: boolean = false
  private volume: number = 0.3

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  // 根据关卡 BPM 生成动态音乐
  playLevelMusic(bpm: number, theme: string): Promise<void> {
    return new Promise((resolve) => {
      // 停止当前音乐
      this.stopMusic()
      
      // 创建音乐循环
      this.createProceduralMusic(bpm, theme)
      resolve()
    })
  }

  private createProceduralMusic(bpm: number, theme: string) {
    if (!this.audioContext) return

    const now = this.audioContext.currentTime
    const beatInterval = 60 / bpm

    // 创建节奏循环
    this.createRhythm(theme, now, beatInterval)
    
    // 创建和弦进行
    this.createChordProgression(bpm, theme, now)
    
    this.isPlaying = true
  }

  private createRhythm(theme: string, startTime: number, interval: number) {
    if (!this.audioContext) return

    // 根据主题选择音色
    let oscillatorType: OscillatorType = 'sine'
    let frequency = 200

    switch (theme) {
      case '清晨花园':
      case '阳光海滩':
        oscillatorType = 'triangle'
        frequency = 400
        break
      case '都市夜景':
      case '未来城市':
        oscillatorType = 'square'
        frequency = 150
        break
      case '火焰山谷':
      case '极速赛道':
        oscillatorType = 'sawtooth'
        frequency = 100
        break
      default:
        oscillatorType = 'sine'
        frequency = 300
    }

    // 创建节拍器
    const scheduleBeat = (time: number) => {
      if (!this.isPlaying || !this.audioContext) return

      const osc = this.audioContext.createOscillator()
      const gain = this.audioContext.createGain()
      
      osc.type = oscillatorType
      osc.frequency.value = frequency
      
      gain.gain.setValueAtTime(this.volume * 0.5, time)
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
      
      osc.connect(gain)
      gain.connect(this.audioContext.destination)
      
      osc.start(time)
      osc.stop(time + 0.1)

      // 调度下一个节拍
      scheduleBeat(time + interval)
    }

    scheduleBeat(startTime)
  }

  private createChordProgression(bpm: number, theme: string, startTime: number) {
    if (!this.audioContext) return

    // 基础和弦进行 (I-V-vi-IV)
    const chordProgressions: Record<string, number[][]> = {
      '清晨花园': [[261.63, 329.63, 392.00], [392.00, 493.88, 587.33], [261.63, 311.13, 392.00], [349.23, 440.00, 523.25]],
      '都市夜景': [[196.00, 246.94, 293.66], [293.66, 369.99, 440.00], [196.00, 233.08, 293.66], [261.63, 329.63, 392.00]],
      '火焰山谷': [[130.81, 164.81, 196.00], [196.00, 246.94, 293.66], [130.81, 155.56, 196.00], [174.61, 220.00, 261.63]],
      'default': [[261.63, 329.63, 392.00], [392.00, 493.88, 587.33], [261.63, 311.13, 392.00], [349.23, 440.00, 523.25]]
    }

    const progression = chordProgressions[theme] || chordProgressions['default']
    const chordDuration = (60 / bpm) * 4 // 每个和弦持续 4 拍

    // 循环播放和弦进行
    const scheduleChord = (time: number, chordIndex: number) => {
      if (!this.isPlaying || !this.audioContext || !progression) return

      const chord = progression[chordIndex % progression.length]
      if (!chord) return
      
      chord.forEach((freq) => {
        if (!this.audioContext) return
        
        const osc = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()
        
        osc.type = 'sine'
        osc.frequency.value = freq
        
        gain.gain.setValueAtTime(this.volume * 0.3, time)
        gain.gain.exponentialRampToValueAtTime(0.01, time + chordDuration - 0.1)
        
        osc.connect(gain)
        gain.connect(this.audioContext.destination)
        
        osc.start(time)
        osc.stop(time + chordDuration)
      })

      // 调度下一个和弦
      scheduleChord(time + chordDuration, chordIndex + 1)
    }

    scheduleChord(startTime, 0)
  }

  stopMusic() {
    this.isPlaying = false
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }
}

export const musicManager = new MusicManager()
