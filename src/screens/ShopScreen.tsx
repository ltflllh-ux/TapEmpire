import React, { useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import { SHOP_ITEMS, SHOP_CATEGORIES, ShopItem } from "../data/shopItems";
import { formatTL } from "../utils/formatTL";
import CategoryBar from "../components/shared/CategoryBar";
import { soundManager } from "../engine/SoundManager";

function ShopCard({ item, onBuy }: { item: ShopItem; onBuy: (id: string) => void }) {
  return (
    <View style={styles.card}>
      {item.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>EN POPÜLER</Text>
        </View>
      )}
      {item.bestValue && (
        <View style={[styles.popularBadge, styles.bestBadge]}>
          <Text style={styles.popularText}>EN AVANTAJLI</Text>
        </View>
      )}
      <View style={styles.cardRow}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.buyBtn} onPress={() => onBuy(item.id)}>
        <LinearGradient colors={["#F4C430", "#D4A420"]} style={styles.buyGrad}>
          <Text style={styles.buyText}>{item.price}</Text>
          <Text style={styles.buyLabel}>SATIN AL</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function ShopScreen() {
  const [category, setCategory] = useState("Tümü");
  const diamonds = useGameStore((s) => s.diamonds);
  const isVip = useGameStore((s) => s.isVip);
  const vipEndTime = useGameStore((s) => s.vipEndTime);
  const purchaseShopItem = useGameStore((s) => s.purchaseShopItem);

  const filtered = useMemo(() => {
    if (category === "Tümü") return SHOP_ITEMS;
    const catMap: Record<string, string> = { "VIP": "vip", "Elmas": "diamonds", "Altın": "coins" };
    return SHOP_ITEMS.filter((i) => i.category === catMap[category]);
  }, [category]);

  const handleBuy = useCallback((id: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === id);
    if (!item) return;
    const confirm = () => {
      purchaseShopItem(id);
      soundManager.playPurchase();
    };
    if (Platform.OS === "web") {
      if (window.confirm(`${item.name} satın almak istiyor musun? (${item.price} — Demo mod)`)) {
        confirm();
      }
    } else {
      Alert.alert(
        "Satın Al",
        `${item.name} satın almak istiyor musun?\n${item.price} (Demo mod)`,
        [
          { text: "İptal", style: "cancel" },
          { text: "Satın Al", onPress: confirm },
        ]
      );
    }
  }, [purchaseShopItem]);

  const vipDaysLeft = isVip ? Math.max(0, Math.ceil((vipEndTime - Date.now()) / 86400000)) : 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.title}>{"🛒 Market"}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>{"💎"}</Text>
            <Text style={styles.statValue}>{diamonds}</Text>
          </View>
          {isVip && (
            <View style={[styles.statBox, styles.vipBox]}>
              <Text style={styles.statIcon}>{"👑"}</Text>
              <Text style={styles.vipLabel}>VIP — {vipDaysLeft} gün</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <CategoryBar categories={SHOP_CATEGORIES} selected={category} onSelect={setCategory} />

      {isVip && category === "Tümü" && (
        <View style={styles.vipBanner}>
          <Text style={styles.vipBannerIcon}>{"👑"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.vipBannerTitle}>VIP Aktif!</Text>
            <Text style={styles.vipBannerDesc}>2x kazanç, timer yok, {vipDaysLeft} gün kaldı</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((item) => (
          <ShopCard key={item.id} item={item} onBuy={handleBuy} />
        ))}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            {"⚠️ Demo mod: Gerçek ödeme yapılmaz. Satın alımlar simüle edilir."}
          </Text>
        </View>
      </ScrollView>
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
  vipBox: {
    borderWidth: 1,
    borderColor: "#F4C430",
    backgroundColor: "#F4C43022",
  },
  statIcon: { fontSize: 18 },
  statValue: { color: "#63B3ED", fontSize: 16, fontWeight: "bold" },
  vipLabel: { color: "#F4C430", fontSize: 14, fontWeight: "bold" },
  vipBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4C43015",
    borderWidth: 1,
    borderColor: "#F4C43044",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 12,
    marginTop: 10,
    gap: 12,
  },
  vipBannerIcon: { fontSize: 32 },
  vipBannerTitle: { color: "#F4C430", fontSize: 16, fontWeight: "bold" },
  vipBannerDesc: { color: "#A0AEC0", fontSize: 12, marginTop: 2 },
  list: { paddingTop: 8, paddingBottom: 20 },
  card: {
    backgroundColor: "#0D1B2A",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  popularBadge: {
    position: "absolute",
    top: -1,
    right: 12,
    backgroundColor: "#48BB78",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    zIndex: 1,
  },
  bestBadge: {
    backgroundColor: "#F4C430",
  },
  popularText: {
    color: "#070D1A",
    fontSize: 10,
    fontWeight: "900",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: { fontSize: 36, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { color: "#E2E8F0", fontSize: 16, fontWeight: "bold" },
  cardDesc: { color: "#A0AEC0", fontSize: 13, marginTop: 2 },
  buyBtn: {
    marginTop: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  buyGrad: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  buyText: {
    color: "#070D1A",
    fontSize: 16,
    fontWeight: "900",
  },
  buyLabel: {
    color: "#070D1A88",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 1,
  },
  disclaimer: {
    padding: 20,
    alignItems: "center",
  },
  disclaimerText: {
    color: "#4A5568",
    fontSize: 12,
    textAlign: "center",
  },
});
