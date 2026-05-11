import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import { BUSINESSES } from "../data/businesses";
import { formatTL } from "../utils/formatTL";
import CategoryBar from "../components/shared/CategoryBar";
import { BUSINESS_CATEGORIES } from "../data/businesses";
import BusinessCard from "../components/business/BusinessCard";

export default function BusinessScreen() {
  const [category, setCategory] = useState("Tümü");
  const hourlyPassiveIncome = useGameStore((s) => s.hourlyPassiveIncome);

  const filtered = useMemo(
    () =>
      category === "Tümü"
        ? BUSINESSES
        : BUSINESSES.filter((b) => b.category === category),
    [category]
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.title}>{"🏢 İşletmelerim"}</Text>
        <Text style={styles.income}>
          Toplam Gelir: {formatTL(hourlyPassiveIncome)}/saat
        </Text>
      </LinearGradient>
      <CategoryBar categories={BUSINESS_CATEGORIES} selected={category} onSelect={setCategory} />
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((biz) => (
          <BusinessCard key={biz.id} business={biz} />
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
  income: {
    color: "#48BB78",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});
