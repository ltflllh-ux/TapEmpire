import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGameStore } from "../../store/useGameStore";
import { formatTL } from "../../utils/formatTL";

export default function BalanceHeader() {
  const balance = useGameStore((s) => s.balance);
  const hourlyPassiveIncome = useGameStore((s) => s.hourlyPassiveIncome);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.bankLabel}>{"💳 TapEmpire Bank"}</Text>
        <Text style={styles.passive}>{"⚡ "}{formatTL(hourlyPassiveIncome)}/saat</Text>
      </View>
      <Text style={styles.balance}>{formatTL(balance)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0D1B2A",
    borderRadius: 16,
    padding: 16,
    margin: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bankLabel: {
    color: "#CBD5E0",
    fontSize: 14,
    fontWeight: "600",
  },
  passive: {
    color: "#A0AEC0",
    fontSize: 12,
  },
  balance: {
    color: "#F4C430",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
});
