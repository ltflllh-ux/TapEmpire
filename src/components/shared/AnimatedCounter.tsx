import React, { useEffect, useRef } from "react";
import { Animated, TextStyle, StyleProp } from "react-native";
import { formatTL } from "../../utils/formatTL";

interface Props {
  value: number;
  style?: StyleProp<TextStyle>;
  duration?: number;
}

export default function AnimatedCounter({ value, style, duration = 300 }: Props) {
  const animValue = useRef(new Animated.Value(value)).current;
  const displayRef = useRef(value);
  const textRef = useRef<Animated.AnimatedInterpolation<string> | null>(null);

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
  }, [value, animValue, duration]);

  const interpolated = animValue.interpolate({
    inputRange: [0, value || 1],
    outputRange: [formatTL(displayRef.current), formatTL(value)],
  });

  useEffect(() => {
    displayRef.current = value;
  }, [value]);

  return (
    <Animated.Text style={style}>
      {formatTL(value)}
    </Animated.Text>
  );
}
