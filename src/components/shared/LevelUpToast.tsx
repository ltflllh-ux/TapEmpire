import React, { useEffect, useRef, useMemo } from "react";
import { Animated, Text, View, StyleSheet, Easing } from "react-native";
import { formatTL } from "../../utils/formatTL";

interface Props {
  level: number;
  tapValue: number;
  onDone: () => void;
}

/* ── Single gold particle that explodes outward ── */
function GoldParticle({ angle, delay }: { angle: number; delay: number }) {
  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const radius = 100 + Math.random() * 60; // 100-160px outward
  const dx = Math.cos(angle) * radius;
  const dy = Math.sin(angle) * radius;
  const size = 6 + Math.random() * 6; // 6-12px

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(progress, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.delay(300),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [progress, opacity, rotate, delay]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dx],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dy],
  });
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "540deg"],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.3, 1.2, 0.2],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotate: spin },
            { scale },
          ],
        },
      ]}
    />
  );
}

/* ── 3D Spinning Star Badge ── */
function SpinningStar() {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous Y-axis spin
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Gentle pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, [spinAnim, pulseAnim]);

  const rotateY = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.starBadge,
        {
          transform: [
            { perspective: 600 },
            { rotateY },
            { scale: pulseAnim },
          ],
        },
      ]}
    >
      <Text style={styles.starEmoji}>{"🌟"}</Text>
    </Animated.View>
  );
}

/* ── Main LevelUpToast ── */
export default function LevelUpToast({ level, tapValue, onDone }: Props) {
  // Card entrance
  const cardScale = useRef(new Animated.Value(0)).current;
  const cardRotateX = useRef(new Animated.Value(1)).current; // 1 = 90deg
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Floating bob after entrance
  const bobAnim = useRef(new Animated.Value(0)).current;

  // Text reveal
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.5)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleScale = useRef(new Animated.Value(0.5)).current;

  // Particle timing
  const particleDelay = 300; // particles start after card appears

  // Generate particle angles
  const particles = useMemo(() => {
    const count = 12 + Math.floor(Math.random() * 4); // 12-15
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3,
      delay: particleDelay + i * 30,
    }));
  }, []);

  useEffect(() => {
    // Phase 1: Card flies in from behind (3D rotateX 90 -> 0, scale 0 -> 1)
    const entrance = Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(cardRotateX, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]);

    // Phase 2: Text reveal (staggered scale + fade)
    const textReveal = Animated.stagger(200, [
      Animated.parallel([
        Animated.spring(titleScale, { toValue: 1, friction: 4, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(subtitleScale, { toValue: 1, friction: 4, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
    ]);

    // Phase 3: Gentle floating bob
    const bob = Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, { toValue: -6, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bobAnim, { toValue: 6, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    // Phase 4: Exit - flip out after 3 seconds
    const exit = Animated.parallel([
      Animated.timing(cardRotateX, {
        toValue: -1, // -90deg (flips forward)
        duration: 400,
        easing: Easing.in(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]);

    // Full sequence
    Animated.sequence([
      entrance,
      Animated.delay(100),
      textReveal,
    ]).start(() => {
      // Start bobbing
      bob.start();

      // Schedule exit after 3s total display time
      setTimeout(() => {
        bob.stop();
        exit.start(() => onDone());
      }, 2200);
    });
  }, [
    cardScale, cardRotateX, cardOpacity, bobAnim,
    titleOpacity, titleScale, subtitleOpacity, subtitleScale, onDone,
  ]);

  const rotateXInterp = cardRotateX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-90deg", "0deg", "90deg"],
  });

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {/* Gold particles */}
      {particles.map((p, i) => (
        <View key={`p_${i}`} style={styles.particleOrigin}>
          <GoldParticle angle={p.angle} delay={p.delay} />
        </View>
      ))}

      {/* Main card */}
      <Animated.View
        style={[
          styles.container,
          {
            opacity: cardOpacity,
            transform: [
              { perspective: 1000 },
              { rotateX: rotateXInterp },
              { scale: cardScale },
              { translateY: bobAnim },
            ],
          },
        ]}
      >
        <View style={styles.card}>
          {/* Glow ring behind star */}
          <View style={styles.glowRing} />

          {/* 3D Spinning Star */}
          <SpinningStar />

          {/* Title with reveal */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleOpacity,
                transform: [{ scale: titleScale }],
              },
            ]}
          >
            SEViYE {level}!
          </Animated.Text>

          {/* Subtitle with reveal */}
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: subtitleOpacity,
                transform: [{ scale: subtitleScale }],
              },
            ]}
          >
            Tap basina {formatTL(tapValue)}
          </Animated.Text>

          {/* Decorative line */}
          <View style={styles.decorLine} />

          <Animated.Text
            style={[
              styles.congrats,
              {
                opacity: subtitleOpacity,
                transform: [{ scale: subtitleScale }],
              },
            ]}
          >
            Tebrikler!
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  particleOrigin: {
    position: "absolute",
    top: "45%",
    left: "50%",
  },
  particle: {
    position: "absolute",
    backgroundColor: "#F4C430",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "#0D1B2AF0",
    borderWidth: 2,
    borderColor: "#F4C430",
    borderRadius: 24,
    paddingHorizontal: 48,
    paddingVertical: 28,
    alignItems: "center",
    minWidth: 260,
    shadowColor: "#F4C430",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 25,
  },
  glowRing: {
    position: "absolute",
    top: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#FFD70066",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  starBadge: {
    marginBottom: 8,
  },
  starEmoji: {
    fontSize: 52,
    textShadowColor: "#FFD700",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  title: {
    color: "#F4C430",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 4,
    textShadowColor: "#FFD70088",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: "#CBD5E0",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 6,
  },
  decorLine: {
    width: 120,
    height: 2,
    backgroundColor: "#F4C43066",
    borderRadius: 1,
    marginVertical: 10,
  },
  congrats: {
    color: "#FFD700",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
