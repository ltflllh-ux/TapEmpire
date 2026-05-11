import React, { useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Animated,
  Pressable,
  Easing,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  disabled?: boolean;
  shimmer?: boolean;
}

const SHIMMER_INTERVAL = 5000;
const SHIMMER_DURATION = 900;
const FLOAT_DURATION = 2400;

export default function Card3D({
  children,
  style,
  onPress,
  disabled = false,
  shimmer = false,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const rotateX = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(0.15)).current;
  const borderGlow = useRef(new Animated.Value(0)).current;
  const shimmerTranslate = useRef(new Animated.Value(-1)).current;

  // Constant floating animation
  useEffect(() => {
    const floatAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -3,
          duration: FLOAT_DURATION,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 3,
          duration: FLOAT_DURATION,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    floatAnim.start();
    return () => floatAnim.stop();
  }, []);

  // Shimmer effect
  useEffect(() => {
    if (!shimmer) return;

    const runShimmer = () => {
      shimmerTranslate.setValue(-1);
      Animated.timing(shimmerTranslate, {
        toValue: 2,
        duration: SHIMMER_DURATION,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    };

    // First shimmer after a short delay
    const initialTimeout = setTimeout(runShimmer, 1500);
    const interval = setInterval(runShimmer, SHIMMER_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [shimmer]);

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.timing(rotateX, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.35,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(borderGlow, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 12,
      }),
      Animated.spring(rotateX, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 10,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(borderGlow, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const rotateInterpolation = rotateX.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "3deg"],
  });

  const borderColor = borderGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(244, 196, 48, 0.12)", "rgba(244, 196, 48, 0.5)"],
  });

  // Shimmer translateX is mapped from normalized -1..2 to pixel values
  // We use a wide range so the gradient sweeps fully across
  const shimmerTranslateX = shimmerTranslate.interpolate({
    inputRange: [-1, 2],
    outputRange: ["-100%", "200%"],
  });

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.card,
          style,
          {
            opacity: disabled ? 0.6 : 1,
            borderColor: borderColor,
            transform: [
              { perspective: 800 },
              { rotateX: rotateInterpolation },
              { scale },
              { translateY: floatY },
            ],
          },
        ]}
      >
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: shadowOpacity }]}>
          <View style={styles.shadowOverlay} />
        </Animated.View>

        {children}

        {shimmer && (
          <Animated.View
            style={[
              styles.shimmerContainer,
              {
                transform: [
                  {
                    translateX: shimmerTranslate.interpolate({
                      inputRange: [-1, 2],
                      outputRange: [-300, 600],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={[
                "transparent",
                "rgba(255, 255, 255, 0.06)",
                "rgba(255, 255, 255, 0.12)",
                "rgba(255, 255, 255, 0.06)",
                "transparent",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shimmerGradient}
            />
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(244, 196, 48, 0.12)",
    backgroundColor: "#0D1B2A",
    overflow: "hidden",
    shadowColor: "#F4C430",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  shadowOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  shimmerContainer: {
    ...StyleSheet.absoluteFillObject,
    width: 200,
    overflow: "visible",
  },
  shimmerGradient: {
    flex: 1,
    width: 200,
  },
});
