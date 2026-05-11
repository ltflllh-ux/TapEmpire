import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Investment, getInvestmentCost } from "../../data/investments";
import { formatTL } from "../../utils/formatTL";
import { useGameStore } from "../../store/useGameStore";
import * as Haptics from "expo-haptics";

interface Props {
  investment: Investment;
}

export default function InvestmentCard({ investment }: Props) {
  const balance = useGameStore((s) => s.balance);
  const tapLevel = useGameStore((s) => s.tapLevel);
  const owned = useGameStore((s) => s.ownedInvestments[investment.id] || 0);
  const buyInvestment = useGameStore((s) => s.buyInvestment);

  const locked = tapLevel < investment.unlockLevel;
  const cost = getInvestmentCost(investment, owned);
  const canAfford = balance >= cost;

  const handleBuy = () => {
    if (locked || !canAfford) return;
    buyInvestment(investment.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (locked) {
    return (
      <View style={[styles.card, styles.cardLocked]}>
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockIcon}>{"🔒"}</Text>
          <Text style={styles.lockText}>Seviye {investment.unlockLevel} gerekli</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.iconText}>{investment.icon}</Text>
          <View style={styles.info}>
            <Text style={[styles.name, styles.textLocked]}>{investment.name}</Text>
            <Text style={[styles.desc, styles.textLocked]}>{investment.description}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.iconText}>{investment.icon}</Text>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{investment.name}</Text>
            {owned > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>x{owned}</Text>
              </View>
            )}
          </View>
          <Text style={styles.desc}>{investment.description}</Text>
          <Text style={styles.income}>
            {"⚡ "}{formatTL(investment.incomePerHour)}/saat
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.buyBtn, !canAfford && styles.buyBtnDisabled]}
        onPress={handleBuy}
        disabled={!canAfford}
      >
        <Text style={[styles.buyText, !canAfford && styles.buyTextDisabled]}>
          {formatTL(cost)}
        </Text>
        <Text style={[styles.buyLabel, !canAfford && styles.buyTextDisabled]}>
          SATIN AL
        </Text>
      </TouchableOpacity>
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
  badge: {
    backgroundColor: "#F4C430",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#070D1A",
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
  buyBtn: {
    backgroundColor: "#1A2744",
    borderWidth: 1.5,
    borderColor: "#F4C430",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
    alignItems: "center",
  },
  buyBtnDisabled: {
    borderColor: "#2D3748",
    backgroundColor: "#111A2E",
  },
  buyText: {
    color: "#F4C430",
    fontSize: 16,
    fontWeight: "bold",
  },
  buyTextDisabled: {
    color: "#4A5568",
  },
  buyLabel: {
    color: "#F4C430",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});
