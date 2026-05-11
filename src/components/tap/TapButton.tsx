import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatTL } from "../../utils/formatTL";

// ---------- constants ----------
const BUTTON_SIZE = 150;
const HALF = BUTTON_SIZE / 2;
const GLOW_RING_SIZE = BUTTON_SIZE + 40; // 190
const RIPPLE_SIZE = BUTTON_SIZE + 60; // 210
const COIN_COUNT = 6;
const GOLD = "#F4C430";
const BG_DARK = "#0D1B2A";

// ---------- types ----------
interface Props {
  onPress: () => void;
  tapValue: number;
  boostActive: boolean;
}

interface FlyingCoin {
  id: number;
  translateY: Animated.Value;
  translateX: Animated.Value;
  opacity: Animated.Value;
  rotateY: Animated.Value;
  scale: Animated.Value;
}

// ---------- component ----------
export default function TapButton({ onPress, tapValue, boostActive }: Props) {
  // --- core press animation values ---
  const pressScale = useRef(new Animated.Value(1)).current;
  const pressRotateX = useRef(new Animated.Value(0)).current; // degrees
  const shadowRadius = useRef(new Animated.Value(20)).current;
  const shadowOpacity = useRef(new Animated.Value(0.5)).current;

  // --- glow ring pulsing ---
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.6)).current;

  // --- ripple ---
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  // --- boost mode ---
  const boostAuraScale = useRef(new Animated.Value(1)).current;
  const boostAuraOpacity = useRef(new Animated.Value(0)).current;
  const boostRotateY = useRef(new Animated.Value(0)).current;

  // --- flying coins ---
  const [coins, setCoins] = useState<FlyingCoin[]>([]);
  const coinIdRef = useRef(0);

  // ========== Glow ring continuous pulse ==========
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowScale, {
          toValue: 1.12,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1.0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    const opLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    opLoop.start();
    return () => {
      loop.stop();
      opLoop.stop();
    };
  }, [glowScale, glowOpacity]);

  // ========== Boost mode animations ==========
  useEffect(() => {
    if (boostActive) {
      // pulsing red/orange aura
      const auraLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(boostAuraScale, {
            toValue: 1.25,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(boostAuraScale, {
            toValue: 1.0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      const auraOpLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(boostAuraOpacity, {
            toValue: 0.7,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(boostAuraOpacity, {
            toValue: 0.2,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      // gentle Y rotation
      const rotLoop = Animated.loop(
        Animated.timing(boostRotateY, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      auraLoop.start();
      auraOpLoop.start();
      rotLoop.start();
      return () => {
        auraLoop.stop();
        auraOpLoop.stop();
        rotLoop.stop();
      };
    } else {
      boostAuraOpacity.setValue(0);
      boostAuraScale.setValue(1);
      boostRotateY.setValue(0);
    }
  }, [boostActive, boostAuraScale, boostAuraOpacity, boostRotateY]);

  // ========== Spawn flying coins ==========
  const spawnCoins = useCallback(() => {
    const newCoins: FlyingCoin[] = [];
    for (let i = 0; i < COIN_COUNT; i++) {
      const coin: FlyingCoin = {
        id: coinIdRef.current++,
        translateY: new Animated.Value(0),
        translateX: new Animated.Value(0),
        opacity: new Animated.Value(1),
        rotateY: new Animated.Value(0),
        scale: new Animated.Value(0.5),
      };
      newCoins.push(coin);
    }

    setCoins((prev) => [...prev, ...newCoins]);

    newCoins.forEach((coin) => {
      const xTarget = (Math.random() - 0.5) * 160;
      const yTarget = -(80 + Math.random() * 120);
      const duration = 700 + Math.random() * 400;

      Animated.parallel([
        Animated.timing(coin.translateY, {
          toValue: yTarget,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(coin.translateX, {
          toValue: xTarget,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(coin.opacity, {
          toValue: 0,
          duration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(coin.rotateY, {
          toValue: 3, // 3 full spins = 1080 deg
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(coin.scale, {
            toValue: 1.2,
            duration: duration * 0.3,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
          Animated.timing(coin.scale, {
            toValue: 0.3,
            duration: duration * 0.7,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setCoins((prev) => prev.filter((c) => c.id !== coin.id));
      });
    });
  }, []);

  // ========== Ripple effect ==========
  const triggerRipple = useCallback(() => {
    rippleScale.setValue(0);
    rippleOpacity.setValue(0.6);

    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [rippleScale, rippleOpacity]);

  // ========== Press in ==========
  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 0.9,
        friction: 6,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.timing(pressRotateX, {
        toValue: 1, // maps to ~8 deg forward tilt
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shadowRadius, {
        toValue: 6,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.25,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  }, [pressScale, pressRotateX, shadowRadius, shadowOpacity]);

  // ========== Press out / release ==========
  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pressRotateX, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
      Animated.timing(shadowRadius, {
        toValue: 20,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [pressScale, pressRotateX, shadowRadius, shadowOpacity]);

  // ========== Full tap handler ==========
  const handleTap = useCallback(() => {
    onPress();
    spawnCoins();
    triggerRipple();
  }, [onPress, spawnCoins, triggerRipple]);

  // ---------- derived animated values ----------
  const rotateXInterp = pressRotateX.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "8deg"],
  });

  const boostRotateYInterp = boostRotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const displayValue = boostActive ? tapValue * 25 : tapValue;

  // ---------- render ----------
  return (
    <View style={styles.root}>
      {/* ---- Flying coins layer ---- */}
      {coins.map((coin) => {
        const spinInterp = coin.rotateY.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: ["0deg", "360deg", "720deg", "1080deg"],
        });
        return (
          <Animated.Text
            key={coin.id}
            style={[
              styles.flyingCoin,
              {
                opacity: coin.opacity,
                transform: [
                  { translateX: coin.translateX },
                  { translateY: coin.translateY },
                  { scale: coin.scale },
                  { perspective: 800 },
                  { rotateY: spinInterp },
                ],
              },
            ]}
          >
            🪙
          </Animated.Text>
        );
      })}

      {/* ---- Boost aura (red/orange pulsing ring behind everything) ---- */}
      {boostActive && (
        <Animated.View
          style={[
            styles.boostAura,
            {
              opacity: boostAuraOpacity,
              transform: [{ scale: boostAuraScale }],
            },
          ]}
        />
      )}

      {/* ---- Glow ring (gold pulsing) ---- */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
            borderColor: boostActive ? GOLD : `${GOLD}99`,
          },
        ]}
      />

      {/* ---- Ripple wave ---- */}
      <Animated.View
        style={[
          styles.ripple,
          {
            opacity: rippleOpacity,
            transform: [{ scale: rippleScale }],
          },
        ]}
      />

      {/* ---- Main 3D button ---- */}
      <Animated.View
        style={[
          styles.buttonShadow,
          {
            shadowRadius: shadowRadius,
            shadowOpacity: shadowOpacity,
            transform: [
              { perspective: 600 },
              { rotateX: rotateXInterp },
              { scale: pressScale },
              ...(boostActive
                ? [{ rotateY: boostRotateYInterp }]
                : []),
            ],
          },
        ]}
      >
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleTap}
        >
          <View style={styles.buttonOuter}>
            {/* Outer bright gold ring */}
            <LinearGradient
              colors={["#FFD700", GOLD, "#B8860B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.outerGradientRing}
            >
              {/* Inner 3D dome — concentric gradient layers */}
              <View style={styles.domeContainer}>
                {/* Layer 1 — outermost highlight (lighter) */}
                <LinearGradient
                  colors={
                    boostActive
                      ? ["#4A2000", "#2A1500", "#1A0A00"]
                      : ["#2A3F5F", "#1A2744", "#0D1B2A"]
                  }
                  start={{ x: 0.3, y: 0 }}
                  end={{ x: 0.7, y: 1 }}
                  style={styles.domeLayer1}
                >
                  {/* Layer 2 — mid highlight shimmer */}
                  <LinearGradient
                    colors={
                      boostActive
                        ? [
                            "rgba(255,140,0,0.25)",
                            "rgba(255,69,0,0.1)",
                            "transparent",
                          ]
                        : [
                            "rgba(244,196,48,0.2)",
                            "rgba(244,196,48,0.05)",
                            "transparent",
                          ]
                    }
                    start={{ x: 0.2, y: 0 }}
                    end={{ x: 0.8, y: 0.6 }}
                    style={styles.domeLayer2}
                  >
                    {/* Layer 3 — center dark core for depth */}
                    <View style={styles.domeCoreWrap}>
                      <LinearGradient
                        colors={
                          boostActive
                            ? ["transparent", "rgba(139,0,0,0.3)"]
                            : ["transparent", "rgba(0,0,0,0.35)"]
                        }
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.domeCore}
                      >
                        {/* Content */}
                        <Text style={styles.icon}>💰</Text>
                        <Text
                          style={[
                            styles.valueText,
                            boostActive && styles.boostValueText,
                          ]}
                        >
                          +{formatTL(displayValue)}
                          {boostActive ? " ⚡" : ""}
                        </Text>
                      </LinearGradient>
                    </View>
                  </LinearGradient>
                </LinearGradient>
              </View>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  root: {
    width: GLOW_RING_SIZE + 60,
    height: GLOW_RING_SIZE + 60,
    alignItems: "center",
    justifyContent: "center",
  },

  // ---- glow ring ----
  glowRing: {
    position: "absolute",
    width: GLOW_RING_SIZE,
    height: GLOW_RING_SIZE,
    borderRadius: GLOW_RING_SIZE / 2,
    borderWidth: 2.5,
    borderColor: GOLD,
  },

  // ---- boost aura ----
  boostAura: {
    position: "absolute",
    width: GLOW_RING_SIZE + 30,
    height: GLOW_RING_SIZE + 30,
    borderRadius: (GLOW_RING_SIZE + 30) / 2,
    backgroundColor: "transparent",
    borderWidth: 6,
    borderColor: "#FF4500",
    shadowColor: "#FF4500",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 15,
  },

  // ---- ripple ----
  ripple: {
    position: "absolute",
    width: RIPPLE_SIZE,
    height: RIPPLE_SIZE,
    borderRadius: RIPPLE_SIZE / 2,
    borderWidth: 2,
    borderColor: `${GOLD}AA`,
    backgroundColor: `${GOLD}11`,
  },

  // ---- flying coins ----
  flyingCoin: {
    position: "absolute",
    fontSize: 28,
    zIndex: 10,
  },

  // ---- shadow wrapper (receives animated shadow + 3D transforms) ----
  buttonShadow: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: HALF,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },

  // ---- outer touchable area ----
  buttonOuter: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: HALF,
    overflow: "hidden",
  },

  // ---- gold outer gradient ring ----
  outerGradientRing: {
    flex: 1,
    borderRadius: HALF,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  // ---- dome container ----
  domeContainer: {
    width: BUTTON_SIZE - 8,
    height: BUTTON_SIZE - 8,
    borderRadius: (BUTTON_SIZE - 8) / 2,
    overflow: "hidden",
  },

  // ---- dome gradient layers ----
  domeLayer1: {
    flex: 1,
    borderRadius: (BUTTON_SIZE - 8) / 2,
    padding: 2,
  },
  domeLayer2: {
    flex: 1,
    borderRadius: (BUTTON_SIZE - 12) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  domeCoreWrap: {
    width: BUTTON_SIZE - 30,
    height: BUTTON_SIZE - 30,
    borderRadius: (BUTTON_SIZE - 30) / 2,
    overflow: "hidden",
  },
  domeCore: {
    flex: 1,
    borderRadius: (BUTTON_SIZE - 30) / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  // ---- text content ----
  icon: {
    fontSize: 44,
  },
  valueText: {
    color: "#CBD5E0",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
    textAlign: "center",
  },
  boostValueText: {
    color: GOLD,
    fontSize: 15,
    textShadowColor: `${GOLD}88`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
});
