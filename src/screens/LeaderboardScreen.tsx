import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { LeaderboardPeriod, LeaderboardEntry } from "../data/leaderboard";
import { formatTL } from "../utils/formatTL";
import CategoryBar from "../components/shared/CategoryBar";

const PERIOD_LABELS = ["Günlük", "Haftalık", "Tüm Zamanlar"];
const PERIOD_MAP: Record<string, LeaderboardPeriod> = {
  "Günlük": "daily",
  "Haftalık": "weekly",
  "Tüm Zamanlar": "allTime",
};

const RANK_COLORS: Record<number, string> = {
  1: "#F4C430",
  2: "#C0C0C0",
  3: "#CD7F32",
};

const RANK_ICONS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

function LeaderboardRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const isPlayer = !entry.isBot;
  const isTop3 = rank <= 3;
  const rankColor = RANK_COLORS[rank] ?? "#A0AEC0";

  return (
    <View style={[styles.row, isPlayer && styles.playerRow, isTop3 && styles.topRow]}>
      <View style={styles.rankCol}>
        {isTop3 ? (
          <Text style={styles.rankIcon}>{RANK_ICONS[rank]}</Text>
        ) : (
          <Text style={[styles.rankNum, { color: rankColor }]}>#{rank}</Text>
        )}
      </View>
      <View style={styles.infoCol}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, isPlayer && styles.playerName]} numberOfLines={1}>
            {entry.name}
          </Text>
          {entry.isVip && <Text style={styles.vipBadge}>{"👑"}</Text>}
          {entry.prestigeLevel > 0 && (
            <View style={styles.pBadge}>
              <Text style={styles.pText}>P{entry.prestigeLevel}</Text>
            </View>
          )}
        </View>
        <Text style={styles.company} numberOfLines={1}>{entry.companyName}</Text>
      </View>
      <Text style={[styles.earned, isTop3 && { color: rankColor }]}>
        {formatTL(entry.totalEarned)}
      </Text>
    </View>
  );
}

export default function LeaderboardScreen() {
  const [periodLabel, setPeriodLabel] = useState("Günlük");
  const period = PERIOD_MAP[periodLabel];
  const { entries, playerRank } = useLeaderboard(period);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.title}>{"🏆 Skor Tablosu"}</Text>
        <View style={styles.rankBox}>
          <Text style={styles.rankLabel}>Sıralaman</Text>
          <Text style={styles.rankValue}>#{playerRank}</Text>
        </View>
      </LinearGradient>

      <CategoryBar categories={PERIOD_LABELS} selected={periodLabel} onSelect={setPeriodLabel} />

      <FlatList
        data={entries.slice(0, 100)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <LeaderboardRow entry={item} rank={index + 1} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#070D1A" },
  header: {
    padding: 16,
    paddingTop: 50,
    alignItems: "center",
  },
  title: { color: "#E2E8F0", fontSize: 22, fontWeight: "bold" },
  rankBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    backgroundColor: "#070D1A44",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  rankLabel: { color: "#A0AEC0", fontSize: 14 },
  rankValue: { color: "#F4C430", fontSize: 20, fontWeight: "900" },
  list: { paddingTop: 4, paddingBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginBottom: 4,
    borderRadius: 12,
    backgroundColor: "#0D1B2A",
  },
  playerRow: {
    borderWidth: 1.5,
    borderColor: "#F4C430",
    backgroundColor: "#F4C43010",
  },
  topRow: {
    backgroundColor: "#0D1B2A",
    marginBottom: 6,
  },
  rankCol: {
    width: 40,
    alignItems: "center",
  },
  rankIcon: { fontSize: 22 },
  rankNum: { fontSize: 14, fontWeight: "bold" },
  infoCol: { flex: 1, marginLeft: 8 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { color: "#E2E8F0", fontSize: 14, fontWeight: "bold", maxWidth: 120 },
  playerName: { color: "#F4C430" },
  vipBadge: { fontSize: 14 },
  pBadge: {
    backgroundColor: "#9F7AEA33",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  pText: { color: "#9F7AEA", fontSize: 10, fontWeight: "bold" },
  company: { color: "#4A5568", fontSize: 11, marginTop: 1 },
  earned: { color: "#48BB78", fontSize: 14, fontWeight: "bold" },
});
