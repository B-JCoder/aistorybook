export class AudioService {
  private static synthesis: SpeechSynthesis | null = null
  private static currentUtterance: SpeechSynthesisUtterance | null = null

  static initialize(): void {
    if (typeof window !== "undefined") {
      this.synthesis = window.speechSynthesis
    }
  }

  static async generateAudio(text: string, voicePreference?: string): Promise<void> {
    if (!this.synthesis) {
      throw new Error("Speech synthesis not available")
    }

    // Stop any currently playing audio
    this.stop()

    const utterance = new SpeechSynthesisUtterance(text)

    // Configure voice settings
    const voices = this.synthesis.getVoices()
    const preferredVoice =
      voices.find((voice) => voice.name.includes(voicePreference || "Google") && voice.lang === "en-US") ||
      voices.find((voice) => voice.lang === "en-US") ||
      voices[0]

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8

    this.currentUtterance = utterance
    this.synthesis.speak(utterance)

    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)
    })
  }

  static pause(): void {
    if (this.synthesis) {
      this.synthesis.pause()
    }
  }

  static resume(): void {
    if (this.synthesis) {
      this.synthesis.resume()
    }
  }

  static stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.currentUtterance = null
    }
  }

  static isPlaying(): boolean {
    return this.synthesis ? this.synthesis.speaking : false
  }

  static isPaused(): boolean {
    return this.synthesis ? this.synthesis.paused : false
  }
}
