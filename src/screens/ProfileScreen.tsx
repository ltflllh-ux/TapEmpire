import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/useGameStore";
import { formatTL } from "../utils/formatTL";
import { INVESTMENTS } from "../data/investments";
import { BUSINESSES } from "../data/businesses";
import { COLLECTIBLES } from "../data/collections";
import SectionCard from "../components/profile/SectionCard";
import StatRow from "../components/profile/StatRow";

export default function ProfileScreen() {
  const store = useGameStore();

  const [nameInput, setNameInput] = useState(store.playerName);
  const [companyInput, setCompanyInput] = useState(store.companyName);
  const [editing, setEditing] = useState(false);

  const investmentCount = Object.values(store.ownedInvestments).reduce((sum, v) => sum + v, 0);
  const businessCount = Object.values(store.ownedBusinesses).filter((v) => v > 0).length;
  const collectibleCount = Object.values(store.ownedCollectibles).filter(Boolean).length;

  const canPrestige = store.totalEarned >= 10_000_000;

  const handleSaveInfo = () => {
    store.setPlayerInfo(nameInput, companyInput);
    store.saveToStorage();
    setEditing(false);
  };

  const handlePayTax = () => {
    if (store.taxDebt <= 0) return;
    if (store.balance < store.taxDebt) {
      const confirmPartial = () => store.payTax();
      if (Platform.OS === "web") {
        if (window.confirm(`Bakiyeniz borcu karşılamıyor. ${formatTL(store.balance)} ödeyerek kısmi ödeme yapmak ister misiniz?`)) confirmPartial();
      } else {
        Alert.alert("Yetersiz Bakiye", `Bakiyeniz borcu karşılamıyor. ${formatTL(store.balance)} kısmi ödeme?`, [
          { text: "İptal", style: "cancel" },
          { text: "Öde", onPress: confirmPartial },
        ]);
      }
    } else {
      store.payTax();
    }
  };

  const handlePrestige = () => {
    if (!canPrestige) return;
    const newMult = (1 + (store.prestigeLevel + 1) * 0.25).toFixed(2);
    const doPrestige = () => store.prestige();
    if (Platform.OS === "web") {
      if (window.confirm(`Prestige yapacaksın! Tüm ilerleme sıfırlanacak ama kalıcı ${newMult}x çarpan kazanacaksın. Emin misin?`)) doPrestige();
    } else {
      Alert.alert("Prestige", `Tüm ilerleme sıfırlanacak ama kalıcı ${newMult}x çarpan kazanacaksın. Emin misin?`, [
        { text: "İptal", style: "cancel" },
        { text: "Prestige!", onPress: doPrestige },
      ]);
    }
  };

  const handleReset = () => {
    const doReset = () => store.resetGame();
    if (Platform.OS === "web") {
      if (window.confirm("Tüm ilerlemen silinecek! Emin misin?")) doReset();
    } else {
      Alert.alert("Oyunu Sıfırla", "Tüm ilerlemen silinecek! Emin misin?", [
        { text: "İptal", style: "cancel" },
        { text: "Sıfırla", style: "destructive", onPress: doReset },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0D1B2A", "#1A2744"]} style={styles.header}>
        <Text style={styles.avatar}>{"👤"}</Text>
        <Text style={styles.playerName}>{store.playerName || "İsimsiz Patron"}</Text>
        <Text style={styles.companyName}>{store.companyName || "Şirket belirlenmedi"}</Text>
        {store.prestigeLevel > 0 && (
          <View style={styles.prestigeRow}>
            <Text style={styles.prestigeText}>{"⭐"} Prestige {store.prestigeLevel} — {store.prestigeMultiplier}x çarpan</Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll}>
        <SectionCard title={"✏️ Oyuncu Bilgileri"}>
          {editing ? (
            <>
              <TextInput style={styles.input} placeholder="Adın" placeholderTextColor="#4A5568" value={nameInput} onChangeText={setNameInput} />
              <TextInput style={styles.input} placeholder="Şirket Adı" placeholderTextColor="#4A5568" value={companyInput} onChangeText={setCompanyInput} />
              <View style={styles.editBtnRow}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveInfo}>
                  <Text style={styles.saveBtnText}>Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                  <Text style={styles.cancelBtnText}>İptal</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity onPress={() => { setNameInput(store.playerName); setCompanyInput(store.companyName); setEditing(true); }}>
              <StatRow label="Ad" value={store.playerName || "Belirtilmedi"} />
              <StatRow label="Şirket" value={store.companyName || "Belirtilmedi"} />
              <Text style={styles.editHint}>Düzenlemek için dokun</Text>
            </TouchableOpacity>
          )}
        </SectionCard>

        <SectionCard title={"📊 Genel İstatistikler"}>
          <StatRow label="Bakiye" value={formatTL(store.balance)} color="#F4C430" />
          <StatRow label="Toplam Kazanç" value={formatTL(store.totalEarned)} color="#48BB78" />
          <StatRow label="Toplam Tap" value={store.totalTaps.toLocaleString("tr-TR")} />
          <StatRow label="Tap Seviyesi" value={`${store.tapLevel} / 20`} />
          <StatRow label="Tap Başına" value={formatTL(store.tapValue)} />
          <StatRow label="Pasif Gelir" value={`${formatTL(store.hourlyPassiveIncome)}/saat`} />
          {store.lifetimeEarned > 0 && (
            <StatRow label="Ömür Boyu Kazanç" value={formatTL(store.lifetimeEarned)} color="#9F7AEA" />
          )}
        </SectionCard>

        <SectionCard title={"🎯 Koleksiyon Bonusları"}>
          <StatRow label="Tap Bonusu" value={`+${store.collectibleTapBoost}%`} color={store.collectibleTapBoost > 0 ? "#48BB78" : "#4A5568"} />
          <StatRow label="Pasif Gelir Bonusu" value={`+${store.collectiblePassiveBoost}%`} color={store.collectiblePassiveBoost > 0 ? "#48BB78" : "#4A5568"} />
          {store.prestigeMultiplier > 1 && (
            <StatRow label="Prestige Çarpanı" value={`${store.prestigeMultiplier}x`} color="#F4C430" />
          )}
        </SectionCard>

        <SectionCard title={"💼 Varlıklar"}>
          <StatRow label="Yatırımlar" value={`${investmentCount} adet (${INVESTMENTS.length} çeşit)`} />
          <StatRow label="İşletmeler" value={`${businessCount} / ${BUSINESSES.length}`} />
          <StatRow label="Koleksiyon" value={`${collectibleCount} / ${COLLECTIBLES.length}`} />
        </SectionCard>

        <SectionCard title={"🏛️ Vergi Dairesi"}>
          <StatRow label="Vergi Borcu" value={formatTL(store.taxDebt)} color={store.taxDebt > 0 ? "#FC8181" : "#48BB78"} />
          <StatRow label="Toplam Ödenen" value={formatTL(store.taxPaid)} color="#A0AEC0" />
          <Text style={styles.taxInfo}>Tüm kazançlardan %8 vergi hesaplanır</Text>
          {store.taxDebt > 0 && (
            <TouchableOpacity style={styles.payBtn} onPress={handlePayTax}>
              <Text style={styles.payBtnText}>{"💰 Vergi Öde — "}{formatTL(store.taxDebt)}</Text>
            </TouchableOpacity>
          )}
        </SectionCard>

        <SectionCard title={"🔄 Prestige"}>
          <Text style={styles.prestigeDesc}>
            Prestige yaparak tüm ilerlemeyi sıfırla ama kalıcı kazanç çarpanı kazan!
            {"\n"}Mevcut çarpan: {store.prestigeMultiplier}x
            {"\n"}Sonraki çarpan: {(1 + (store.prestigeLevel + 1) * 0.25).toFixed(2)}x
          </Text>
          <Text style={styles.prestigeReq}>
            Gerekli kazanç: {formatTL(10_000_000)} (Mevcut: {formatTL(store.totalEarned)})
          </Text>
          <TouchableOpacity
            style={[styles.prestigeBtn, !canPrestige && styles.prestigeBtnDisabled]}
            onPress={handlePrestige}
            disabled={!canPrestige}
          >
            <Text style={[styles.prestigeBtnText, !canPrestige && styles.prestigeBtnTextDisabled]}>
              {"⭐ Prestige Yap"}
            </Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard title={"⚙️ Oyun Ayarları"}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>{"🗑️ Oyunu Sıfırla"}</Text>
          </TouchableOpacity>
        </SectionCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>TapEmpire v2.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#070D1A" },
  header: { padding: 20, paddingTop: 50, alignItems: "center", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  avatar: { fontSize: 56, marginBottom: 8 },
  playerName: { color: "#E2E8F0", fontSize: 22, fontWeight: "bold" },
  companyName: { color: "#A0AEC0", fontSize: 14, marginTop: 4 },
  prestigeRow: { marginTop: 8, backgroundColor: "#F4C43022", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6 },
  prestigeText: { color: "#F4C430", fontSize: 13, fontWeight: "bold" },
  scroll: { paddingTop: 12, paddingBottom: 30 },
  input: { backgroundColor: "#1A2744", borderRadius: 10, padding: 12, color: "#E2E8F0", fontSize: 15, marginBottom: 10 },
  editBtnRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  saveBtn: { flex: 1, backgroundColor: "#F4C430", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  saveBtnText: { color: "#070D1A", fontSize: 14, fontWeight: "bold" },
  cancelBtn: { flex: 1, backgroundColor: "#1A2744", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  cancelBtnText: { color: "#A0AEC0", fontSize: 14, fontWeight: "600" },
  editHint: { color: "#4A5568", fontSize: 12, textAlign: "center", marginTop: 8 },
  taxInfo: { color: "#4A5568", fontSize: 12, marginTop: 6 },
  payBtn: { backgroundColor: "#1A2744", borderWidth: 1.5, borderColor: "#F4C430", borderRadius: 10, paddingVertical: 12, marginTop: 12, alignItems: "center" },
  payBtnText: { color: "#F4C430", fontSize: 14, fontWeight: "bold" },
  prestigeDesc: { color: "#A0AEC0", fontSize: 13, lineHeight: 20, marginBottom: 8 },
  prestigeReq: { color: "#CBD5E0", fontSize: 12, marginBottom: 12 },
  prestigeBtn: { backgroundColor: "#1A2744", borderWidth: 1.5, borderColor: "#F4C430", borderRadius: 10, paddingVertical: 14, alignItems: "center" },
  prestigeBtnDisabled: { borderColor: "#2D3748" },
  prestigeBtnText: { color: "#F4C430", fontSize: 15, fontWeight: "bold" },
  prestigeBtnTextDisabled: { color: "#4A5568" },
  resetBtn: { backgroundColor: "#2D1B1B", borderWidth: 1.5, borderColor: "#FC8181", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  resetBtnText: { color: "#FC8181", fontSize: 14, fontWeight: "bold" },
  footer: { alignItems: "center", marginTop: 12, paddingBottom: 10 },
  footerText: { color: "#2D3748", fontSize: 12 },
});
