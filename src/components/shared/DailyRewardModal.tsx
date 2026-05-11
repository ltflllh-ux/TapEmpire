import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatTL } from "../../utils/formatTL";

const DAILY_REWARDS = [
  { day: 1, reward: 500, icon: "🎁" },
  { day: 2, reward: 1_500, icon: "🎁" },
  { day: 3, reward: 5_000, icon: "🎁" },
  { day: 4, reward: 15_000, icon: "🎁" },
  { day: 5, reward: 50_000, icon: "💎" },
  { day: 6, reward: 150_000, icon: "💎" },
  { day: 7, reward: 500_000, icon: "👑" },
];

interface Props {
  visible: boolean;
  dayStreak: number;
  onClaim: (amount: number) => void;
}

export default function DailyRewardModal({ visible, dayStreak, onClaim }: Props) {
  const dayIndex = Math.min((dayStreak - 1) % 7, 6);
  const todayReward = DAILY_REWARDS[dayIndex];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.card}>
          <Text style={styles.icon}>{"🎉"}</Text>
          <Text style={styles.title}>Günlük Ödül!</Text>
          <Text style={styles.streak}>Gün {dayStreak}</Text>

          <View style={styles.daysRow}>
            {DAILY_REWARDS.map((d, i) => {
              const isToday = i === dayIndex;
              const isPast = i < dayIndex;
              return (
                <View
                  key={d.day}
                  style={[
                    styles.dayBox,
                    isToday && styles.dayBoxToday,
                    isPast && styles.dayBoxPast,
                  ]}
                >
                  <Text style={styles.dayIcon}>{isPast ? "✅" : d.icon}</Text>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                    G{d.day}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.rewardBox}>
            <Text style={styles.rewardIcon}>{todayReward.icon}</Text>
            <Text style={styles.rewardAmount}>{formatTL(todayReward.reward)}</Text>
          </View>

          <TouchableOpacity
            style={styles.claimBtn}
            onPress={() => onClaim(todayReward.reward)}
          >
            <LinearGradient colors={["#F4C430", "#D4A420"]} style={styles.claimGrad}>
              <Text style={styles.claimText}>{"🎁 Ödülü Al!"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F4C43033",
  },
  icon: { fontSize: 48, marginBottom: 8 },
  title: { color: "#F4C430", fontSize: 26, fontWeight: "900" },
  streak: { color: "#A0AEC0", fontSize: 14, marginTop: 4 },
  daysRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 6,
  },
  dayBox: {
    width: 42,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#1A2744",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  dayBoxToday: {
    borderColor: "#F4C430",
    backgroundColor: "#F4C43022",
  },
  dayBoxPast: {
    backgroundColor: "#48BB7822",
    borderColor: "#48BB78",
  },
  dayIcon: { fontSize: 16 },
  dayLabel: { color: "#4A5568", fontSize: 10, fontWeight: "bold", marginTop: 2 },
  dayLabelToday: { color: "#F4C430" },
  rewardBox: {
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
  rewardIcon: { fontSize: 36 },
  rewardAmount: { color: "#F4C430", fontSize: 32, fontWeight: "900" },
  claimBtn: {
    width: "100%",
    marginTop: 16,
    borderRadius: 14,
    overflow: "hidden",
  },
  claimGrad: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 14,
  },
  claimText: {
    color: "#070D1A",
    fontSize: 17,
    fontWeight: "900",
  },
});
