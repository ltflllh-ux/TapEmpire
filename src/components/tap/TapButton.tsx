import React, { useRef, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { formatTL } from "../../utils/formatTL";

interface Props {
  onPress: () => void;
  tapValue: number;
  boostActive: boolean;
}

export default function TapButton({ onPress, tapValue, boostActive }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (boostActive) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [boostActive, pulseAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  const displayValue = boostActive ? tapValue * 25 : tapValue;

  return (
    <Animated.View
      style={{ transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }] }}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.outer}
      >
        <View style={styles.inner}>
          <Text style={styles.icon}>{"💰"}</Text>
          <Text style={[styles.valueText, boostActive && styles.boostText]}>
            +{formatTL(displayValue)}
            {boostActive ? " ⚡" : ""}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#F4C430",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: "#1A2744",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 60,
  },
  valueText: {
    color: "#CBD5E0",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  boostText: {
    color: "#F4C430",
  },
});
