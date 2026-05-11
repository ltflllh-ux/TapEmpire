import { Platform } from "react-native";

let Haptics: any = null;
if (Platform.OS !== "web") {
  Haptics = require("expo-haptics");
}

type OscType = OscillatorType;

class SoundManager {
  private enabled = true;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  async init() {
    if (typeof AudioContext !== "undefined") {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
  }

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  private resumeCtx() {
    if (this.ctx?.state === "suspended") this.ctx.resume();
  }

  private tone(freq: number, duration: number, type: OscType = "sine", vol = 0.3, startAt = 0) {
    if (!this.ctx || !this.masterGain) return;
    this.resumeCtx();
    const now = this.ctx.currentTime + startAt;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration);
  }

  private noise(duration: number, vol = 0.1, startAt = 0) {
    if (!this.ctx || !this.masterGain) return;
    this.resumeCtx();
    const now = this.ctx.currentTime + startAt;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 4000;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    src.start(now);
    src.stop(now + duration);
  }

  private haptic(style: "light" | "medium" | "heavy") {
    if (!Haptics) return;
    const map = { light: "Light", medium: "Medium", heavy: "Heavy" } as const;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]]);
  }

  private hapticNotify() {
    if (!Haptics) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async playTap() {
    if (!this.enabled) return;
    this.haptic("light");
    this.tone(800, 0.06, "square", 0.15);
    this.noise(0.04, 0.08);
    this.tone(1200, 0.04, "sine", 0.1, 0.02);
  }

  async playPurchase() {
    if (!this.enabled) return;
    this.hapticNotify();
    this.tone(523, 0.12, "sine", 0.25);
    this.tone(659, 0.12, "sine", 0.25, 0.08);
    this.tone(784, 0.18, "sine", 0.3, 0.16);
  }

  async playCoinCollect() {
    if (!this.enabled) return;
    this.tone(1047, 0.08, "sine", 0.15);
    this.tone(1319, 0.08, "sine", 0.15, 0.05);
  }

  async playLevelUp() {
    if (!this.enabled) return;
    this.hapticNotify();
    setTimeout(() => this.haptic("heavy"), 150);
    this.tone(440, 0.15, "sine", 0.2);
    this.tone(554, 0.15, "sine", 0.2, 0.1);
    this.tone(659, 0.15, "sine", 0.2, 0.2);
    this.tone(880, 0.3, "sine", 0.3, 0.3);
    this.tone(440, 0.3, "triangle", 0.1, 0.3);
    this.noise(0.05, 0.06, 0.28);
  }

  async playAchievement() {
    if (!this.enabled) return;
    this.hapticNotify();
    setTimeout(() => this.haptic("medium"), 100);
    setTimeout(() => this.haptic("heavy"), 250);
    this.tone(784, 0.12, "sine", 0.2);
    this.tone(988, 0.12, "sine", 0.2, 0.1);
    this.tone(1175, 0.12, "sine", 0.2, 0.2);
    this.tone(1568, 0.25, "triangle", 0.25, 0.3);
    this.tone(784, 0.25, "sine", 0.1, 0.3);
    this.noise(0.06, 0.05, 0.28);
  }

  async playBoost() {
    if (!this.enabled) return;
    this.haptic("heavy");
    if (this.ctx && this.masterGain) {
      this.resumeCtx();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.4);
    }
    this.tone(523, 0.15, "sine", 0.15, 0.15);
    this.tone(784, 0.2, "sine", 0.2, 0.25);
  }

  async playPrestige() {
    if (!this.enabled) return;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.haptic("heavy"), i * 200);
    }
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((freq, i) => {
      this.tone(freq, 0.25, "sine", 0.2, i * 0.12);
      if (i >= 4) this.tone(freq / 2, 0.3, "triangle", 0.1, i * 0.12);
    });
    this.noise(0.08, 0.04, 0.6);
    this.tone(1568, 0.6, "sine", 0.25, 0.72);
    this.tone(784, 0.6, "triangle", 0.12, 0.72);
  }

  async playCombo() {
    if (!this.enabled) return;
    this.haptic("medium");
    this.tone(880, 0.06, "square", 0.1);
    this.tone(1100, 0.06, "square", 0.12, 0.04);
    this.tone(1320, 0.08, "sine", 0.15, 0.08);
  }

  async playWheelSpin() {
    if (!this.enabled) return;
    this.haptic("medium");
    for (let i = 0; i < 8; i++) {
      this.tone(600 + i * 50, 0.05, "sine", 0.1, i * 0.06);
    }
  }

  async playWheelWin() {
    if (!this.enabled) return;
    this.hapticNotify();
    this.tone(659, 0.12, "sine", 0.25);
    this.tone(784, 0.12, "sine", 0.25, 0.1);
    this.tone(1047, 0.12, "sine", 0.25, 0.2);
    this.tone(1319, 0.3, "sine", 0.3, 0.3);
    this.noise(0.06, 0.05, 0.28);
  }

  async playButtonClick() {
    if (!this.enabled) return;
    this.tone(600, 0.04, "sine", 0.12);
    this.noise(0.03, 0.05);
  }

  async playError() {
    if (!this.enabled) return;
    this.haptic("heavy");
    this.tone(300, 0.15, "square", 0.12);
    this.tone(200, 0.2, "square", 0.12, 0.12);
  }

  async playDailyReward() {
    if (!this.enabled) return;
    this.hapticNotify();
    this.tone(523, 0.1, "sine", 0.2);
    this.tone(659, 0.1, "sine", 0.2, 0.08);
    this.tone(784, 0.1, "sine", 0.2, 0.16);
    this.tone(1047, 0.25, "triangle", 0.25, 0.24);
    this.noise(0.05, 0.04, 0.22);
    this.tone(523, 0.25, "sine", 0.08, 0.24);
  }
}

export const soundManager = new SoundManager();
