export type Rarity = "common" | "rare" | "epic" | "legendary";

export type AbilityType = "speed" | "multiplier" | "costReduction" | "combined";

export interface ManagerAbility {
  type: AbilityType;
  value: number;
  /** Only used for combined type */
  secondaryValue?: number;
}

export interface Manager {
  id: string;
  name: string;
  title: string;
  icon: string;
  rarity: Rarity;
  cost: number;
  ability: ManagerAbility;
  description: string;
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: "#A0AEC0",
  rare: "#48BB78",
  epic: "#9F7AEA",
  legendary: "#F4C430",
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: "Normal",
  rare: "Nadir",
  epic: "Epik",
  legendary: "Efsanevi",
};

export const MANAGER_CATEGORIES = [
  "Tümü",
  "Normal",
  "Nadir",
  "Epik",
  "Efsanevi",
];

export const MANAGERS: Manager[] = [
  // Common (10-20 diamonds)
  {
    id: "mgr_ahmet",
    name: "Ahmet Yılmaz",
    title: "Muhasebeci",
    icon: "📊",
    rarity: "common",
    cost: 10,
    ability: { type: "speed", value: 20 },
    description: "Gelir toplama hızını %20 artırır",
  },
  {
    id: "mgr_fatma",
    name: "Fatma Demir",
    title: "Pazarlamacı",
    icon: "📢",
    rarity: "common",
    cost: 15,
    ability: { type: "multiplier", value: 1.15 },
    description: "İşletme gelirini %15 artırır",
  },
  {
    id: "mgr_mehmet",
    name: "Mehmet Kaya",
    title: "Satış Müdürü",
    icon: "💼",
    rarity: "common",
    cost: 20,
    ability: { type: "costReduction", value: 10 },
    description: "Yükseltme maliyetini %10 azaltır",
  },

  // Rare (30-50 diamonds)
  {
    id: "mgr_zeynep",
    name: "Zeynep Arslan",
    title: "Finans Uzmanı",
    icon: "💰",
    rarity: "rare",
    cost: 30,
    ability: { type: "multiplier", value: 1.25 },
    description: "İşletme gelirini %25 artırır",
  },
  {
    id: "mgr_emre",
    name: "Emre Çelik",
    title: "Teknoloji Müdürü",
    icon: "💻",
    rarity: "rare",
    cost: 40,
    ability: { type: "speed", value: 35 },
    description: "Gelir toplama hızını %35 artırır",
  },
  {
    id: "mgr_selin",
    name: "Selin Öztürk",
    title: "İK Direktörü",
    icon: "👥",
    rarity: "rare",
    cost: 45,
    ability: { type: "costReduction", value: 20 },
    description: "Yükseltme maliyetini %20 azaltır",
  },
  {
    id: "mgr_burak",
    name: "Burak Şahin",
    title: "Operasyon Şefi",
    icon: "⚙️",
    rarity: "rare",
    cost: 50,
    ability: { type: "multiplier", value: 1.3 },
    description: "İşletme gelirini %30 artırır",
  },

  // Epic (75-100 diamonds)
  {
    id: "mgr_deniz",
    name: "Deniz Aydın",
    title: "Strateji Direktörü",
    icon: "🎯",
    rarity: "epic",
    cost: 75,
    ability: { type: "multiplier", value: 1.5 },
    description: "İşletme gelirini %50 artırır",
  },
  {
    id: "mgr_ece",
    name: "Ece Yıldırım",
    title: "CFO",
    icon: "📈",
    rarity: "epic",
    cost: 90,
    ability: { type: "costReduction", value: 30 },
    description: "Yükseltme maliyetini %30 azaltır",
  },
  {
    id: "mgr_can",
    name: "Can Koç",
    title: "CTO",
    icon: "🔧",
    rarity: "epic",
    cost: 100,
    ability: { type: "speed", value: 50 },
    description: "Gelir toplama hızını %50 artırır",
  },

  // Legendary (150-200 diamonds)
  {
    id: "mgr_naz",
    name: "Naz Korkmaz",
    title: "CEO",
    icon: "👑",
    rarity: "legendary",
    cost: 150,
    ability: { type: "multiplier", value: 2.0 },
    description: "İşletme gelirini %100 artırır",
  },
  {
    id: "mgr_arda",
    name: "Arda Başaran",
    title: "Yatırım Gurusu",
    icon: "🌟",
    rarity: "legendary",
    cost: 200,
    ability: { type: "combined", value: 1.75, secondaryValue: 25 },
    description: "Geliri %75 artırır ve maliyeti %25 azaltır",
  },
];
