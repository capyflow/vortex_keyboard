export interface MusicTrack {
  bpm: number
  key: string
  genre: string
  sound: AudioNode | null
}

class MusicManager {
  private audioContext: AudioContext | null = null
  private isPlaying: boolean = false
  private volume: number = 0.3
  private rhythmTimer: number | null = null
  private chordTimer: number | null = null
  private chordIndex: number = 0

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  private ensureAudioContext(): AudioContext | null {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    return this.audioContext
  }

  // 根据关卡 BPM 生成动态音乐
  playLevelMusic(bpm: number, theme: string): Promise<void> {
    return new Promise((resolve) => {
      this.stopMusic()
      this.ensureAudioContext()
      this.createProceduralMusic(bpm, theme)
      resolve()
    })
  }

  private createProceduralMusic(bpm: number, theme: string) {
    if (!this.audioContext) return

    const beatInterval = 60 / bpm

    this.isPlaying = true
    this.chordIndex = 0

    this.createRhythm(theme, beatInterval)
    this.createChordProgression(bpm, theme)
  }

  private createRhythm(theme: string, interval: number) {
    if (!this.audioContext) return

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

    const scheduleBeat = () => {
      if (!this.isPlaying || !this.audioContext) return

      const osc = this.audioContext.createOscillator()
      const gain = this.audioContext.createGain()

      osc.type = oscillatorType
      osc.frequency.value = frequency

      const now = this.audioContext.currentTime
      gain.gain.setValueAtTime(this.volume * 0.5, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

      osc.connect(gain)
      gain.connect(this.audioContext.destination)

      osc.start(now)
      osc.stop(now + 0.1)

      this.rhythmTimer = window.setTimeout(scheduleBeat, interval * 1000)
    }

    scheduleBeat()
  }

  private createChordProgression(bpm: number, theme: string) {
    if (!this.audioContext) return

    const chordProgressions: Record<string, number[][]> = {
      '清晨花园': [[261.63, 329.63, 392.0], [392.0, 493.88, 587.33], [261.63, 311.13, 392.0], [349.23, 440.0, 523.25]],
      '都市夜景': [[196.0, 246.94, 293.66], [293.66, 369.99, 440.0], [196.0, 233.08, 293.66], [261.63, 329.63, 392.0]],
      '火焰山谷': [[130.81, 164.81, 196.0], [196.0, 246.94, 293.66], [130.81, 155.56, 196.0], [174.61, 220.0, 261.63]],
      'default': [[261.63, 329.63, 392.0], [392.0, 493.88, 587.33], [261.63, 311.13, 392.0], [349.23, 440.0, 523.25]],
    }

    const progression = chordProgressions[theme] || chordProgressions['default']
    const chordDuration = (60 / bpm) * 4

    const scheduleChord = () => {
      if (!this.isPlaying || !this.audioContext) return

      const chord = progression[this.chordIndex % progression.length]
      this.chordIndex += 1
      const now = this.audioContext.currentTime

      chord.forEach((freq) => {
        if (!this.audioContext) return

        const osc = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()

        osc.type = 'sine'
        osc.frequency.value = freq

        gain.gain.setValueAtTime(this.volume * 0.3, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + chordDuration - 0.1)

        osc.connect(gain)
        gain.connect(this.audioContext.destination)

        osc.start(now)
        osc.stop(now + chordDuration)
      })

      this.chordTimer = window.setTimeout(scheduleChord, chordDuration * 1000)
    }

    scheduleChord()
  }

  stopMusic() {
    this.isPlaying = false

    if (this.rhythmTimer) {
      window.clearTimeout(this.rhythmTimer)
      this.rhythmTimer = null
    }

    if (this.chordTimer) {
      window.clearTimeout(this.chordTimer)
      this.chordTimer = null
    }

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
