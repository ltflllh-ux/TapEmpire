import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { TIER_COLORS, TIER_LABELS } from "../../data/achievements";
import type { AchievementTier } from "../../data/achievements";
import { formatTL } from "../../utils/formatTL";

interface Props {
  name: string;
  icon: string;
  tier: AchievementTier;
  reward: number;
  onDone: () => void;
}

export default function AchievementToast({ name, icon, tier, reward, onDone }: Props) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(onDone);
      }, 2500);
    });
  }, [slideAnim, opacityAnim, onDone]);

  const color = TIER_COLORS[tier];

  return (
    <Animated.View
      style={[
        styles.container,
        { borderColor: color, transform: [{ translateY: slideAnim }], opacity: opacityAnim },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.info}>
        <Text style={styles.label}>{"🏆 Başarım Kazanıldı!"}</Text>
        <Text style={[styles.name, { color }]}>{name} — {TIER_LABELS[tier]}</Text>
        {reward > 0 && <Text style={styles.reward}>+{formatTL(reward)}</Text>}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: "#0D1B2AEE",
    borderRadius: 16,
    borderWidth: 2,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  icon: {
    fontSize: 36,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  label: {
    color: "#A0AEC0",
    fontSize: 11,
    fontWeight: "600",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 2,
  },
  reward: {
    color: "#48BB78",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 2,
  },
});
