import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function SectionCard({ title, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0D1B2A",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  title: {
    color: "#F4C430",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
