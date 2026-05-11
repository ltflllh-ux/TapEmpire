import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatTimer } from "../../data/timerConfig";

interface Props {
  endTime: number;
  onSkip: () => void;
  skipLabel: string;
  onComplete?: () => void;
}

export default function TimerCountdown({ endTime, onSkip, skipLabel, onComplete }: Props) {
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.ceil((endTime - Date.now()) / 1000)));

  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        clearInterval(id);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [endTime, onComplete]);

  if (remaining <= 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.timerRow}>
        <Text style={styles.clockIcon}>{"⏳"}</Text>
        <Text style={styles.timerText}>{formatTimer(remaining)}</Text>
      </View>
      <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
        <Text style={styles.skipText}>{skipLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#070D1A",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F4C43044",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clockIcon: {
    fontSize: 16,
  },
  timerText: {
    color: "#F4C430",
    fontSize: 16,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  skipBtn: {
    backgroundColor: "#F4C43022",
    borderWidth: 1,
    borderColor: "#F4C430",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    color: "#F4C430",
    fontSize: 12,
    fontWeight: "bold",
  },
});
