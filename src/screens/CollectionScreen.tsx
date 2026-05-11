import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import { COLLECTIBLES } from "../data/collections";
import CategoryBar from "../components/shared/CategoryBar";
import { COLLECTION_CATEGORIES } from "../data/collections";
import CollectionCard from "../components/collection/CollectionCard";

export default function CollectionScreen() {
  const [category, setCategory] = useState("Tümü");
  const ownedCollectibles = useGameStore((s) => s.ownedCollectibles);
  const tapBoost = useGameStore((s) => s.collectibleTapBoost);
  const passiveBoost = useGameStore((s) => s.collectiblePassiveBoost);

  const ownedCount = Object.keys(ownedCollectibles).filter(
    (k) => ownedCollectibles[k]
  ).length;

  const filtered = useMemo(
    () =>
      category === "Tümü"
        ? COLLECTIBLES
        : COLLECTIBLES.filter((c) => c.category === category),
    [category]
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.title}>{"💎 Koleksiyonum"}</Text>
        <Text style={styles.count}>
          {ownedCount} / {COLLECTIBLES.length} eşya
        </Text>
        <View style={styles.boostRow}>
          {tapBoost > 0 && (
            <View style={styles.boostTag}>
              <Text style={styles.boostText}>{"👆"} Tap +{tapBoost}%</Text>
            </View>
          )}
          {passiveBoost > 0 && (
            <View style={styles.boostTag}>
              <Text style={styles.boostText}>{"⚡"} Pasif +{passiveBoost}%</Text>
            </View>
          )}
          {tapBoost === 0 && passiveBoost === 0 && (
            <Text style={styles.noBoost}>Henüz bonus yok</Text>
          )}
        </View>
      </LinearGradient>
      <CategoryBar categories={COLLECTION_CATEGORIES} selected={category} onSelect={setCategory} />
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((item) => (
          <CollectionCard key={item.id} item={item} />
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
    backgroundColor: "#0D1B2A",
    padding: 16,
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    color: "#E2E8F0",
    fontSize: 22,
    fontWeight: "bold",
  },
  count: {
    color: "#A0AEC0",
    fontSize: 14,
    marginTop: 4,
  },
  boostRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  boostTag: {
    backgroundColor: "#1A2744",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  boostText: {
    color: "#48BB78",
    fontSize: 13,
    fontWeight: "bold",
  },
  noBoost: {
    color: "#4A5568",
    fontSize: 13,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});
