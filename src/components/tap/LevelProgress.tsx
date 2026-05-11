import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGameStore } from "../../store/useGameStore";
import { TAP_LEVELS } from "../../data/tapLevels";
import { formatTL } from "../../utils/formatTL";

export default function LevelProgress() {
  const tapLevel = useGameStore((s) => s.tapLevel);
  const totalEarned = useGameStore((s) => s.totalEarned);

  const isMax = tapLevel >= 20;
  const current = TAP_LEVELS[tapLevel - 1];
  const prevThreshold = tapLevel > 1 ? TAP_LEVELS[tapLevel - 2].threshold : 0;
  const progress = isMax
    ? 1
    : Math.min(
        (totalEarned - prevThreshold) / (current.threshold - prevThreshold),
        1
      );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.level}>Seviye {tapLevel}</Text>
        {isMax ? (
          <Text style={styles.max}>{"MAX SEVİYE 🏆"}</Text>
        ) : (
          <Text style={styles.target}>{formatTL(current.threshold)}'e kadar</Text>
        )}
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  level: {
    color: "#CBD5E0",
    fontSize: 13,
    fontWeight: "600",
  },
  target: {
    color: "#A0AEC0",
    fontSize: 12,
  },
  max: {
    color: "#F4C430",
    fontSize: 12,
    fontWeight: "bold",
  },
  barBg: {
    height: 6,
    backgroundColor: "#2D3748",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    backgroundColor: "#48BB78",
    borderRadius: 3,
  },
});
