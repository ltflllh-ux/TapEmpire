import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  navigation: any;
}

const MENU_ITEMS = [
  { key: "Collection", icon: "💎", label: "Koleksiyon", desc: "Nadir eşyalar ve bonuslar" },
  { key: "Achievement", icon: "🏆", label: "Başarımlar", desc: "Hedefler ve ödüller" },
  { key: "Profile", icon: "👤", label: "Profil & Ayarlar", desc: "İstatistikler, prestige, vergi" },
];

export default function MoreScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.title}>{"📋 Daha Fazla"}</Text>
      </LinearGradient>

      <View style={styles.list}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.card}
            onPress={() => navigation.navigate(item.key)}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.arrow}>{"›"}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  list: {
    paddingTop: 16,
    paddingHorizontal: 12,
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1B2A",
    borderRadius: 14,
    padding: 16,
  },
  cardIcon: { fontSize: 32, marginRight: 14 },
  cardInfo: { flex: 1 },
  cardLabel: { color: "#E2E8F0", fontSize: 16, fontWeight: "bold" },
  cardDesc: { color: "#A0AEC0", fontSize: 12, marginTop: 2 },
  arrow: { color: "#4A5568", fontSize: 28, fontWeight: "300" },
});
