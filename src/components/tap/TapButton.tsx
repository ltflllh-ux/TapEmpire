import React, { useRef, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatTL } from "../../utils/formatTL";

interface Props {
  onPress: () => void;
  tapValue: number;
  boostActive: boolean;
}

export default function TapButton({ onPress, tapValue, boostActive }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.8, duration: 1500, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 1500, useNativeDriver: false }),
      ])
    );
    glow.start();
    return () => glow.stop();
  }, [glowAnim]);

  useEffect(() => {
    if (boostActive) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
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
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 40, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.02, duration: 60, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 40, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const displayValue = boostActive ? tapValue * 25 : tapValue;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }] },
      ]}
    >
      <Animated.View
        style={[
          styles.glowRing,
          {
            opacity: glowAnim,
            borderColor: boostActive ? "#F4C430" : "#F4C43088",
          },
        ]}
      />
      <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
        <View style={[styles.outerRing, boostActive && styles.outerRingBoost]}>
          <LinearGradient
            colors={boostActive ? ["#3D2B00", "#1A2744", "#3D2B00"] : ["#1A2744", "#0D1B2A", "#1A2744"]}
            style={styles.inner}
          >
            <Text style={styles.icon}>{"💰"}</Text>
            <Text style={[styles.valueText, boostActive && styles.boostText]}>
              +{formatTL(displayValue)}
              {boostActive ? " ⚡" : ""}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    borderColor: "#F4C43088",
  },
  outerRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 4,
    borderColor: "#F4C430",
    padding: 3,
    shadowColor: "#F4C430",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  outerRingBoost: {
    borderColor: "#F4C430",
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  inner: {
    flex: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 64,
  },
  valueText: {
    color: "#CBD5E0",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 4,
  },
  boostText: {
    color: "#F4C430",
    fontSize: 19,
    textShadowColor: "#F4C43066",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
