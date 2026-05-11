import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, StyleSheet, StatusBar, Dimensions } from "react-native";
import { useGameStore } from "../store/useGameStore";
import BalanceHeader from "../components/shared/BalanceHeader";
import LevelProgress from "../components/tap/LevelProgress";
import TapButton from "../components/tap/TapButton";
import FloatingMoney from "../components/tap/FloatingMoney";
import BoostSection from "../components/tap/BoostSection";
import { usePassiveIncome } from "../hooks/usePassiveIncome";

interface Floater {
  id: number;
  x: number;
  y: number;
  amount: number;
}

let floaterId = 0;

export default function HomeScreen() {
  const tap = useGameStore((s) => s.tap);
  const tapValue = useGameStore((s) => s.tapValue);
  const boostActive = useGameStore((s) => s.boostActive);
  const boostMultiplier = useGameStore((s) => s.boostMultiplier);
  const saveToStorage = useGameStore((s) => s.saveToStorage);

  const [floaters, setFloaters] = useState<Floater[]>([]);
  const tapAreaRef = useRef<View>(null);

  usePassiveIncome();

  useEffect(() => {
    const id = setInterval(() => {
      saveToStorage();
    }, 5000);
    return () => clearInterval(id);
  }, [saveToStorage]);

  const handleTap = useCallback(() => {
    const amount = tapValue * (boostActive ? boostMultiplier : 1);
    const screenWidth = Dimensions.get("window").width;
    const x = screenWidth / 2 - 40 + (Math.random() * 80 - 40);
    const y = 60 + Math.random() * 30;
    const id = ++floaterId;
    setFloaters((prev) => [...prev, { id, x, y, amount }]);
    tap();
  }, [tap, tapValue, boostActive, boostMultiplier]);

  const removeFloater = useCallback((id: number) => {
    setFloaters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070D1A" />
      <BalanceHeader />
      <LevelProgress />
      <View style={styles.tapArea} ref={tapAreaRef}>
        <TapButton
          onPress={handleTap}
          tapValue={tapValue}
          boostActive={boostActive}
        />
        {floaters.map((f) => (
          <FloatingMoney
            key={f.id}
            amount={f.amount}
            x={f.x}
            y={f.y}
            onDone={() => removeFloater(f.id)}
          />
        ))}
      </View>
      <BoostSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070D1A",
  },
  tapArea: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
});
