import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

class SoundManager {
  private sounds: Record<string, Audio.Sound> = {};
  private enabled = true;

  async init() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  async playTap() {
    if (!this.enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async playPurchase() {
    if (!this.enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async playLevelUp() {
    if (!this.enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 150);
  }

  async playAchievement() {
    if (!this.enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 100);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 250);
  }

  async playBoost() {
    if (!this.enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  async playPrestige() {
    if (!this.enabled) return;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), i * 200);
    }
  }

  async playCombo() {
    if (!this.enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export const soundManager = new SoundManager();
