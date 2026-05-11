import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";

interface Props {
  combo: number;
  label: string;
  color: string;
  visible: boolean;
}

export default function ComboIndicator({ combo, label, color, visible }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible, combo, scaleAnim, opacityAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text style={[styles.combo, { color }]}>x{combo}</Text>
      {label !== "" && (
        <View style={[styles.labelBg, { backgroundColor: color + "33", borderColor: color }]}>
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    right: 20,
    alignItems: "center",
  },
  combo: {
    fontSize: 36,
    fontWeight: "900",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    textShadowColor: "#00000066",
  },
  labelBg: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "900",
  },
});
