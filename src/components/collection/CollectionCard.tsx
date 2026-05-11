import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Collectible, RARITY_COLORS } from "../../data/collections";
import { formatTL } from "../../utils/formatTL";
import { useGameStore } from "../../store/useGameStore";
import * as Haptics from "expo-haptics";

interface Props {
  item: Collectible;
}

export default function CollectionCard({ item }: Props) {
  const balance = useGameStore((s) => s.balance);
  const tapLevel = useGameStore((s) => s.tapLevel);
  const owned = useGameStore((s) => !!s.ownedCollectibles[item.id]);
  const buyCollectible = useGameStore((s) => s.buyCollectible);

  const locked = tapLevel < item.unlockLevel;
  const canAfford = balance >= item.cost;
  const rarityColor = RARITY_COLORS[item.rarity];

  const handleBuy = () => {
    if (locked || owned || !canAfford) return;
    buyCollectible(item.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (locked) {
    return (
      <View style={[styles.card, styles.cardLocked]}>
        <View style={styles.lockedRow}>
          <Text style={styles.lockIcon}>{"🔒"}</Text>
          <Text style={styles.lockText}>Seviye {item.unlockLevel} gerekli</Text>
        </View>
        <View style={styles.topRow}>
          <Text style={styles.iconText}>{item.icon}</Text>
          <View style={styles.info}>
            <Text style={[styles.name, styles.textLocked]}>{item.name}</Text>
            <Text style={[styles.desc, styles.textLocked]}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, owned && { borderColor: rarityColor, borderWidth: 1.5 }]}>
      <View style={styles.topRow}>
        <Text style={styles.iconText}>{item.icon}</Text>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {owned && <Text style={styles.ownedBadge}>{"✅"}</Text>}
          </View>
          <View style={[styles.rarityBadge, { backgroundColor: rarityColor + "22", borderColor: rarityColor }]}>
            <Text style={[styles.rarityText, { color: rarityColor }]}>{item.rarity}</Text>
          </View>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.boostRow}>
        {item.tapBoostPercent > 0 && (
          <View style={styles.boostTag}>
            <Text style={styles.boostText}>{"👆"} Tap +{item.tapBoostPercent}%</Text>
          </View>
        )}
        {item.passiveBoostPercent > 0 && (
          <View style={styles.boostTag}>
            <Text style={styles.boostText}>{"⚡"} Pasif +{item.passiveBoostPercent}%</Text>
          </View>
        )}
      </View>

      {owned ? (
        <View style={styles.ownedBtn}>
          <Text style={styles.ownedText}>{"SAHİBİNDE ✨"}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.buyBtn, !canAfford && styles.buyBtnDisabled]}
          onPress={handleBuy}
          disabled={!canAfford}
        >
          <Text style={[styles.buyText, !canAfford && styles.buyTextDisabled]}>
            {formatTL(item.cost)}
          </Text>
          <Text style={[styles.buyLabel, !canAfford && styles.buyTextDisabled]}>
            SATIN AL
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
  lockedRow: {
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    fontSize: 40,
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
  ownedBadge: {
    fontSize: 16,
  },
  rarityBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  rarityText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  desc: {
    color: "#A0AEC0",
    fontSize: 12,
    marginTop: 4,
  },
  boostRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  boostTag: {
    backgroundColor: "#1A2744",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  boostText: {
    color: "#48BB78",
    fontSize: 13,
    fontWeight: "600",
  },
  ownedBtn: {
    backgroundColor: "#1A2744",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: "center",
  },
  ownedText: {
    color: "#48BB78",
    fontSize: 14,
    fontWeight: "bold",
  },
  buyBtn: {
    backgroundColor: "#1A2744",
    borderWidth: 1.5,
    borderColor: "#F4C430",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
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
