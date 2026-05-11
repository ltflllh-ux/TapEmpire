export interface Business {
  id: string;
  name: string;
  icon: string;
  category: string;
  baseCost: number;
  costMultiplier: number;
  baseIncomePerSec: number;
  maxLevel: number;
  description: string;
  unlockTapLevel: number;
}

export const BUSINESS_CATEGORIES = [
  "Tümü",
  "Yeme-İçme",
  "Perakende",
  "Teknoloji",
  "Sanayi",
  "Lüks",
];

export const BUSINESSES: Business[] = [
  // Yeme-İçme
  { id: "simit_arabasi", name: "Simit Arabası", icon: "🥯", category: "Yeme-İçme", baseCost: 500, costMultiplier: 1.35, baseIncomePerSec: 1, maxLevel: 50, description: "Sokak lezzeti klasiği", unlockTapLevel: 1 },
  { id: "cay_bahcesi", name: "Çay Bahçesi", icon: "🍵", category: "Yeme-İçme", baseCost: 3_000, costMultiplier: 1.38, baseIncomePerSec: 5, maxLevel: 50, description: "Herkesin uğrak yeri", unlockTapLevel: 1 },
  { id: "kebapci", name: "Kebapçı", icon: "🍖", category: "Yeme-İçme", baseCost: 15_000, costMultiplier: 1.40, baseIncomePerSec: 20, maxLevel: 40, description: "Adana usulü lezzetler", unlockTapLevel: 2 },
  { id: "restoran", name: "Fine Dining Restoran", icon: "🍽️", category: "Yeme-İçme", baseCost: 500_000, costMultiplier: 1.45, baseIncomePerSec: 500, maxLevel: 30, description: "Şehrin en şık restoranı", unlockTapLevel: 5 },

  // Perakende
  { id: "bakkal", name: "Mahalle Bakkalı", icon: "🏪", category: "Perakende", baseCost: 2_000, costMultiplier: 1.36, baseIncomePerSec: 3, maxLevel: 50, description: "Her mahallenin ihtiyacı", unlockTapLevel: 1 },
  { id: "eczane", name: "Eczane", icon: "💊", category: "Perakende", baseCost: 25_000, costMultiplier: 1.40, baseIncomePerSec: 30, maxLevel: 40, description: "Sağlık her şeyden önce", unlockTapLevel: 3 },
  { id: "market_zinciri", name: "Market Zinciri", icon: "🛒", category: "Perakende", baseCost: 300_000, costMultiplier: 1.44, baseIncomePerSec: 300, maxLevel: 30, description: "Şehir genelinde şubeler", unlockTapLevel: 5 },
  { id: "avm_magaza", name: "AVM Mağazası", icon: "👗", category: "Perakende", baseCost: 3_000_000, costMultiplier: 1.48, baseIncomePerSec: 2_500, maxLevel: 25, description: "Premium marka mağazası", unlockTapLevel: 8 },

  // Teknoloji
  { id: "tamir_dukkan", name: "Telefon Tamircisi", icon: "📱", category: "Teknoloji", baseCost: 8_000, costMultiplier: 1.38, baseIncomePerSec: 10, maxLevel: 45, description: "Ekran değişimi uzmanı", unlockTapLevel: 2 },
  { id: "yazilim_evi", name: "Yazılım Evi", icon: "💻", category: "Teknoloji", baseCost: 100_000, costMultiplier: 1.42, baseIncomePerSec: 120, maxLevel: 35, description: "Mobil uygulama geliştirme", unlockTapLevel: 4 },
  { id: "veri_merkezi", name: "Veri Merkezi", icon: "🖥️", category: "Teknoloji", baseCost: 2_000_000, costMultiplier: 1.47, baseIncomePerSec: 2_000, maxLevel: 25, description: "Bulut bilişim altyapısı", unlockTapLevel: 7 },
  { id: "yapay_zeka", name: "Yapay Zeka Şirketi", icon: "🤖", category: "Teknoloji", baseCost: 30_000_000, costMultiplier: 1.50, baseIncomePerSec: 25_000, maxLevel: 20, description: "Geleceğin teknolojisi", unlockTapLevel: 10 },

  // Sanayi
  { id: "tekstil", name: "Tekstil Atölyesi", icon: "🧵", category: "Sanayi", baseCost: 50_000, costMultiplier: 1.40, baseIncomePerSec: 60, maxLevel: 40, description: "Giyim üretimi", unlockTapLevel: 3 },
  { id: "fabrika", name: "Gıda Fabrikası", icon: "🏭", category: "Sanayi", baseCost: 600_000, costMultiplier: 1.44, baseIncomePerSec: 600, maxLevel: 30, description: "Paketli gıda üretimi", unlockTapLevel: 6 },
  { id: "otomotiv", name: "Otomotiv Fabrikası", icon: "🚗", category: "Sanayi", baseCost: 10_000_000, costMultiplier: 1.48, baseIncomePerSec: 8_000, maxLevel: 20, description: "Yerli otomobil üretimi", unlockTapLevel: 9 },

  // Lüks
  { id: "otel", name: "Butik Otel", icon: "🏨", category: "Lüks", baseCost: 1_000_000, costMultiplier: 1.45, baseIncomePerSec: 1_000, maxLevel: 25, description: "5 yıldızlı konaklama", unlockTapLevel: 6 },
  { id: "yacht", name: "Yat Kiralama", icon: "🛥️", category: "Lüks", baseCost: 8_000_000, costMultiplier: 1.48, baseIncomePerSec: 7_000, maxLevel: 20, description: "Lüks deniz turizmi", unlockTapLevel: 9 },
  { id: "havayolu", name: "Havayolu Şirketi", icon: "✈️", category: "Lüks", baseCost: 80_000_000, costMultiplier: 1.52, baseIncomePerSec: 60_000, maxLevel: 15, description: "Göklerin hakimi", unlockTapLevel: 12 },
];

export function getBusinessUpgradeCost(biz: Business, currentLevel: number): number {
  return Math.floor(biz.baseCost * Math.pow(biz.costMultiplier, currentLevel));
}

export function getBusinessIncome(biz: Business, level: number): number {
  return biz.baseIncomePerSec * level;
}

export function calcTotalBusinessIncome(owned: Record<string, number>): number {
  return BUSINESSES.reduce((sum, biz) => {
    const level = owned[biz.id] || 0;
    return sum + getBusinessIncome(biz, level);
  }, 0) * 3600;
}
