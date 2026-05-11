import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import CategoryBar from "../components/shared/CategoryBar";
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, TIER_COLORS, TIER_LABELS } from "../data/achievements";
import type { AchievementTier } from "../data/achievements";
import { formatTL } from "../utils/formatTL";

export default function AchievementScreen() {
  const [category, setCategory] = useState("Tümü");
  const store = useGameStore();

  const investmentCount = Object.values(store.ownedInvestments).reduce((a, b) => a + b, 0);
  const businessCount = Object.values(store.ownedBusinesses).filter((v) => v > 0).length;
  const collectibleCount = Object.values(store.ownedCollectibles).filter(Boolean).length;

  const state = {
    totalEarned: store.totalEarned,
    tapLevel: store.tapLevel,
    totalTaps: store.totalTaps,
    investmentCount,
    businessCount,
    collectibleCount,
    taxPaid: store.taxPaid,
    prestigeLevel: store.prestigeLevel,
  };

  const filtered = useMemo(
    () =>
      category === "Tümü"
        ? ACHIEVEMENTS
        : ACHIEVEMENTS.filter((a) => a.category === category),
    [category]
  );

  const totalClaimed = Object.values(store.claimedAchievements).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const totalTiers = ACHIEVEMENTS.reduce((sum, a) => sum + a.tiers.length, 0);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.title}>{"🏆 Başarımlar"}</Text>
        <Text style={styles.count}>{totalClaimed} / {totalTiers} tamamlandı</Text>
      </LinearGradient>

      <CategoryBar categories={ACHIEVEMENT_CATEGORIES} selected={category} onSelect={setCategory} />

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((ach) => {
          const currentVal = ach.getValue(state);
          const claimed = store.claimedAchievements[ach.id] || [];
          return (
            <View key={ach.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.achIcon}>{ach.icon}</Text>
                <View style={styles.achInfo}>
                  <Text style={styles.achName}>{ach.name}</Text>
                  <Text style={styles.achDesc}>{ach.description}</Text>
                </View>
              </View>
              {ach.tiers.map((t) => {
                const isClaimed = claimed.includes(t.tier);
                const canClaim = currentVal >= t.target && !isClaimed;
                const progress = Math.min(currentVal / t.target, 1);
                const color = TIER_COLORS[t.tier as AchievementTier];
                return (
                  <View key={t.tier} style={styles.tierRow}>
                    <View style={[styles.tierDot, { backgroundColor: isClaimed ? color : "#2D3748" }]} />
                    <View style={styles.tierInfo}>
                      <Text style={[styles.tierLabel, { color: isClaimed ? color : "#A0AEC0" }]}>
                        {TIER_LABELS[t.tier as AchievementTier]}
                      </Text>
                      <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
                      </View>
                    </View>
                    {canClaim ? (
                      <TouchableOpacity
                        style={[styles.claimBtn, { borderColor: color }]}
                        onPress={() => store.claimAchievement(ach.id, t.tier)}
                      >
                        <Text style={[styles.claimText, { color }]}>
                          {t.reward > 0 ? formatTL(t.reward) : "Al"}
                        </Text>
                      </TouchableOpacity>
                    ) : isClaimed ? (
                      <Text style={[styles.doneText, { color }]}>{"✅"}</Text>
                    ) : (
                      <Text style={styles.targetText}>
                        {formatTL(currentVal)}/{formatTL(t.target)}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#070D1A" },
  header: { padding: 16, paddingTop: 50, alignItems: "center", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { color: "#E2E8F0", fontSize: 22, fontWeight: "bold" },
  count: { color: "#A0AEC0", fontSize: 13, marginTop: 4 },
  list: { paddingTop: 4, paddingBottom: 20 },
  card: { backgroundColor: "#0D1B2A", borderRadius: 16, padding: 14, marginHorizontal: 12, marginBottom: 10 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  achIcon: { fontSize: 32, marginRight: 10 },
  achInfo: { flex: 1 },
  achName: { color: "#E2E8F0", fontSize: 16, fontWeight: "bold" },
  achDesc: { color: "#A0AEC0", fontSize: 12 },
  tierRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, gap: 8 },
  tierDot: { width: 10, height: 10, borderRadius: 5 },
  tierInfo: { flex: 1 },
  tierLabel: { fontSize: 12, fontWeight: "600", marginBottom: 3 },
  progressBg: { height: 4, backgroundColor: "#2D3748", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: 4, borderRadius: 2 },
  claimBtn: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  claimText: { fontSize: 12, fontWeight: "bold" },
  doneText: { fontSize: 16 },
  targetText: { color: "#4A5568", fontSize: 11 },
});
