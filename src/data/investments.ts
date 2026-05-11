export interface Investment {
  id: string;
  name: string;
  icon: string;
  category: string;
  baseCost: number;
  costMultiplier: number;
  incomePerHour: number;
  description: string;
  unlockLevel: number;
}

export const INVESTMENT_CATEGORIES = [
  "Tümü",
  "Tahvil & Fon",
  "Altın",
  "Borsa",
  "Gayrimenkul",
  "Kripto",
];

export const INVESTMENTS: Investment[] = [
  // Tahvil & Fon
  { id: "devlet_tahvili", name: "Devlet Tahvili", icon: "📜", category: "Tahvil & Fon", baseCost: 1_000, costMultiplier: 1.12, incomePerHour: 50, description: "Güvenli devlet yatırımı", unlockLevel: 1 },
  { id: "hazine_bonosu", name: "Hazine Bonosu", icon: "📋", category: "Tahvil & Fon", baseCost: 8_000, costMultiplier: 1.13, incomePerHour: 350, description: "Kısa vadeli devlet borçlanma", unlockLevel: 2 },
  { id: "bist_fon", name: "BİST Endeks Fonu", icon: "📊", category: "Tahvil & Fon", baseCost: 50_000, costMultiplier: 1.14, incomePerHour: 2_500, description: "Borsa endeks takip fonu", unlockLevel: 3 },

  // Altın
  { id: "ceyrek_altin", name: "Çeyrek Altın", icon: "🪙", category: "Altın", baseCost: 5_000, costMultiplier: 1.12, incomePerHour: 200, description: "Klasik yatırım aracı", unlockLevel: 1 },
  { id: "yarim_altin", name: "Yarım Altın", icon: "🥇", category: "Altın", baseCost: 40_000, costMultiplier: 1.14, incomePerHour: 2_000, description: "Daha büyük altın yatırımı", unlockLevel: 3 },
  { id: "altin_kulce", name: "Altın Külçe", icon: "🏆", category: "Altın", baseCost: 500_000, costMultiplier: 1.16, incomePerHour: 30_000, description: "Ağır toplar için", unlockLevel: 5 },

  // Borsa
  { id: "hisse_paketi", name: "Hisse Paketi", icon: "📈", category: "Borsa", baseCost: 15_000, costMultiplier: 1.13, incomePerHour: 750, description: "Çeşitli hisse senetleri", unlockLevel: 2 },
  { id: "temettu", name: "Temettü Portföyü", icon: "💹", category: "Borsa", baseCost: 200_000, costMultiplier: 1.15, incomePerHour: 12_000, description: "Düzenli temettü geliri", unlockLevel: 4 },
  { id: "halka_arz", name: "Halka Arz", icon: "🔔", category: "Borsa", baseCost: 2_000_000, costMultiplier: 1.18, incomePerHour: 150_000, description: "Yeni şirket halka arzları", unlockLevel: 7 },

  // Gayrimenkul
  { id: "dukkan", name: "Küçük Dükkan", icon: "🏪", category: "Gayrimenkul", baseCost: 80_000, costMultiplier: 1.14, incomePerHour: 5_000, description: "Kiralık küçük dükkan", unlockLevel: 3 },
  { id: "daire", name: "Apartman Dairesi", icon: "🏠", category: "Gayrimenkul", baseCost: 400_000, costMultiplier: 1.16, incomePerHour: 25_000, description: "Kira geliri sağlar", unlockLevel: 5 },
  { id: "plaza", name: "Plaza Katı", icon: "🏢", category: "Gayrimenkul", baseCost: 5_000_000, costMultiplier: 1.18, incomePerHour: 350_000, description: "Kurumsal kira geliri", unlockLevel: 8 },
  { id: "avm", name: "AVM", icon: "🏬", category: "Gayrimenkul", baseCost: 50_000_000, costMultiplier: 1.22, incomePerHour: 4_000_000, description: "Dev alışveriş merkezi", unlockLevel: 10 },

  // Kripto
  { id: "bitcoin", name: "Bitcoin Kasası", icon: "₿", category: "Kripto", baseCost: 25_000, costMultiplier: 1.14, incomePerHour: 1_500, description: "Dijital altın", unlockLevel: 2 },
  { id: "altcoin", name: "Altcoin Portföyü", icon: "💎", category: "Kripto", baseCost: 150_000, costMultiplier: 1.16, incomePerHour: 10_000, description: "Çeşitli kripto paralar", unlockLevel: 4 },
  { id: "mining", name: "Mining Çiftliği", icon: "⛏️", category: "Kripto", baseCost: 3_000_000, costMultiplier: 1.19, incomePerHour: 200_000, description: "Kripto madenciliği", unlockLevel: 7 },
  { id: "defi", name: "DeFi Protokolü", icon: "🔗", category: "Kripto", baseCost: 25_000_000, costMultiplier: 1.21, incomePerHour: 2_500_000, description: "Merkeziyetsiz finans", unlockLevel: 10 },
];

export function getInvestmentCost(inv: Investment, owned: number): number {
  return Math.floor(inv.baseCost * Math.pow(inv.costMultiplier, owned));
}

export function calcTotalPassiveIncome(owned: Record<string, number>): number {
  return INVESTMENTS.reduce((sum, inv) => {
    return sum + (owned[inv.id] || 0) * inv.incomePerHour;
  }, 0);
}
