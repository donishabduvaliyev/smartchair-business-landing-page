/**
 * SmartChair Audio Engine (Web Audio API)
 * Procedural audio synthesis inspired by deep-field.
 * Zero external audio files, zero bandwidth overhead.
 * Muted by default to respect user autoplay preferences.
 */

type Listener = (muted: boolean) => void;

class SoundControllerClass {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private humGain: GainNode | null = null;
  private isMuted: boolean = true;
  private listeners: Set<Listener> = new Set();
  private initialized: boolean = false;

  constructor() {
    // Check saved preference or default to muted
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("smartchair_audio_muted");
      this.isMuted = saved !== null ? saved === "true" : true;
    }
  }

  private init() {
    if (this.initialized || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create ambient salon hum generator (subtle 50Hz sine + 120Hz warmth + filtered air)
      this.setupAmbientHum();
      this.initialized = true;
    } catch {
      // Audio context unavailable or blocked
    }
  }

  private setupAmbientHum() {
    if (!this.ctx || !this.masterGain) return;

    try {
      this.humGain = this.ctx.createGain();
      this.humGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      // Low room resonance
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(52, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(this.humGain);
      this.humGain.connect(this.masterGain);

      osc.start();
    } catch {
      // Non-fatal if oscillator fails
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    return this.setMuted(!this.isMuted);
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("smartchair_audio_muted", String(muted));
    }

    if (!this.initialized && !muted) {
      this.init();
    }

    if (this.ctx && this.masterGain) {
      if (this.ctx.state === "suspended" && !muted) {
        this.ctx.resume().catch(() => {});
      }
      const targetGain = muted ? 0 : 0.8;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }

    this.notify();
    if (!muted) {
      this.playLaserClick(880, 0.08);
    }
    return this.isMuted;
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isMuted));
  }

  /**
   * High-tech laser hover chirp (1200Hz -> 1800Hz in 35ms)
   */
  public playHover() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio node failure fallback
    }
  }

  /**
   * Tactile laser booking slot snap
   */
  public playLaserClick(freq: number = 1040, vol: number = 0.07) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.06);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Audio node failure fallback
    }
  }

  /**
   * Portal warp camera sound on scroll dolly
   */
  public playPortalWarp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Audio node failure fallback
    }
  }
}

export const SoundController = new SoundControllerClass();
