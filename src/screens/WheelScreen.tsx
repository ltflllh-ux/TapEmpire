import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import { WheelSegment } from "../data/wheelRewards";
import { formatTL } from "../utils/formatTL";
import LuckyWheel from "../components/shared/LuckyWheel";
import { soundManager } from "../engine/SoundManager";

function ResultModal({
  visible,
  segment,
  onClose,
}: {
  visible: boolean;
  segment: WheelSegment | null;
  onClose: () => void;
}) {
  if (!segment) return null;

  const isJackpot = segment.id === "coins_500k";

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{isJackpot ? "🎉🎰🎉" : "🎉"}</Text>
          <Text style={styles.resultTitle}>
            {isJackpot ? "JACKPOT!" : "Tebrikler!"}
          </Text>
          <View style={styles.resultRewardBox}>
            <Text style={styles.resultIcon}>{segment.icon}</Text>
            <Text style={styles.resultLabel}>{segment.label}</Text>
          </View>
          <Text style={styles.resultDesc}>
            {segment.reward.type === "coins" && `${formatTL(segment.reward.amount)} kazandın!`}
            {segment.reward.type === "diamonds" && `${segment.reward.amount} Elmas kazandın!`}
            {segment.reward.type === "vip" && `${segment.reward.amount} günlük VIP kazandın!`}
            {segment.reward.type === "boost" && "Boost aktif edildi!"}
          </Text>
          <TouchableOpacity style={styles.resultBtn} onPress={onClose}>
            <LinearGradient colors={["#F4C430", "#D4A420"]} style={styles.resultBtnGrad}>
              <Text style={styles.resultBtnText}>{"Harika! 🎊"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
}

export default function WheelScreen() {
  const [spinning, setSpinning] = useState(false);
  const [resultSegment, setResultSegment] = useState<WheelSegment | null>(null);
  const [showResult, setShowResult] = useState(false);

  const diamonds = useGameStore((s) => s.diamonds);
  const canSpinFree = useGameStore((s) => s.canSpinFree);
  const recordWheelSpin = useGameStore((s) => s.recordWheelSpin);
  const wheelSpinsToday = useGameStore((s) => s.wheelSpinsToday);
  const lastWheelSpinDate = useGameStore((s) => s.lastWheelSpinDate);
  const saveToStorage = useGameStore((s) => s.saveToStorage);
  const activateBoost = useGameStore((s) => s.activateBoost);

  const isFreeAvailable = canSpinFree();
  const today = new Date().toISOString().split("T")[0];
  const spinsUsedToday = lastWheelSpinDate === today ? wheelSpinsToday : 0;

  const handleSpin = useCallback(() => {
    if (spinning) return;

    const freeNow = canSpinFree();

    if (!freeNow) {
      const currentDiamonds = useGameStore.getState().diamonds;
      if (currentDiamonds < 10) return;
      useGameStore.setState((s) => ({ diamonds: s.diamonds - 10 }));
    }

    recordWheelSpin();
    saveToStorage();
    setSpinning(true);
    soundManager.playWheelSpin();
  }, [spinning, canSpinFree, recordWheelSpin, saveToStorage]);

  const handleResult = useCallback(
    (segment: WheelSegment) => {
      const s = useGameStore.getState();

      switch (segment.reward.type) {
        case "coins":
          useGameStore.setState((prev) => ({
            balance: prev.balance + segment.reward.amount,
            totalEarned: prev.totalEarned + segment.reward.amount,
            lifetimeEarned: prev.lifetimeEarned + segment.reward.amount,
          }));
          soundManager.playCoinCollect();
          break;
        case "diamonds":
          useGameStore.setState((prev) => ({
            diamonds: prev.diamonds + segment.reward.amount,
          }));
          soundManager.playWheelWin();
          break;
        case "vip": {
          const currentEnd = s.isVip ? s.vipEndTime : Date.now();
          const newEnd = currentEnd + segment.reward.amount * 86400000;
          useGameStore.setState({ isVip: true, vipEndTime: newEnd });
          soundManager.playWheelWin();
          break;
        }
        case "boost":
          activateBoost();
          soundManager.playBoost();
          break;
      }

      saveToStorage();
      setSpinning(false);
      setResultSegment(segment);
      setShowResult(true);
    },
    [activateBoost, saveToStorage],
  );

  const closeResult = useCallback(() => {
    setShowResult(false);
    setResultSegment(null);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.title}>{"🎰 Şans Çarkı"}</Text>
        <View style={styles.diamondRow}>
          <Text style={styles.diamondIcon}>{"💎"}</Text>
          <Text style={styles.diamondText}>{diamonds}</Text>
        </View>
      </LinearGradient>

      <View style={styles.wheelArea}>
        <LuckyWheel
          onResult={handleResult}
          spinning={spinning}
        />
      </View>

      <View style={styles.bottom}>
        {isFreeAvailable ? (
          <TouchableOpacity
            style={styles.spinBtn}
            onPress={handleSpin}
            disabled={spinning}
            activeOpacity={0.7}
          >
            <LinearGradient colors={["#F4C430", "#D4A420"]} style={styles.spinGrad}>
              <Text style={styles.spinText}>{"Ücretsiz Çevir 🎁"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.spinBtn, diamonds < 10 && styles.spinBtnDisabled]}
            onPress={handleSpin}
            disabled={spinning || diamonds < 10}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={diamonds < 10 ? ["#4A5568", "#2D3748"] : ["#63B3ED", "#3182CE"]}
              style={styles.spinGrad}
            >
              <Text style={styles.spinText}>{"💎 10 ile Çevir"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Text style={styles.infoText}>
          {"Günlük ücretsiz: "}{spinsUsedToday}{"/1"}
        </Text>

        {!isFreeAvailable && diamonds < 10 && (
          <Text style={styles.warningText}>
            {"Yeterli elmasın yok! Marketten elmas satın alabilirsin."}
          </Text>
        )}
      </View>

      <ResultModal visible={showResult} segment={resultSegment} onClose={closeResult} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#070D1A" },
  header: {
    padding: 16,
    alignItems: "center",
  },
  title: { color: "#E2E8F0", fontSize: 22, fontWeight: "bold" },
  diamondRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#070D1A44",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 10,
    gap: 6,
  },
  diamondIcon: { fontSize: 18 },
  diamondText: { color: "#63B3ED", fontSize: 16, fontWeight: "bold" },
  wheelArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    alignItems: "center",
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  spinBtn: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  spinBtnDisabled: {
    opacity: 0.5,
  },
  spinGrad: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 14,
  },
  spinText: {
    color: "#070D1A",
    fontSize: 18,
    fontWeight: "900",
  },
  infoText: {
    color: "#A0AEC0",
    fontSize: 13,
    marginTop: 10,
  },
  warningText: {
    color: "#ED64A6",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F4C43033",
  },
  resultEmoji: { fontSize: 48, marginBottom: 8 },
  resultTitle: { color: "#F4C430", fontSize: 28, fontWeight: "900" },
  resultRewardBox: {
    backgroundColor: "#070D1A",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  resultIcon: { fontSize: 36 },
  resultLabel: { color: "#F4C430", fontSize: 28, fontWeight: "900" },
  resultDesc: {
    color: "#A0AEC0",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  resultBtn: {
    width: "100%",
    marginTop: 20,
    borderRadius: 14,
    overflow: "hidden",
  },
  resultBtnGrad: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 14,
  },
  resultBtnText: {
    color: "#070D1A",
    fontSize: 17,
    fontWeight: "900",
  },
});
