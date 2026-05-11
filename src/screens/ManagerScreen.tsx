import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { soundManager } from "../engine/SoundManager";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import {
  MANAGERS,
  MANAGER_CATEGORIES,
  RARITY_COLORS,
  RARITY_LABELS,
  Manager,
  Rarity,
} from "../data/managers";
import { BUSINESSES } from "../data/businesses";
import CategoryBar from "../components/shared/CategoryBar";

const CATEGORY_TO_RARITY: Record<string, Rarity | null> = {
  "Normal": "common",
  "Nadir": "rare",
  "Epik": "epic",
  "Efsanevi": "legendary",
};

function ManagerCard({ manager }: { manager: Manager }) {
  const diamonds = useGameStore((s) => s.diamonds);
  const ownedManagers = useGameStore((s) => s.ownedManagers);
  const assignedManagers = useGameStore((s) => s.assignedManagers);
  const ownedBusinesses = useGameStore((s) => s.ownedBusinesses);
  const hireManager = useGameStore((s) => s.hireManager);
  const assignManager = useGameStore((s) => s.assignManager);
  const unassignManager = useGameStore((s) => s.unassignManager);

  const [showAssignModal, setShowAssignModal] = useState(false);

  const isOwned = ownedManagers.includes(manager.id);
  const canAfford = diamonds >= manager.cost;
  const rarityColor = RARITY_COLORS[manager.rarity];
  const rarityLabel = RARITY_LABELS[manager.rarity];

  // Find which business this manager is assigned to
  const assignedBizId = Object.entries(assignedManagers).find(
    ([, mgrId]) => mgrId === manager.id
  )?.[0];
  const assignedBiz = assignedBizId
    ? BUSINESSES.find((b) => b.id === assignedBizId)
    : null;

  // Businesses that the player owns (level > 0) and don't already have a manager
  const availableBusinesses = useMemo(() => {
    return BUSINESSES.filter((b) => {
      const level = ownedBusinesses[b.id] || 0;
      if (level === 0) return false;
      // Already has a different manager assigned
      if (assignedManagers[b.id] && assignedManagers[b.id] !== manager.id) return false;
      return true;
    });
  }, [ownedBusinesses, assignedManagers, manager.id]);

  const handleHire = useCallback(() => {
    if (!canAfford) return;
    const confirmHire = () => {
      hireManager(manager.id);
      soundManager.playPurchase();
    };
    if (Platform.OS === "web") {
      if (
        window.confirm(
          `${manager.name} adli yoneticiyi ${manager.cost} elmasa ise almak istiyor musun?`
        )
      ) {
        confirmHire();
      }
    } else {
      Alert.alert(
        "Yonetici Ise Al",
        `${manager.name} adli yoneticiyi ${manager.cost} elmasa ise almak istiyor musun?`,
        [
          { text: "Iptal", style: "cancel" },
          { text: "Ise Al", onPress: confirmHire },
        ]
      );
    }
  }, [canAfford, hireManager, manager]);

  const handleAssign = useCallback(
    (businessId: string) => {
      assignManager(manager.id, businessId);
      setShowAssignModal(false);
    },
    [assignManager, manager.id]
  );

  const handleUnassign = useCallback(() => {
    unassignManager(manager.id);
  }, [unassignManager, manager.id]);

  return (
    <View
      style={[
        styles.card,
        isOwned && { borderWidth: 1.5, borderColor: "#48BB78" },
        !isOwned && { opacity: 0.7 },
      ]}
    >
      {/* Rarity badge */}
      <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
        <Text style={styles.rarityText}>{rarityLabel}</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardIcon}>{manager.icon}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{manager.name}</Text>
          <Text style={styles.cardTitle}>{manager.title}</Text>
          <Text style={styles.cardDesc}>{manager.description}</Text>
        </View>
      </View>

      {!isOwned && (
        <TouchableOpacity
          style={[styles.hireBtn, !canAfford && styles.hireBtnDisabled]}
          onPress={handleHire}
          disabled={!canAfford}
        >
          <Text
            style={[
              styles.hireBtnText,
              !canAfford && styles.hireBtnTextDisabled,
            ]}
          >
            {"ISE AL"} — {"💎"} {manager.cost}
          </Text>
        </TouchableOpacity>
      )}

      {isOwned && !assignedBiz && (
        <TouchableOpacity
          style={styles.assignBtn}
          onPress={() => setShowAssignModal(true)}
        >
          <Text style={styles.assignBtnText}>{"ATA"}</Text>
        </TouchableOpacity>
      )}

      {isOwned && assignedBiz && (
        <View style={styles.assignedRow}>
          <View style={styles.assignedInfo}>
            <Text style={styles.assignedIcon}>{assignedBiz.icon}</Text>
            <Text style={styles.assignedText}>{assignedBiz.name}</Text>
          </View>
          <TouchableOpacity style={styles.removeBtn} onPress={handleUnassign}>
            <Text style={styles.removeBtnText}>{"KALDIR"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Business selection modal */}
      <Modal
        visible={showAssignModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{"Isletme Sec"}</Text>
            {availableBusinesses.length === 0 ? (
              <Text style={styles.modalEmpty}>
                {"Atanabilecek isletme yok. Once bir isletme satin al!"}
              </Text>
            ) : (
              <FlatList
                data={availableBusinesses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const hasManager = assignedManagers[item.id];
                  return (
                    <TouchableOpacity
                      style={[
                        styles.bizOption,
                        hasManager && styles.bizOptionDisabled,
                      ]}
                      onPress={() => !hasManager && handleAssign(item.id)}
                      disabled={!!hasManager}
                    >
                      <Text style={styles.bizOptionIcon}>{item.icon}</Text>
                      <Text style={styles.bizOptionName}>{item.name}</Text>
                      {hasManager && (
                        <Text style={styles.bizOptionTaken}>
                          {"(Yonetici var)"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowAssignModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>{"KAPAT"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function ManagerScreen() {
  const [category, setCategory] = useState("Tumu");
  const diamonds = useGameStore((s) => s.diamonds);
  const ownedManagers = useGameStore((s) => s.ownedManagers);

  const filtered = useMemo(() => {
    if (category === "Tumu") return MANAGERS;
    const rarity = CATEGORY_TO_RARITY[category];
    if (!rarity) return MANAGERS;
    return MANAGERS.filter((m) => m.rarity === rarity);
  }, [category]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.title}>{"👔 Yoneticiler"}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>{"💎"}</Text>
            <Text style={styles.statValue}>{diamonds}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>{"👔"}</Text>
            <Text style={styles.statValue}>
              {ownedManagers.length}/{MANAGERS.length}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <CategoryBar
        categories={MANAGER_CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((manager) => (
          <ManagerCard key={manager.id} manager={manager} />
        ))}
      </ScrollView>
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
  },
  title: {
    color: "#E2E8F0",
    fontSize: 22,
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#070D1A44",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    color: "#63B3ED",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#0D1B2A",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 10,
    position: "relative",
  },
  rarityBadge: {
    position: "absolute",
    top: -1,
    right: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    zIndex: 1,
  },
  rarityText: {
    color: "#070D1A",
    fontSize: 10,
    fontWeight: "900",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardTitle: {
    color: "#A0AEC0",
    fontSize: 13,
    marginTop: 1,
  },
  cardDesc: {
    color: "#48BB78",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  hireBtn: {
    backgroundColor: "#1A2744",
    borderWidth: 1.5,
    borderColor: "#63B3ED",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: "center",
  },
  hireBtnDisabled: {
    borderColor: "#2D3748",
    backgroundColor: "#111A2E",
  },
  hireBtnText: {
    color: "#63B3ED",
    fontSize: 14,
    fontWeight: "bold",
  },
  hireBtnTextDisabled: {
    color: "#4A5568",
  },
  assignBtn: {
    backgroundColor: "#1A2744",
    borderWidth: 1.5,
    borderColor: "#F4C430",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: "center",
  },
  assignBtnText: {
    color: "#F4C430",
    fontSize: 14,
    fontWeight: "bold",
  },
  assignedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A2744",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  assignedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  assignedIcon: {
    fontSize: 20,
  },
  assignedText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
  removeBtn: {
    backgroundColor: "#E5393522",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeBtnText: {
    color: "#E53935",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#0D1B2A",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "#1A2744",
  },
  modalTitle: {
    color: "#E2E8F0",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  modalEmpty: {
    color: "#A0AEC0",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  bizOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A2744",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  bizOptionDisabled: {
    opacity: 0.4,
  },
  bizOptionIcon: {
    fontSize: 24,
  },
  bizOptionName: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  bizOptionTaken: {
    color: "#A0AEC0",
    fontSize: 11,
  },
  modalCloseBtn: {
    backgroundColor: "#2D3748",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: "#A0AEC0",
    fontSize: 14,
    fontWeight: "bold",
  },
});
