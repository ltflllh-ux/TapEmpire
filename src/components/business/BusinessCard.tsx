import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Business, getBusinessUpgradeCost, getBusinessIncome } from "../../data/businesses";
import { formatTL } from "../../utils/formatTL";
import { useGameStore } from "../../store/useGameStore";
import * as Haptics from "expo-haptics";

interface Props {
  business: Business;
}

export default function BusinessCard({ business }: Props) {
  const balance = useGameStore((s) => s.balance);
  const tapLevel = useGameStore((s) => s.tapLevel);
  const level = useGameStore((s) => s.ownedBusinesses[business.id] || 0);
  const upgradeBusiness = useGameStore((s) => s.upgradeBusiness);

  const locked = tapLevel < business.unlockTapLevel;
  const isMaxLevel = level >= business.maxLevel;
  const cost = getBusinessUpgradeCost(business, level);
  const canAfford = balance >= cost;
  const incomePerSec = getBusinessIncome(business, level);
  const incomePerHour = incomePerSec * 3600;

  const handleUpgrade = () => {
    if (locked || isMaxLevel || !canAfford) return;
    upgradeBusiness(business.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (locked) {
    return (
      <View style={[styles.card, styles.cardLocked]}>
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockIcon}>{"🔒"}</Text>
          <Text style={styles.lockText}>Seviye {business.unlockTapLevel} gerekli</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.iconText}>{business.icon}</Text>
          <View style={styles.info}>
            <Text style={[styles.name, styles.textLocked]}>{business.name}</Text>
            <Text style={[styles.desc, styles.textLocked]}>{business.description}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.iconText}>{business.icon}</Text>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{business.name}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.{level}</Text>
            </View>
          </View>
          <Text style={styles.desc}>{business.description}</Text>
          {level > 0 && (
            <Text style={styles.income}>
              {"⚡ "}{formatTL(incomePerHour)}/saat
            </Text>
          )}
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${(level / business.maxLevel) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {level}/{business.maxLevel}
        </Text>
      </View>

      {isMaxLevel ? (
        <View style={styles.maxBtn}>
          <Text style={styles.maxText}>{"MAX SEVİYE 🏆"}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.upgradeBtn, !canAfford && styles.upgradeBtnDisabled]}
          onPress={handleUpgrade}
          disabled={!canAfford}
        >
          <Text style={[styles.upgradeText, !canAfford && styles.upgradeTextDisabled]}>
            {level === 0 ? "SATIN AL" : "YÜKSELT"} — {formatTL(cost)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0D1B2A",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  cardLocked: {
    opacity: 0.5,
  },
  lockedOverlay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  lockIcon: {
    fontSize: 14,
  },
  lockText: {
    color: "#A0AEC0",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    fontSize: 36,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "bold",
  },
  textLocked: {
    color: "#4A5568",
  },
  levelBadge: {
    backgroundColor: "#2D3748",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  levelText: {
    color: "#A0AEC0",
    fontSize: 12,
    fontWeight: "bold",
  },
  desc: {
    color: "#A0AEC0",
    fontSize: 12,
    marginTop: 2,
  },
  income: {
    color: "#48BB78",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
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
    backgroundColor: "#F4C430",
    borderRadius: 3,
  },
  progressText: {
    color: "#A0AEC0",
    fontSize: 11,
    width: 45,
    textAlign: "right",
  },
  upgradeBtn: {
    backgroundColor: "#1A2744",
    borderWidth: 1.5,
    borderColor: "#F4C430",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: "center",
  },
  upgradeBtnDisabled: {
    borderColor: "#2D3748",
    backgroundColor: "#111A2E",
  },
  upgradeText: {
    color: "#F4C430",
    fontSize: 14,
    fontWeight: "bold",
  },
  upgradeTextDisabled: {
    color: "#4A5568",
  },
  maxBtn: {
    backgroundColor: "#1A2744",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: "center",
  },
  maxText: {
    color: "#F4C430",
    fontSize: 14,
    fontWeight: "bold",
  },
});
