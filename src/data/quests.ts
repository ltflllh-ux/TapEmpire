export type QuestType = "daily" | "weekly";

export type TrackingKey =
  | "totalTaps"
  | "totalEarned"
  | "investmentsBought"
  | "businessesUpgraded"
  | "collectiblesBought"
  | "taxPaid"
  | "boostsUsed"
  | "comboReached";

export interface Quest {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: QuestType;
  target: number;
  reward: { type: "coins" | "diamonds"; amount: number };
  trackingKey: TrackingKey;
}

export const DAILY_QUEST_POOL: Quest[] = [
  {
    id: "daily_tap_500",
    name: "500 kez dokun",
    description: "Ekrana 500 kez dokun",
    icon: "👆",
    type: "daily",
    target: 500,
    reward: { type: "coins", amount: 5000 },
    trackingKey: "totalTaps",
  },
  {
    id: "daily_tap_1000",
    name: "1000 kez dokun",
    description: "Ekrana 1000 kez dokun",
    icon: "👆",
    type: "daily",
    target: 1000,
    reward: { type: "coins", amount: 15000 },
    trackingKey: "totalTaps",
  },
  {
    id: "daily_earn_25k",
    name: "₺25.000 kazan",
    description: "Toplam ₺25.000 kazan",
    icon: "💰",
    type: "daily",
    target: 25000,
    reward: { type: "diamonds", amount: 10 },
    trackingKey: "totalEarned",
  },
  {
    id: "daily_earn_100k",
    name: "₺100.000 kazan",
    description: "Toplam ₺100.000 kazan",
    icon: "💰",
    type: "daily",
    target: 100000,
    reward: { type: "diamonds", amount: 25 },
    trackingKey: "totalEarned",
  },
  {
    id: "daily_invest_2",
    name: "2 yatirim satin al",
    description: "2 adet yatirim satin al",
    icon: "📈",
    type: "daily",
    target: 2,
    reward: { type: "coins", amount: 8000 },
    trackingKey: "investmentsBought",
  },
  {
    id: "daily_upgrade_1",
    name: "1 isletme yukselt",
    description: "Bir isletmeyi yukselt",
    icon: "🏢",
    type: "daily",
    target: 1,
    reward: { type: "coins", amount: 10000 },
    trackingKey: "businessesUpgraded",
  },
  {
    id: "daily_collectible_1",
    name: "1 koleksiyon al",
    description: "Bir koleksiyon esyasi satin al",
    icon: "💎",
    type: "daily",
    target: 1,
    reward: { type: "diamonds", amount: 15 },
    trackingKey: "collectiblesBought",
  },
  {
    id: "daily_tax_1",
    name: "Vergi ode",
    description: "Vergi borcunu ode",
    icon: "🏛️",
    type: "daily",
    target: 1,
    reward: { type: "coins", amount: 5000 },
    trackingKey: "taxPaid",
  },
  {
    id: "daily_boost_1",
    name: "Boost kullan",
    description: "Bir boost aktif et",
    icon: "🚀",
    type: "daily",
    target: 1,
    reward: { type: "diamonds", amount: 5 },
    trackingKey: "boostsUsed",
  },
  {
    id: "daily_combo_15",
    name: "15x combo yap",
    description: "15x combo seviyesine ulas",
    icon: "🔥",
    type: "daily",
    target: 15,
    reward: { type: "diamonds", amount: 10 },
    trackingKey: "comboReached",
  },
  {
    id: "daily_invest_3",
    name: "3 yatirim satin al",
    description: "3 adet yatirim satin al",
    icon: "📈",
    type: "daily",
    target: 3,
    reward: { type: "diamonds", amount: 20 },
    trackingKey: "investmentsBought",
  },
  {
    id: "daily_tap_2000",
    name: "2000 kez dokun",
    description: "Ekrana 2000 kez dokun",
    icon: "👆",
    type: "daily",
    target: 2000,
    reward: { type: "diamonds", amount: 30 },
    trackingKey: "totalTaps",
  },
];

export const WEEKLY_QUEST_POOL: Quest[] = [
  {
    id: "weekly_tap_10k",
    name: "10.000 kez dokun",
    description: "Bu hafta 10.000 kez dokun",
    icon: "👆",
    type: "weekly",
    target: 10000,
    reward: { type: "diamonds", amount: 100 },
    trackingKey: "totalTaps",
  },
  {
    id: "weekly_earn_1m",
    name: "₺1.000.000 kazan",
    description: "Bu hafta ₺1.000.000 kazan",
    icon: "💰",
    type: "weekly",
    target: 1000000,
    reward: { type: "diamonds", amount: 200 },
    trackingKey: "totalEarned",
  },
  {
    id: "weekly_invest_10",
    name: "10 yatirim satin al",
    description: "Bu hafta 10 yatirim satin al",
    icon: "📈",
    type: "weekly",
    target: 10,
    reward: { type: "diamonds", amount: 150 },
    trackingKey: "investmentsBought",
  },
  {
    id: "weekly_upgrade_5",
    name: "5 isletme yukselt",
    description: "Bu hafta 5 isletme yukselt",
    icon: "🏢",
    type: "weekly",
    target: 5,
    reward: { type: "diamonds", amount: 150 },
    trackingKey: "businessesUpgraded",
  },
  {
    id: "weekly_collectible_5",
    name: "5 koleksiyon al",
    description: "Bu hafta 5 koleksiyon esyasi al",
    icon: "💎",
    type: "weekly",
    target: 5,
    reward: { type: "diamonds", amount: 200 },
    trackingKey: "collectiblesBought",
  },
  {
    id: "weekly_combo_50",
    name: "50x combo yap",
    description: "50x combo seviyesine ulas",
    icon: "🔥",
    type: "weekly",
    target: 50,
    reward: { type: "diamonds", amount: 100 },
    trackingKey: "comboReached",
  },
  {
    id: "weekly_tax_3",
    name: "3 kez vergi ode",
    description: "Bu hafta 3 kez vergi ode",
    icon: "🏛️",
    type: "weekly",
    target: 3,
    reward: { type: "diamonds", amount: 75 },
    trackingKey: "taxPaid",
  },
  {
    id: "weekly_boost_5",
    name: "5 boost kullan",
    description: "Bu hafta 5 boost kullan",
    icon: "🚀",
    type: "weekly",
    target: 5,
    reward: { type: "diamonds", amount: 100 },
    trackingKey: "boostsUsed",
  },
];

/**
 * Deterministically picks 3 daily + 3 weekly quests based on a day seed.
 * For daily quests, uses `daySeed` directly.
 * For weekly quests, uses `Math.floor(daySeed / 7)` so they rotate weekly.
 */
export function getActiveQuests(daySeed: number): Quest[] {
  const dailyQuests = pickFromPool(DAILY_QUEST_POOL, 3, daySeed);
  const weeklySeed = Math.floor(daySeed / 7);
  const weeklyQuests = pickFromPool(WEEKLY_QUEST_POOL, 3, weeklySeed);
  return [...dailyQuests, ...weeklyQuests];
}

function pickFromPool(pool: Quest[], count: number, seed: number): Quest[] {
  // Simple deterministic shuffle using seed
  const indices = pool.map((_, i) => i);
  const shuffled = [...indices];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map((i) => pool[i]);
}
