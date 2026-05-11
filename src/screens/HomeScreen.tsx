import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, StyleSheet, StatusBar, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import BalanceHeader from "../components/shared/BalanceHeader";
import EventBanner from "../components/shared/EventBanner";
import OfflineModal from "../components/shared/OfflineModal";
import AchievementToast from "../components/shared/AchievementToast";
import LevelUpToast from "../components/shared/LevelUpToast";
import DailyRewardModal from "../components/shared/DailyRewardModal";
import LevelProgress from "../components/tap/LevelProgress";
import TapButton from "../components/tap/TapButton";
import FloatingMoney from "../components/tap/FloatingMoney";
import CoinBurst from "../components/tap/CoinBurst";
import TapParticle from "../components/tap/TapParticles";
import ComboIndicator from "../components/tap/ComboIndicator";
import BoostSection from "../components/tap/BoostSection";
import ParallaxBackground from "../components/shared/ParallaxBackground";
import { usePassiveIncome } from "../hooks/usePassiveIncome";
import { useRandomEvents } from "../hooks/useRandomEvents";
import { useCombo } from "../hooks/useCombo";
import { soundManager } from "../engine/SoundManager";
import { useSupabaseSync } from "../hooks/useSupabase";
import { ACHIEVEMENTS } from "../data/achievements";
import type { AchievementTier } from "../data/achievements";

