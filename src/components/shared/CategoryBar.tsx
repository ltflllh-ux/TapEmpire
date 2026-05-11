import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";

interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export default function CategoryBar({ categories, selected, onSelect }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((cat) => {
          const isActive = selected === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onSelect(cat)}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {cat}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#0B1524",
    borderBottomWidth: 1,
    borderBottomColor: "#1A2744",
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabActive: {
    backgroundColor: "#1A274422",
  },
  label: {
    color: "#4A5568",
    fontSize: 14,
    fontWeight: "700",
  },
  labelActive: {
    color: "#F4C430",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: "#F4C430",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
