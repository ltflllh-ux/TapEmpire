import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../lib/supabase";

interface Props {
  onAuth: (userId: string) => void;
}

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email ve şifre gerekli");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (authError) {
        setError(authError.message === "Invalid login credentials"
          ? "Email veya şifre hatalı"
          : authError.message);
        return;
      }
      if (data.user) {
        onAuth(data.user.id);
      }
    } catch (e: any) {
      setError(e.message || "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !username.trim()) {
      setError("Tüm alanlar gerekli");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: { username: username.trim() },
        },
      });
      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Bu email zaten kayıtlı");
        } else {
          setError(authError.message);
        }
        return;
      }
      if (data.user) {
        await supabase.from("players").upsert({
          user_id: data.user.id,
          name: username.trim(),
          company_name: "",
          total_earned: 0,
          prestige_level: 0,
          is_vip: false,
          tap_level: 1,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        onAuth(data.user.id);
      }
    } catch (e: any) {
      setError(e.message || "Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#070D1A", "#0A1628", "#070D1A"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>{"🏦"}</Text>
          <Text style={styles.title}>TapEmpire</Text>
          <Text style={styles.subtitle}>
            {mode === "login" ? "Hesabına giriş yap" : "Yeni hesap oluştur"}
          </Text>

          <View style={styles.card}>
            {mode === "register" && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kullanıcı Adı</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Oyuncu adın"
                  placeholderTextColor="#4A5568"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor="#4A5568"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <TextInput
                style={styles.input}
                placeholder="En az 6 karakter"
                placeholderTextColor="#4A5568"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error !== "" && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{"⚠️ "}{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.mainBtn, loading && styles.mainBtnDisabled]}
              onPress={mode === "login" ? handleLogin : handleRegister}
              disabled={loading}
            >
              <LinearGradient colors={["#F4C430", "#D4A420"]} style={styles.mainBtnGrad}>
                {loading ? (
                  <ActivityIndicator color="#070D1A" />
                ) : (
                  <Text style={styles.mainBtnText}>
                    {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              <Text style={styles.switchText}>
                {mode === "login"
                  ? "Hesabın yok mu? Kayıt ol"
                  : "Zaten hesabın var mı? Giriş yap"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logo: { fontSize: 64, textAlign: "center", marginBottom: 8 },
  title: {
    color: "#F4C430",
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "#F4C43055",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: "#A0AEC0",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#0D1B2A",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1A2744",
  },
  inputGroup: { marginBottom: 16 },
  label: {
    color: "#CBD5E0",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1A2744",
    borderRadius: 12,
    padding: 14,
    color: "#E2E8F0",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  errorBox: {
    backgroundColor: "#FC818122",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: "#FC8181",
    fontSize: 13,
    fontWeight: "600",
  },
  mainBtn: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },
  mainBtnDisabled: { opacity: 0.7 },
  mainBtnGrad: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 14,
  },
  mainBtnText: {
    color: "#070D1A",
    fontSize: 17,
    fontWeight: "900",
  },
  switchBtn: {
    marginTop: 16,
    alignItems: "center",
  },
  switchText: {
    color: "#63B3ED",
    fontSize: 14,
    fontWeight: "600",
  },
});
