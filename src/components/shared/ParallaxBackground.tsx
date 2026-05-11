import React, { useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";

interface StarConfig {
  id: number;
  x: number;
  startY: number;
  size: number;
  opacity: number;
  speed: number;
  twinkle: boolean;
  gold: boolean;
}

interface Props {
  speed?: number;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

function generateStars(
  count: number,
  sizeMin: number,
  sizeMax: number,
  baseOpacity: number,
  baseSpeed: number,
  gold: boolean,
  startId: number,
  twinkleChance: number,
): StarConfig[] {
  const stars: StarConfig[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: startId + i,
      x: Math.random() * SCREEN_W,
      startY: -(Math.random() * SCREEN_H),
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      opacity: baseOpacity,
      speed: baseSpeed * (0.7 + Math.random() * 0.6),
      twinkle: Math.random() < twinkleChance,
      gold,
    });
  }
  return stars;
}

function Star({ config, speedMult }: { config: StarConfig; speedMult: number }) {
  const translateY = useRef(new Animated.Value(config.startY)).current;
  const opacityAnim = useRef(new Animated.Value(config.opacity)).current;

  useEffect(() => {
    const totalDistance = SCREEN_H - config.startY + config.size;
    const duration = (totalDistance / (config.speed * speedMult)) * 1000;

    const drift = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: SCREEN_H + config.size,
          duration: Math.max(duration, 1000),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -config.size * 2,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    drift.start();

    let twinkleAnim: Animated.CompositeAnimation | null = null;
    if (config.twinkle) {
      twinkleAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: config.opacity * 0.3,
            duration: 1200 + Math.random() * 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: config.opacity,
            duration: 1200 + Math.random() * 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
      twinkleAnim.start();
    }

    return () => {
      drift.stop();
      if (twinkleAnim) twinkleAnim.stop();
    };
  }, [speedMult]);

  const color = config.gold ? "#F4C430" : "#FFFFFF";

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: config.x,
        width: config.size,
        height: config.size,
        borderRadius: config.size / 2,
        backgroundColor: color,
        opacity: opacityAnim,
        transform: [{ translateY }],
      }}
    />
  );
}

const MemoStar = React.memo(Star);

export default function ParallaxBackground({ speed = 1 }: Props) {
  const stars = useMemo(() => {
    const farLayer = generateStars(20, 2, 3, 0.3, 12, false, 0, 0.3);
    const midLayer = generateStars(12, 3, 4, 0.5, 24, false, 100, 0.4);
    const nearLayer = generateStars(8, 4, 6, 0.7, 40, true, 200, 0.5);
    return [...farLayer, ...midLayer, ...nearLayer];
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map((s) => (
        <MemoStar key={s.id} config={s} speedMult={speed} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});
