import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { formatTL } from "../../utils/formatTL";

interface Props {
  amount: number;
  x: number;
  y: number;
  onDone: () => void;
}

export default function FloatingMoney({ amount, x, y, onDone }: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => onDone());
  }, [translateY, opacity, onDone]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: x,
          top: y,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.text}>+{formatTL(amount)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  text: {
    color: "#00E676",
    fontSize: 18,
    fontWeight: "bold",
  },
});
