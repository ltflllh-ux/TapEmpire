export interface WheelSegment {
  id: string;
  label: string;
  icon: string;
  reward: { type: "coins" | "diamonds" | "vip" | "boost"; amount: number };
  color: string;
  weight: number;
}

export const WHEEL_SEGMENTS: WheelSegment[] = [
  {
    id: "coins_5k",
    label: "₺5.000",
    icon: "🪙",
    reward: { type: "coins", amount: 5_000 },
    color: "#F4C430",
    weight: 25,
  },
  {
    id: "diamonds_5",
    label: "💎 5",
    icon: "💎",
    reward: { type: "diamonds", amount: 5 },
    color: "#1A2744",
    weight: 20,
  },
  {
    id: "coins_25k",
    label: "₺25.000",
    icon: "🪙",
    reward: { type: "coins", amount: 25_000 },
    color: "#48BB78",
    weight: 15,
  },
  {
    id: "diamonds_15",
    label: "💎 15",
    icon: "💎",
    reward: { type: "diamonds", amount: 15 },
    color: "#1A2744",
    weight: 12,
  },
  {
    id: "coins_100k",
    label: "₺100.000",
    icon: "💰",
    reward: { type: "coins", amount: 100_000 },
    color: "#F4C430",
    weight: 8,
  },
  {
    id: "vip_1day",
    label: "VIP 1 Gün",
    icon: "👑",
    reward: { type: "vip", amount: 1 },
    color: "#9F7AEA",
    weight: 5,
  },
  {
    id: "diamonds_50",
    label: "💎 50",
    icon: "💎",
    reward: { type: "diamonds", amount: 50 },
    color: "#1A2744",
    weight: 3,
  },
  {
    id: "coins_500k",
    label: "₺500.000",
    icon: "🎰",
    reward: { type: "coins", amount: 500_000 },
    color: "#ED64A6",
    weight: 2,
  },
];

export function spinWheel(): WheelSegment {
  const totalWeight = WHEEL_SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  for (const segment of WHEEL_SEGMENTS) {
    random -= segment.weight;
    if (random <= 0) return segment;
  }
  return WHEEL_SEGMENTS[0];
}
