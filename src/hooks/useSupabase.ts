import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useGameStore } from "../store/useGameStore";

function getGameStateForSave() {
  const s = useGameStore.getState();
  return {
    balance: s.balance,
    totalEarned: s.totalEarned,
    totalTaps: s.totalTaps,
    lastSaveTime: Date.now(),
    tapLevel: s.tapLevel,
    tapValue: s.tapValue,
    boostActive: s.boostActive,
    boostEndTime: s.boostEndTime,
    taxDebt: s.taxDebt,
    taxPaid: s.taxPaid,
    playerName: s.playerName,
    companyName: s.companyName,
    onboardingDone: s.onboardingDone,
    ownedInvestments: s.ownedInvestments,
    ownedBusinesses: s.ownedBusinesses,
    ownedCollectibles: s.ownedCollectibles,
    prestigeLevel: s.prestigeLevel,
    prestigeMultiplier: s.prestigeMultiplier,
    lifetimeEarned: s.lifetimeEarned,
    claimedAchievements: s.claimedAchievements,
    lastDailyClaimDate: s.lastDailyClaimDate,
    dailyStreak: s.dailyStreak,
    businessTimers: s.businessTimers,
    investmentTimers: s.investmentTimers,
    diamonds: s.diamonds,
    isVip: s.isVip,
    vipEndTime: s.vipEndTime,
    ownedManagers: s.ownedManagers,
    assignedManagers: s.assignedManagers,
    questProgress: s.questProgress,
    claimedQuests: s.claimedQuests,
    lastQuestResetDate: s.lastQuestResetDate,
    lastWeeklyResetDate: s.lastWeeklyResetDate,
    lastWheelSpinDate: s.lastWheelSpinDate,
    wheelSpinsToday: s.wheelSpinsToday,
  };
}

export async function cloudSave() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    const gameData = getGameStateForSave();
    const s = useGameStore.getState();

    await Promise.all([
      supabase.from("game_saves").upsert({
        user_id: userId,
        data: gameData,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" }),

      supabase.from("players").upsert({
        user_id: userId,
        name: s.playerName || "İsimsiz",
        company_name: s.companyName || "",
        total_earned: Math.floor(s.totalEarned),
        prestige_level: s.prestigeLevel,
        is_vip: s.isVip,
        tap_level: s.tapLevel,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" }),
    ]);
  } catch (e) {
    console.log("Cloud save error:", e);
  }
}

export async function cloudLoad(): Promise<boolean> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return false;

    const { data, error } = await supabase
      .from("game_saves")
      .select("data")
      .eq("user_id", userId)
      .single();

    if (error || !data?.data) return false;

    const d = data.data as Record<string, unknown>;
    const store = useGameStore.getState();

    // Only load if cloud save has data
    if (typeof d.balance === "number" || typeof d.onboardingDone === "boolean") {
      // Use the store's loadFromStorage-like approach but from cloud data
      const { saveGame, loadGame } = await import("../utils/saveLoad");
      await saveGame(d);
      await store.loadFromStorage();
      return true;
    }
    return false;
  } catch (e) {
    console.log("Cloud load error:", e);
    return false;
  }
}

export function useSupabaseSync() {
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    cloudSave();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      cloudSave();
    }, 30000);
    return () => clearInterval(id);
  }, []);
}
