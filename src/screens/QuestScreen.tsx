import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import { soundManager } from "../engine/SoundManager";
import { getActiveQuests } from "../data/quests";
import type { Quest } from "../data/quests";

function getDaySeed(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  return year * 10000 + month * 100 + day;
}

function formatReward(quest: Quest): string {
  if (quest.reward.type === "diamonds") {
    return `${quest.reward.amount} 💎`;
  }
  return `₺${quest.reward.amount.toLocaleString("tr-TR")}`;
}

export default function QuestScreen() {
  const store = useGameStore();

  const daySeed = getDaySeed();
  const activeQuests = useMemo(() => getActiveQuests(daySeed), [daySeed]);

  const dailyQuests = activeQuests.filter((q) => q.type === "daily");
  const weeklyQuests = activeQuests.filter((q) => q.type === "weekly");

  const totalQuests = activeQuests.length;
  const completedCount = activeQuests.filter(
    (q) => store.claimedQuests.includes(q.id)
  ).length;

  // Check for resets when screen opens
  React.useEffect(() => {
    store.checkQuestReset();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0D1B2A", "#1A2744"]}
        style={styles.header}
      >
        <Text style={styles.title}>{"📜 Görevler"}</Text>
        <Text style={styles.subtitle}>
          {completedCount} / {totalQuests} tamamlandı
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Daily Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>{"☀️"}</Text>
          <Text style={styles.sectionTitle}>Günlük Görevler</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>
              {dailyQuests.filter((q) => store.claimedQuests.includes(q.id)).length}/{dailyQuests.length}
            </Text>
          </View>
        </View>

        {dailyQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}

        {/* Weekly Section */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={styles.sectionIcon}>{"📅"}</Text>
          <Text style={styles.sectionTitle}>Haftalık Görevler</Text>
          <View style={[styles.sectionBadge, { backgroundColor: "#2B6CB0" }]}>
            <Text style={styles.sectionBadgeText}>
              {weeklyQuests.filter((q) => store.claimedQuests.includes(q.id)).length}/{weeklyQuests.length}
            </Text>
          </View>
        </View>

        {weeklyQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function QuestCard({ quest }: { quest: Quest }) {
  const store = useGameStore();
  const progress = store.questProgress[quest.id] || 0;
  const isClaimed = store.claimedQuests.includes(quest.id);
  const isComplete = progress >= quest.target;
  const canClaim = isComplete && !isClaimed;
  const progressRatio = Math.min(progress / quest.target, 1);

  return (
    <View
      style={[
        styles.card,
        isClaimed && styles.cardClaimed,
      ]}
    >
      <View style={styles.cardRow}>
        <Text style={styles.questIcon}>{quest.icon}</Text>

        <View style={styles.questInfo}>
          <Text style={[styles.questName, isClaimed && styles.questNameClaimed]}>
            {quest.name}
          </Text>
          <Text style={styles.questDesc}>{quest.description}</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={
                  isClaimed
                    ? ["#48BB78", "#38A169"]
                    : isComplete
                    ? ["#F4C430", "#D4A017"]
                    : ["#4A5568", "#2D3748"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  { width: `${progressRatio * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {progress >= quest.target ? quest.target : progress} / {quest.target}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {/* Reward display */}
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardText}>{formatReward(quest)}</Text>
          </View>

          {/* Action button / status */}
          {isClaimed ? (
            <View style={styles.claimedBadge}>
              <Text style={styles.claimedIcon}>{"✅"}</Text>
            </View>
          ) : canClaim ? (
            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => { store.claimQuestReward(quest.id); soundManager.playWheelWin(); }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#F4C430", "#D4A017"]}
                style={styles.claimGradient}
              >
                <Text style={styles.claimButtonText}>Ödül Al</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.lockedBadge}>
              <Text style={styles.lockedIcon}>{"🔒"}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070D1A",
  },
  header: {
    padding: 16,
    paddingTop: 50,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: "#E2E8F0",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#A0AEC0",
    fontSize: 13,
    marginTop: 4,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 20,
  },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    color: "#E2E8F0",
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: "#D69E2E",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sectionBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Quest card
  card: {
    backgroundColor: "#0D1B2A",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1A2744",
  },
  cardClaimed: {
    borderColor: "#2F855A",
    opacity: 0.7,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  questIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  questInfo: {
    flex: 1,
  },
  questName: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "bold",
  },
  questNameClaimed: {
    color: "#48BB78",
    textDecorationLine: "line-through",
  },
  questDesc: {
    color: "#A0AEC0",
    fontSize: 12,
    marginTop: 2,
  },

  // Progress bar
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#2D3748",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    color: "#A0AEC0",
    fontSize: 11,
    minWidth: 60,
    textAlign: "right",
  },

  // Right section
  rightSection: {
    alignItems: "center",
    marginLeft: 10,
    gap: 6,
  },
  rewardBadge: {
    backgroundColor: "#1A2744",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rewardText: {
    color: "#F4C430",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Claim button
  claimButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  claimGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  claimButtonText: {
    color: "#1A202C",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Status badges
  claimedBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  claimedIcon: {
    fontSize: 20,
  },
  lockedBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  lockedIcon: {
    fontSize: 16,
    opacity: 0.5,
  },
});
