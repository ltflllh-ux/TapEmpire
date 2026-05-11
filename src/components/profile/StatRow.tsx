import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  label: string;
  value: string;
  color?: string;
}

export default function StatRow({ label, value, color }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, color ? { color } : undefined]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1A2744",
  },
  label: {
    color: "#A0AEC0",
    fontSize: 14,
  },
  value: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "bold",
  },
});
