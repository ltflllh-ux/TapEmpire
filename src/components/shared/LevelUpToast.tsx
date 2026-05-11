import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { formatTL } from "../../utils/formatTL";

interface Props {
  level: number;
  tapValue: number;
  onDone: () => void;
}

export default function LevelUpToast({ level, tapValue, onDone }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.delay(2000),
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]),
    ]).start(onDone);
  }, [scaleAnim, opacityAnim, onDone]);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.card}>
        <Text style={styles.icon}>{"⬆️"}</Text>
        <Text style={styles.title}>SEVİYE {level}!</Text>
        <Text style={styles.subtitle}>Tap başına {formatTL(tapValue)}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  card: {
    backgroundColor: "#0D1B2AEE",
    borderWidth: 2,
    borderColor: "#F4C430",
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#F4C430",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  icon: { fontSize: 40 },
  title: {
    color: "#F4C430",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },
  subtitle: {
    color: "#CBD5E0",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
});
