import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";

const PARTICLE_ICONS = ["✨", "💫", "⭐", "🪙", "💰"];

interface Props {
  x: number;
  y: number;
  onDone: () => void;
}

export default function TapParticle({ x, y, onDone }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const icon = PARTICLE_ICONS[Math.floor(Math.random() * PARTICLE_ICONS.length)];
  const dx = (Math.random() - 0.5) * 80;
  const dy = -(Math.random() * 60 + 30);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: dx, duration: 500, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: dy, duration: 500, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    ]).start(onDone);
  }, [translateX, translateY, opacity, scale, dx, dy, onDone]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: x,
          top: y,
          transform: [{ translateX }, { translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  icon: {
    fontSize: 16,
  },
});
