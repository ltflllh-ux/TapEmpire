import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useGameStore } from "../store/useGameStore";
import { LeaderboardEntry, LeaderboardPeriod } from "../data/leaderboard";

export function useLeaderboard(period: LeaderboardPeriod) {
  const totalEarned = useGameStore((s) => s.totalEarned);
  const playerName = useGameStore((s) => s.playerName);
  const companyName = useGameStore((s) => s.companyName);
  const isVip = useGameStore((s) => s.isVip);
  const prestigeLevel = useGameStore((s) => s.prestigeLevel);

  const [realPlayers, setRealPlayers] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data?.session?.user?.id ?? null);
    });
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("user_id, name, company_name, total_earned, prestige_level, is_vip")
        .order("total_earned", { ascending: false })
        .limit(100);

      if (!error && data) {
        setRealPlayers(
          data.map((p) => ({
            id: p.user_id,
            name: p.name || "İsimsiz",
            companyName: p.company_name || "",
            totalEarned: p.total_earned,
            isBot: false,
            isVip: p.is_vip,
            prestigeLevel: p.prestige_level,
          }))
        );
      }
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const id = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(id);
  }, [fetchLeaderboard]);

  return useMemo(() => {
    const others = realPlayers.filter((p) => p.id !== currentUserId);

    const player: LeaderboardEntry = {
      id: "player",
      name: playerName || "Sen",
      companyName: companyName || "Şirket Yok",
      totalEarned,
      isBot: false,
      isVip,
      prestigeLevel,
    };

    const all = [...others, player].sort((a, b) => b.totalEarned - a.totalEarned);
    const playerRank = all.findIndex((e) => e.id === "player") + 1;
    return { entries: all, playerRank };
  }, [period, totalEarned, playerName, companyName, isVip, prestigeLevel, realPlayers, currentUserId]);
}
