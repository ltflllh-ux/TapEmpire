export type AchievementTier = "bronze" | "silver" | "gold";

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  tiers: {
    tier: AchievementTier;
    target: number;
    reward: number;
  }[];
  getValue: (state: AchievementState) => number;
}

export interface AchievementState {
  totalEarned: number;
  tapLevel: number;
  totalTaps: number;
  investmentCount: number;
  businessCount: number;
  collectibleCount: number;
  taxPaid: number;
  prestigeLevel: number;
}

export const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#F4C430",
};

export const TIER_LABELS: Record<AchievementTier, string> = {
  bronze: "Bronz",
  silver: "Gümüş",
  gold: "Altın",
};

export const ACHIEVEMENT_CATEGORIES = [
  "Tümü",
  "Kazanç",
  "Tap",
  "Yatırım",
  "İşletme",
  "Koleksiyon",
  "Özel",
];

export const ACHIEVEMENTS: Achievement[] = [
  // Kazanç
  {
    id: "earner",
    name: "Para Babası",
    icon: "💰",
    description: "Toplam kazanç",
    category: "Kazanç",
    tiers: [
      { tier: "bronze", target: 100_000, reward: 5_000 },
      { tier: "silver", target: 10_000_000, reward: 500_000 },
      { tier: "gold", target: 1_000_000_000, reward: 50_000_000 },
    ],
    getValue: (s) => s.totalEarned,
  },
  {
    id: "tax_citizen",
    name: "Vergi Mükellefi",
    icon: "🏛️",
    description: "Toplam ödenen vergi",
    category: "Kazanç",
    tiers: [
      { tier: "bronze", target: 10_000, reward: 2_000 },
      { tier: "silver", target: 1_000_000, reward: 200_000 },
      { tier: "gold", target: 100_000_000, reward: 20_000_000 },
    ],
    getValue: (s) => s.taxPaid,
  },

  // Tap
  {
    id: "tapper",
    name: "Parmak Ustası",
    icon: "👆",
    description: "Toplam tap sayısı",
    category: "Tap",
    tiers: [
      { tier: "bronze", target: 500, reward: 1_000 },
      { tier: "silver", target: 10_000, reward: 50_000 },
      { tier: "gold", target: 100_000, reward: 1_000_000 },
    ],
    getValue: (s) => s.totalTaps,
  },
  {
    id: "leveler",
    name: "Seviye Avcısı",
    icon: "⬆️",
    description: "Tap seviyesi",
    category: "Tap",
    tiers: [
      { tier: "bronze", target: 5, reward: 10_000 },
      { tier: "silver", target: 10, reward: 500_000 },
      { tier: "gold", target: 20, reward: 50_000_000 },
    ],
    getValue: (s) => s.tapLevel,
  },

  // Yatırım
  {
    id: "investor",
    name: "Yatırımcı",
    icon: "📈",
    description: "Toplam yatırım adedi",
    category: "Yatırım",
    tiers: [
      { tier: "bronze", target: 5, reward: 5_000 },
      { tier: "silver", target: 25, reward: 250_000 },
      { tier: "gold", target: 75, reward: 10_000_000 },
    ],
    getValue: (s) => s.investmentCount,
  },

  // İşletme
  {
    id: "entrepreneur",
    name: "Girişimci",
    icon: "🏢",
    description: "Sahip olunan işletme sayısı",
    category: "İşletme",
    tiers: [
      { tier: "bronze", target: 3, reward: 10_000 },
      { tier: "silver", target: 10, reward: 500_000 },
      { tier: "gold", target: 19, reward: 25_000_000 },
    ],
    getValue: (s) => s.businessCount,
  },

  // Koleksiyon
  {
    id: "collector",
    name: "Koleksiyoncu",
    icon: "💎",
    description: "Sahip olunan koleksiyon eşyası",
    category: "Koleksiyon",
    tiers: [
      { tier: "bronze", target: 5, reward: 10_000 },
      { tier: "silver", target: 15, reward: 1_000_000 },
      { tier: "gold", target: 26, reward: 100_000_000 },
    ],
    getValue: (s) => s.collectibleCount,
  },

  // Özel
  {
    id: "prestige_master",
    name: "Prestige Ustası",
    icon: "🔄",
    description: "Prestige seviyesi",
    category: "Özel",
    tiers: [
      { tier: "bronze", target: 1, reward: 0 },
      { tier: "silver", target: 3, reward: 0 },
      { tier: "gold", target: 10, reward: 0 },
    ],
    getValue: (s) => s.prestigeLevel,
  },
];
