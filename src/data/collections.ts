export type Rarity = "Yaygın" | "Nadir" | "Epik" | "Efsanevi";

export interface Collectible {
  id: string;
  name: string;
  icon: string;
  category: string;
  cost: number;
  rarity: Rarity;
  tapBoostPercent: number;
  passiveBoostPercent: number;
  description: string;
  unlockLevel: number;
}

export const COLLECTION_CATEGORIES = [
  "Tümü",
  "Araçlar",
  "Gayrimenkul",
  "Saatler",
  "Sanat & Mücevher",
  "Özel",
];

export const RARITY_COLORS: Record<Rarity, string> = {
  "Yaygın": "#A0AEC0",
  "Nadir": "#4299E1",
  "Epik": "#9F7AEA",
  "Efsanevi": "#F4C430",
};

export const COLLECTIBLES: Collectible[] = [
  // Araçlar
  { id: "bisiklet", name: "Bisiklet", icon: "🚲", category: "Araçlar", cost: 2_000, rarity: "Yaygın", tapBoostPercent: 1, passiveBoostPercent: 0, description: "İlk adım her zaman mütevazıdır", unlockLevel: 1 },
  { id: "motosiklet", name: "Motosiklet", icon: "🏍️", category: "Araçlar", cost: 15_000, rarity: "Yaygın", tapBoostPercent: 2, passiveBoostPercent: 0, description: "Rüzgarı hisset", unlockLevel: 2 },
  { id: "sedan", name: "Sedan Araba", icon: "🚗", category: "Araçlar", cost: 100_000, rarity: "Nadir", tapBoostPercent: 0, passiveBoostPercent: 3, description: "Konforlu şehir aracı", unlockLevel: 3 },
  { id: "suv", name: "Lüks SUV", icon: "🚙", category: "Araçlar", cost: 500_000, rarity: "Nadir", tapBoostPercent: 5, passiveBoostPercent: 0, description: "Her yolun hakimi", unlockLevel: 5 },
  { id: "spor_araba", name: "Spor Araba", icon: "🏎️", category: "Araçlar", cost: 5_000_000, rarity: "Epik", tapBoostPercent: 8, passiveBoostPercent: 0, description: "0-100 km/h 3 saniye", unlockLevel: 7 },
  { id: "yat", name: "Lüks Yat", icon: "🛥️", category: "Araçlar", cost: 50_000_000, rarity: "Epik", tapBoostPercent: 0, passiveBoostPercent: 12, description: "Akdeniz'de rüzgar gibi", unlockLevel: 10 },
  { id: "ozel_jet", name: "Özel Jet", icon: "✈️", category: "Araçlar", cost: 500_000_000, rarity: "Efsanevi", tapBoostPercent: 20, passiveBoostPercent: 0, description: "Gökyüzü senin", unlockLevel: 14 },

  // Gayrimenkul
  { id: "studyo", name: "Stüdyo Daire", icon: "🏠", category: "Gayrimenkul", cost: 5_000, rarity: "Yaygın", tapBoostPercent: 0, passiveBoostPercent: 1, description: "İlk evin, ilk adım", unlockLevel: 1 },
  { id: "dubleks", name: "Dubleks Daire", icon: "🏡", category: "Gayrimenkul", cost: 80_000, rarity: "Nadir", tapBoostPercent: 0, passiveBoostPercent: 3, description: "İki katlı konfor", unlockLevel: 3 },
  { id: "villa", name: "Boğaz Villası", icon: "🏘️", category: "Gayrimenkul", cost: 800_000, rarity: "Nadir", tapBoostPercent: 0, passiveBoostPercent: 6, description: "Boğaz manzaralı yaşam", unlockLevel: 6 },
  { id: "penthouse", name: "Penthouse", icon: "🏙️", category: "Gayrimenkul", cost: 10_000_000, rarity: "Epik", tapBoostPercent: 0, passiveBoostPercent: 10, description: "Şehrin tepesinde", unlockLevel: 8 },
  { id: "ada", name: "Özel Ada", icon: "🏝️", category: "Gayrimenkul", cost: 200_000_000, rarity: "Efsanevi", tapBoostPercent: 0, passiveBoostPercent: 18, description: "Kendi krallığın", unlockLevel: 12 },

  // Saatler
  { id: "klasik_saat", name: "Klasik Saat", icon: "⌚", category: "Saatler", cost: 3_000, rarity: "Yaygın", tapBoostPercent: 1, passiveBoostPercent: 0, description: "Zamanın değerini bil", unlockLevel: 1 },
  { id: "diver_saat", name: "Diver Saat", icon: "🤿", category: "Saatler", cost: 50_000, rarity: "Nadir", tapBoostPercent: 3, passiveBoostPercent: 0, description: "300m su geçirmez", unlockLevel: 3 },
  { id: "kronograf", name: "Kronograf", icon: "⏱️", category: "Saatler", cost: 300_000, rarity: "Nadir", tapBoostPercent: 5, passiveBoostPercent: 0, description: "Hassas zamanlama", unlockLevel: 5 },
  { id: "tourbillon", name: "Tourbillon", icon: "🕰️", category: "Saatler", cost: 8_000_000, rarity: "Epik", tapBoostPercent: 10, passiveBoostPercent: 0, description: "Sanat eseri mekanizma", unlockLevel: 9 },
  { id: "pirlanta_saat", name: "Pırlanta Saat", icon: "💍", category: "Saatler", cost: 150_000_000, rarity: "Efsanevi", tapBoostPercent: 15, passiveBoostPercent: 0, description: "Bilek üstünde servet", unlockLevel: 13 },

  // Sanat & Mücevher
  { id: "tablo", name: "Yağlı Boya Tablo", icon: "🖼️", category: "Sanat & Mücevher", cost: 10_000, rarity: "Yaygın", tapBoostPercent: 0, passiveBoostPercent: 2, description: "Duvarların süsü", unlockLevel: 2 },
  { id: "heykel", name: "Mermer Heykel", icon: "🗿", category: "Sanat & Mücevher", cost: 120_000, rarity: "Nadir", tapBoostPercent: 0, passiveBoostPercent: 4, description: "Klasik sanat eseri", unlockLevel: 4 },
  { id: "elmas_kolye", name: "Elmas Kolye", icon: "💎", category: "Sanat & Mücevher", cost: 3_000_000, rarity: "Epik", tapBoostPercent: 7, passiveBoostPercent: 0, description: "24 karat parlaklık", unlockLevel: 7 },
  { id: "antika", name: "Antika Koleksiyon", icon: "🏺", category: "Sanat & Mücevher", cost: 20_000_000, rarity: "Epik", tapBoostPercent: 0, passiveBoostPercent: 12, description: "Osmanlı dönemi eserleri", unlockLevel: 10 },
  { id: "nadir_pirlanta", name: "Nadir Pırlanta", icon: "👑", category: "Sanat & Mücevher", cost: 300_000_000, rarity: "Efsanevi", tapBoostPercent: 0, passiveBoostPercent: 20, description: "Dünyanın en nadir taşı", unlockLevel: 15 },

  // Özel
  { id: "altin_telefon", name: "Altın Telefon", icon: "📱", category: "Özel", cost: 200_000, rarity: "Nadir", tapBoostPercent: 4, passiveBoostPercent: 0, description: "24K altın kaplama", unlockLevel: 4 },
  { id: "uzay_bileti", name: "Uzay Bileti", icon: "🚀", category: "Özel", cost: 40_000_000, rarity: "Epik", tapBoostPercent: 15, passiveBoostPercent: 0, description: "Yıldızlara yolculuk", unlockLevel: 11 },
  { id: "kripto_og", name: "Kripto Cüzdan (OG)", icon: "🔐", category: "Özel", cost: 1_000_000_000, rarity: "Efsanevi", tapBoostPercent: 0, passiveBoostPercent: 25, description: "2009'dan kalma Bitcoin cüzdanı", unlockLevel: 16 },
];

export function calcCollectibleBoosts(owned: Record<string, boolean>) {
  let tapBoost = 0;
  let passiveBoost = 0;
  for (const item of COLLECTIBLES) {
    if (owned[item.id]) {
      tapBoost += item.tapBoostPercent;
      passiveBoost += item.passiveBoostPercent;
    }
  }
  return { tapBoost, passiveBoost };
}
