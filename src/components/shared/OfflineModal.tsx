import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatTL } from "../../utils/formatTL";

interface Props {
  visible: boolean;
  earnings: number;
  onClose: () => void;
}

export default function OfflineModal({ visible, earnings, onClose }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient
          colors={["#0D1B2A", "#1A2744"]}
          style={styles.card}
        >
          <Text style={styles.icon}>{"🌙"}</Text>
          <Text style={styles.title}>Tekrar Hoş Geldin!</Text>
          <Text style={styles.desc}>Sen yokken işletmelerin çalışmaya devam etti.</Text>
          <View style={styles.earningBox}>
            <Text style={styles.earningLabel}>Kazancın:</Text>
            <Text style={styles.earningValue}>{formatTL(earnings)}</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <LinearGradient colors={["#F4C430", "#D4A420"]} style={styles.btnGrad}>
              <Text style={styles.btnText}>{"💰 Topla!"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F4C43033",
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    color: "#E2E8F0",
    fontSize: 24,
    fontWeight: "bold",
  },
  desc: {
    color: "#A0AEC0",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  earningBox: {
    backgroundColor: "#070D1A",
    borderRadius: 16,
    padding: 16,
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  earningLabel: {
    color: "#A0AEC0",
    fontSize: 13,
  },
  earningValue: {
    color: "#F4C430",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 4,
  },
  btn: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  btnGrad: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 14,
  },
  btnText: {
    color: "#070D1A",
    fontSize: 16,
    fontWeight: "900",
  },
});
