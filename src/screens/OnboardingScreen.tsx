import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const finishOnboarding = useGameStore((s) => s.finishOnboarding);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [step, fadeAnim, slideAnim]);

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      finishOnboarding(name.trim() || "Patron", company.trim() || "TapEmpire A.Ş.");
    }
  };

  return (
    <LinearGradient colors={["#070D1A", "#0D1B2A", "#1A2744"]} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {step === 0 ? (
          <>
            <Text style={styles.logo}>{"💰"}</Text>
            <Text style={styles.title}>TapEmpire</Text>
            <Text style={styles.subtitle}>İmparatorluğunu Kur</Text>
            <Text style={styles.desc}>
              Dokun, kazan, yatırım yap.{"\n"}
              Türkiye'nin en büyük iş imparatorluğunu sen inşa et!
            </Text>
            <TouchableOpacity style={styles.startBtn} onPress={handleNext}>
              <LinearGradient
                colors={["#F4C430", "#D4A420"]}
                style={styles.btnGradient}
              >
                <Text style={styles.startBtnText}>{"🚀 Başla"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.stepIcon}>{"👤"}</Text>
            <Text style={styles.stepTitle}>Kendini Tanıt</Text>
            <TextInput
              style={styles.input}
              placeholder="Adın"
              placeholderTextColor="#4A5568"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Şirket Adı"
              placeholderTextColor="#4A5568"
              value={company}
              onChangeText={setCompany}
            />
            <TouchableOpacity style={styles.startBtn} onPress={handleNext}>
              <LinearGradient
                colors={["#F4C430", "#D4A420"]}
                style={styles.btnGradient}
              >
                <Text style={styles.startBtnText}>{"✅ Hazırım!"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
    width: "100%",
  },
  logo: {
    fontSize: 80,
    marginBottom: 8,
  },
  title: {
    color: "#F4C430",
    fontSize: 42,
    fontWeight: "900",
    textShadowColor: "#F4C43044",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  subtitle: {
    color: "#CBD5E0",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  desc: {
    color: "#A0AEC0",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 32,
  },
  stepIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  stepTitle: {
    color: "#E2E8F0",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#1A2744",
    borderRadius: 14,
    padding: 16,
    color: "#E2E8F0",
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  startBtn: {
    width: "100%",
    marginTop: 10,
    borderRadius: 14,
    overflow: "hidden",
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 14,
  },
  startBtnText: {
    color: "#070D1A",
    fontSize: 18,
    fontWeight: "900",
  },
});
