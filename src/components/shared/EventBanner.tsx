import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../../store/useGameStore";
import { GAME_EVENTS } from "../../data/events";

export default function EventBanner() {
  const activeEventId = useGameStore((s) => s.activeEventId);
  const eventEndTime = useGameStore((s) => s.eventEndTime);
  const clearEvent = useGameStore((s) => s.clearEvent);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!activeEventId) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((eventEndTime - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) clearEvent();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeEventId, eventEndTime, clearEvent]);

  if (!activeEventId || remaining <= 0) return null;

  const event = GAME_EVENTS.find((e) => e.id === activeEventId);
  if (!event) return null;

  return (
    <LinearGradient
      colors={[event.color + "33", event.color + "11"]}
      style={styles.banner}
    >
      <View style={styles.row}>
        <Text style={styles.icon}>{event.icon}</Text>
        <View style={styles.info}>
          <Text style={[styles.name, { color: event.color }]}>{event.name}</Text>
          <Text style={styles.desc}>{event.description}</Text>
        </View>
        <View style={styles.timerBox}>
          <Text style={[styles.timer, { color: event.color }]}>{remaining}s</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ffffff11",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 28,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  desc: {
    color: "#A0AEC0",
    fontSize: 11,
    marginTop: 1,
  },
  timerBox: {
    backgroundColor: "#070D1A88",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timer: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
