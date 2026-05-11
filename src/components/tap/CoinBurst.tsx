import React, { useEffect, useRef, useMemo } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

interface Props {
  id: number;
  x: number;
  y: number;
  onDone: () => void;
}

interface CoinData {
  dx: number;
  dy: number;
  delay: number;
}

function SingleCoin({ x, y, dx, dy, delay, onDone }: { x: number; y: number; dx: number; dy: number; delay: number; onDone: () => void }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        // Fly upward
        Animated.timing(translateY, {
          toValue: dy,
          duration: 800,
          useNativeDriver: true,
        }),
        // Horizontal spread
        Animated.timing(translateX, {
          toValue: dx,
          duration: 800,
          useNativeDriver: true,
        }),
        // 3D spin: 0 -> 720 degrees (two full rotations)
        Animated.timing(rotateY, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Scale: 0.5 -> 1.0 -> 0.3
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Fade out in the last portion
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]);

    animation.start(() => onDone());
  }, [translateX, translateY, rotateY, scale, opacity, dx, dy, delay, onDone]);

  const spin = rotateY.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "360deg", "720deg"],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.coin,
        {
          left: x,
          top: y,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { perspective: 400 },
            { rotateY: spin },
            { scale },
          ],
        },
      ]}
    >
      <Text style={styles.coinEmoji}>{"🪙"}</Text>
    </Animated.View>
  );
}

export default function CoinBurst({ id, x, y, onDone }: Props) {
  const coinCount = useMemo(() => 3 + Math.floor(Math.random() * 3), []); // 3-5 coins
  const coins = useMemo<CoinData[]>(() => {
    const result: CoinData[] = [];
    for (let i = 0; i < coinCount; i++) {
      result.push({
        dx: (Math.random() - 0.5) * 120, // horizontal spread
        dy: -(60 + Math.random() * 80),   // fly upward 60-140px
        delay: i * 40,                     // slight stagger
      });
    }
    return result;
  }, [coinCount]);

  const doneCount = useRef(0);

  const handleCoinDone = () => {
    doneCount.current += 1;
    if (doneCount.current >= coinCount) {
      onDone();
    }
  };

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {coins.map((coin, index) => (
        <SingleCoin
          key={`${id}_coin_${index}`}
          x={x}
          y={y}
          dx={coin.dx}
          dy={coin.dy}
          delay={coin.delay}
          onDone={handleCoinDone}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  coin: {
    position: "absolute",
  },
  coinEmoji: {
    fontSize: 24,
  },
});
