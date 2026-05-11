import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../../store/useGameStore";
import { formatTL } from "../../utils/formatTL";

export default function BalanceHeader() {
  const balance = useGameStore((s) => s.balance);
  const hourlyPassiveIncome = useGameStore((s) => s.hourlyPassiveIncome);
  const prestigeLevel = useGameStore((s) => s.prestigeLevel);
  const isVip = useGameStore((s) => s.isVip);
  const diamonds = useGameStore((s) => s.diamonds);

  return (
    <LinearGradient
      colors={["#0D1B2A", "#1B2C4A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>{"💳 TapEmpire Bank"}</Text>
          {isVip && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>{"👑"} VIP</Text>
            </View>
          )}
          {prestigeLevel > 0 && (
            <View style={styles.prestigeBadge}>
              <Text style={styles.prestigeText}>{"⭐"} P{prestigeLevel}</Text>
            </View>
          )}
        </View>
        <View style={styles.rightCol}>
          {diamonds > 0 && (
            <View style={styles.diamondBox}>
              <Text style={styles.diamondIcon}>{"💎"}</Text>
              <Text style={styles.diamondText}>{diamonds}</Text>
            </View>
          )}
          <Text style={styles.passive}>{"⚡ "}{formatTL(hourlyPassiveIncome)}/saat</Text>
        </View>
      </View>
      <Text style={styles.balance}>{formatTL(balance)}</Text>
      <View style={styles.divider} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 18,
    margin: 12,
    shadowColor: "#F4C430",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  bankLabel: {
    color: "#CBD5E0",
    fontSize: 14,
    fontWeight: "700",
  },
  vipBadge: {
    backgroundColor: "#F4C43033",
    borderWidth: 1,
    borderColor: "#F4C430",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  vipText: {
    color: "#F4C430",
    fontSize: 11,
    fontWeight: "bold",
  },
  prestigeBadge: {
    backgroundColor: "#F4C43033",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  prestigeText: {
    color: "#F4C430",
    fontSize: 11,
    fontWeight: "bold",
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  diamondBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  diamondIcon: { fontSize: 14 },
  diamondText: {
    color: "#63B3ED",
    fontSize: 13,
    fontWeight: "bold",
  },
  passive: {
    color: "#48BB78",
    fontSize: 13,
    fontWeight: "600",
  },
  balance: {
    color: "#F4C430",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "#F4C43055",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F4C43022",
    marginTop: 12,
    borderRadius: 1,
  },
});
