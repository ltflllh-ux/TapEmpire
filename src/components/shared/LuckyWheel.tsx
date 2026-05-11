import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { WHEEL_SEGMENTS, WheelSegment, spinWheel } from "../../data/wheelRewards";

const NUM_SEGMENTS = WHEEL_SEGMENTS.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;
const WHEEL_SIZE = 300;
const WHEEL_RADIUS = WHEEL_SIZE / 2;

interface Props {
  onResult: (segment: WheelSegment) => void;
  spinning: boolean;
}

export default function LuckyWheel({ onResult, spinning }: Props) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const wasSpinning = useRef(false);

  useEffect(() => {
    if (spinning && !wasSpinning.current) {
      wasSpinning.current = true;

      const winner = spinWheel();
      const winnerIndex = WHEEL_SEGMENTS.findIndex((s) => s.id === winner.id);
      const extraTurns = 5 + Math.floor(Math.random() * 3);
      const targetAngle = extraTurns * 360 + winnerIndex * SEGMENT_ANGLE;

      spinAnim.setValue(0);

      Animated.timing(spinAnim, {
        toValue: targetAngle,
        duration: 3500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        onResult(winner);
      });
    }

    if (!spinning) {
      wasSpinning.current = false;
    }
  }, [spinning, onResult, spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "-360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.pointerContainer}>
        <View style={styles.pointer} />
      </View>

      <View style={styles.wheelWrapper}>
        <View style={styles.outerRing}>
          <Animated.View
            style={[
              styles.wheel,
              { transform: [{ rotate }] },
            ]}
          >
            {WHEEL_SEGMENTS.map((segment, index) => {
              const rotation = index * SEGMENT_ANGLE;
              return (
                <View
                  key={segment.id}
                  style={[
                    styles.segmentContainer,
                    { transform: [{ rotate: `${rotation}deg` }] },
                  ]}
                >
                  <View style={[styles.segment, { backgroundColor: segment.color }]}>
                    <Text style={styles.segmentIcon}>{segment.icon}</Text>
                    <Text
                      style={[
                        styles.segmentLabel,
                        segment.color === "#1A2744" && styles.segmentLabelLight,
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {segment.label}
                    </Text>
                  </View>
                </View>
              );
            })}

            {WHEEL_SEGMENTS.map((_, index) => {
              const rotation = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
              return (
                <View
                  key={`line-${index}`}
                  style={[
                    styles.dividerLine,
                    { transform: [{ rotate: `${rotation}deg` }] },
                  ]}
                />
              );
            })}
          </Animated.View>
        </View>

        <View style={styles.centerDot}>
          <Text style={styles.centerText}>{spinning ? "..." : "CEVIR"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  pointerContainer: {
    zIndex: 10,
    alignItems: "center",
    marginBottom: -12,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 28,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#F4C430",
  },
  wheelWrapper: {
    width: WHEEL_SIZE + 16,
    height: WHEEL_SIZE + 16,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    width: WHEEL_SIZE + 16,
    height: WHEEL_SIZE + 16,
    borderRadius: (WHEEL_SIZE + 16) / 2,
    borderWidth: 6,
    borderColor: "#F4C430",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D1B2A",
    overflow: "hidden",
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_RADIUS,
    position: "relative",
  },
  segmentContainer: {
    position: "absolute",
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  segment: {
    width: 80,
    height: WHEEL_RADIUS - 8,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  segmentIcon: {
    fontSize: 20,
  },
  segmentLabel: {
    color: "#070D1A",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
    textAlign: "center",
  },
  segmentLabelLight: {
    color: "#E2E8F0",
  },
  dividerLine: {
    position: "absolute",
    width: 2,
    height: WHEEL_RADIUS,
    backgroundColor: "#FFFFFF33",
    left: WHEEL_RADIUS - 1,
    top: 0,
    transformOrigin: `1px ${WHEEL_RADIUS}px`,
  },
  centerDot: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F4C430",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#D4A420",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  centerText: {
    color: "#070D1A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
