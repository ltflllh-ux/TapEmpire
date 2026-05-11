import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import { INVESTMENTS } from "../data/investments";
import { formatTL } from "../utils/formatTL";
import CategoryBar from "../components/shared/CategoryBar";
import { INVESTMENT_CATEGORIES } from "../data/investments";
import InvestmentCard from "../components/investment/InvestmentCard";

export default function InvestmentScreen() {
  const [category, setCategory] = useState("Tümü");
  const hourlyPassiveIncome = useGameStore((s) => s.hourlyPassiveIncome);

  const filtered = useMemo(
    () =>
      category === "Tümü"
        ? INVESTMENTS
        : INVESTMENTS.filter((i) => i.category === category),
    [category]
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.title}>{"📈 Yatırımlarım"}</Text>
        <Text style={styles.income}>
          Pasif Gelir: {formatTL(hourlyPassiveIncome)}/saat
        </Text>
      </LinearGradient>
      <CategoryBar categories={INVESTMENT_CATEGORIES} selected={category} onSelect={setCategory} />
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((inv) => (
          <InvestmentCard key={inv.id} investment={inv} />
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
