import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGameStore } from "../../store/useGameStore";
import { soundManager } from "../../engine/SoundManager";

export default function BoostSection() {
  const boostActive = useGameStore((s) => s.boostActive);
  const boostEndTime = useGameStore((s) => s.boostEndTime);
  const activateBoost = useGameStore((s) => s.activateBoost);
  const checkBoostExpiry = useGameStore((s) => s.checkBoostExpiry);

  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!boostActive) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((boostEndTime - Date.now()) / 1000));
      setRemaining(left);
      checkBoostExpiry();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [boostActive, boostEndTime, checkBoostExpiry]);

  if (boostActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.activeLabel}>{"⚡ BOOST AKTİF"}</Text>
        <Text style={styles.timer}>{remaining} saniye</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => { activateBoost(); soundManager.playBoost(); }}>
        <Text style={styles.buttonText}>
          {"📺 Reklam İzle → 30sn boyunca 25x kazanç!"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0D1B2A",
    borderWidth: 1.5,
    borderColor: "#F4C430",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#F4C430",
    fontSize: 14,
    fontWeight: "bold",
  },
  activeLabel: {
    color: "#F4C430",
    fontSize: 18,
    fontWeight: "bold",
  },
  timer: {
    color: "#CBD5E0",
    fontSize: 14,
    marginTop: 4,
  },
});
