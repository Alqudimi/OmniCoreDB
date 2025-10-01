class SoundManager {
  private context: AudioContext | null = null;
  private enabled: boolean = true;

  private initContext() {
    if (!this.context) {
      this.context = new AudioContext();
    }
  }

  private playTone(frequency: number, duration: number, volume: number = 0.1) {
    if (!this.enabled) return;
    
    this.initContext();
    if (!this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  }

  click() {
    this.playTone(800, 0.05, 0.05);
  }

  hover() {
    this.playTone(600, 0.03, 0.03);
  }

  success() {
    this.playTone(880, 0.1, 0.06);
    setTimeout(() => this.playTone(1047, 0.15, 0.06), 50);
  }

  error() {
    this.playTone(300, 0.15, 0.08);
  }

  open() {
    this.playTone(600, 0.08, 0.04);
    setTimeout(() => this.playTone(900, 0.08, 0.04), 40);
  }

  close() {
    this.playTone(900, 0.08, 0.04);
    setTimeout(() => this.playTone(600, 0.08, 0.04), 40);
  }

  toggle(on: boolean) {
    this.enabled = on;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
