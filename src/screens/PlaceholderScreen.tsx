import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  icon: string;
}

export default function PlaceholderScreen({ title, icon }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>Yakında: {title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070D1A",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  text: {
    color: "#CBD5E0",
    fontSize: 20,
    fontWeight: "600",
  },
});