interface Floater {
  id: number;
  x: number;
  y: number;
  amount: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

interface CoinBurstData {
  id: number;
  x: number;
  y: number;
}

interface ToastData {
  id: string;
  name: string;
  icon: string;
  tier: AchievementTier;
  reward: number;
}

let floaterId = 0;
let particleId = 0;
let coinBurstId = 0;

export default function HomeScreen() {
  const tap = useGameStore((s) => s.tap);
  const tapValue = useGameStore((s) => s.tapValue);
  const tapLevel = useGameStore((s) => s.tapLevel);
  const boostActive = useGameStore((s) => s.boostActive);
  const boostMultiplier = useGameStore((s) => s.boostMultiplier);
  const collectibleTapBoost = useGameStore((s) => s.collectibleTapBoost);
  const eventTapMult = useGameStore((s) => s.eventTapMult);
  const prestigeMultiplier = useGameStore((s) => s.prestigeMultiplier);
  const saveToStorage = useGameStore((s) => s.saveToStorage);
  const applyOfflineEarnings = useGameStore((s) => s.applyOfflineEarnings);
  const checkAchievements = useGameStore((s) => s.checkAchievements);
  const claimAchievement = useGameStore((s) => s.claimAchievement);
  const canClaimDaily = useGameStore((s) => s.canClaimDaily);
  const claimDailyReward = useGameStore((s) => s.claimDailyReward);
  const dailyStreak = useGameStore((s) => s.dailyStreak);

  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [coinBursts, setCoinBursts] = useState<CoinBurstData[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [offlineEarnings, setOfflineEarnings] = useState(0);
  const [showOffline, setShowOffline] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; tapValue: number } | null>(null);
  const achCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevLevelRef = useRef(tapLevel);

  const { combo, showCombo, comboMultiplier, comboLabel, comboColor, registerTap } = useCombo();

  usePassiveIncome();
  useRandomEvents();
  useSupabaseSync();

  useEffect(() => {
    soundManager.init();
  }, []);

  useEffect(() => {
    const earned = applyOfflineEarnings();
    if (earned > 0) {
      setOfflineEarnings(earned);
      setShowOffline(true);
    }
    if (canClaimDaily()) {
      setTimeout(() => setShowDailyReward(true), 1500);
    }
  }, [applyOfflineEarnings, canClaimDaily]);

  useEffect(() => {
    const id = setInterval(() => saveToStorage(), 5000);
    return () => clearInterval(id);
  }, [saveToStorage]);

  useEffect(() => {
    achCheckRef.current = setInterval(() => {
      const unclaimed = checkAchievements();
      if (unclaimed.length > 0 && !toast) {
        const first = unclaimed[0];
        const ach = ACHIEVEMENTS.find((a) => a.id === first.id);
        if (ach) {
          claimAchievement(first.id, first.tier);
          soundManager.playAchievement();
          setToast({
            id: `${first.id}_${first.tier}`,
            name: ach.name,
            icon: ach.icon,
            tier: first.tier as AchievementTier,
            reward: first.reward,
          });
        }
      }
    }, 2000);
    return () => { if (achCheckRef.current) clearInterval(achCheckRef.current); };
  }, [checkAchievements, claimAchievement, toast]);

  useEffect(() => {
    if (tapLevel > prevLevelRef.current) {
      soundManager.playLevelUp();
      setLevelUpInfo({ level: tapLevel, tapValue });
    }
    prevLevelRef.current = tapLevel;
  }, [tapLevel, tapValue]);

  const handleTap = useCallback(() => {
    const tapMult = (1 + collectibleTapBoost / 100) * prestigeMultiplier * eventTapMult;
    const amount = Math.floor(tapValue * (boostActive ? boostMultiplier : 1) * tapMult * comboMultiplier);
    const screenWidth = Dimensions.get("window").width;
    const cx = screenWidth / 2;
    const x = cx - 40 + (Math.random() * 80 - 40);
    const y = 60 + Math.random() * 30;
    const fId = ++floaterId;
    setFloaters((prev) => [...prev, { id: fId, x, y, amount }]);

    const cbId = ++coinBurstId;
    setCoinBursts((prev) => [...prev, { id: cbId, x: cx - 12, y: 70 }]);

    for (let i = 0; i < 3; i++) {
      const pId = ++particleId;
      const px = cx - 20 + Math.random() * 40;
      const py = 80 + Math.random() * 20;
      setParticles((prev) => [...prev, { id: pId, x: px, y: py }]);
    }

    registerTap();
    soundManager.playTap();
    if (combo === 14 || combo === 29 || combo === 49) soundManager.playCombo();
    tap(comboMultiplier);
  }, [tap, tapValue, boostActive, boostMultiplier, collectibleTapBoost, prestigeMultiplier, eventTapMult, comboMultiplier, combo, registerTap]);

  const removeFloater = useCallback((id: number) => {
    setFloaters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const removeCoinBurst = useCallback((id: number) => {
    setCoinBursts((prev) => prev.filter((cb) => cb.id !== id));
  }, []);

  const handleClaimDaily = useCallback((amount: number) => {
    claimDailyReward(amount);
    soundManager.playDailyReward();
    setShowDailyReward(false);
  }, [claimDailyReward]);

  return (
    <LinearGradient colors={["#070D1A", "#0A1628", "#070D1A"]} style={styles.container}>
      <ParallaxBackground />
      <StatusBar barStyle="light-content" backgroundColor="#070D1A" />

      {toast && (
        <AchievementToast
          key={toast.id}
          name={toast.name}
          icon={toast.icon}
          tier={toast.tier}
          reward={toast.reward}
          onDone={() => setToast(null)}
        />
      )}

      {levelUpInfo && (
        <LevelUpToast
          key={`lvl_${levelUpInfo.level}`}
          level={levelUpInfo.level}
          tapValue={levelUpInfo.tapValue}
          onDone={() => setLevelUpInfo(null)}
        />
      )}

      <DailyRewardModal
        visible={showDailyReward}
        dayStreak={dailyStreak + 1}
        onClaim={handleClaimDaily}
      />

      <OfflineModal
        visible={showOffline}
        earnings={offlineEarnings}
        onClose={() => setShowOffline(false)}
      />

      <BalanceHeader />
      <EventBanner />
      <LevelProgress />

      <View style={styles.tapArea}>
        <ComboIndicator
          combo={combo}
          label={comboLabel}
          color={comboColor}
          visible={showCombo}
        />
        <TapButton onPress={handleTap} tapValue={tapValue} boostActive={boostActive} />
        {floaters.map((f) => (
          <FloatingMoney
            key={f.id}
            amount={f.amount}
            x={f.x}
            y={f.y}
            onDone={() => removeFloater(f.id)}
          />
        ))}
        {coinBursts.map((cb) => (
          <CoinBurst
            key={cb.id}
            id={cb.id}
            x={cb.x}
            y={cb.y}
            onDone={() => removeCoinBurst(cb.id)}
          />
        ))}
        {particles.map((p) => (
          <TapParticle
            key={p.id}
            x={p.x}
            y={p.y}
            onDone={() => removeParticle(p.id)}
          />
        ))}
      </View>

      <BoostSection />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tapArea: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
});
