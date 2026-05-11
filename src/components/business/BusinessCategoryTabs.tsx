import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { BUSINESS_CATEGORIES } from "../../data/businesses";

interface Props {
  selected: string;
  onSelect: (cat: string) => void;
}

export default function BusinessCategoryTabs({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {BUSINESS_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.tab, selected === cat && styles.tabActive]}
          onPress={() => onSelect(cat)}
        >
          <Text style={[styles.label, selected === cat && styles.labelActive]}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#1A2744",
  },
  tabActive: {
    backgroundColor: "#F4C430",
  },
  label: {
    color: "#A0AEC0",
    fontSize: 16,
    fontWeight: "600",
  },
  labelActive: {
    color: "#070D1A",
  },
});
