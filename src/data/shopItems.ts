export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  category: "vip" | "diamonds" | "coins";
  description: string;
  price: string;
  reward: {
    type: "vip" | "diamonds" | "coins";
    amount: number;
  };
  popular?: boolean;
  bestValue?: boolean;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "vip_weekly",
    name: "VIP Haftalık",
    icon: "👑",
    category: "vip",
    description: "7 gün: Timer yok, 2x çarpan, VIP rozet",
    price: "₺49,99",
    reward: { type: "vip", amount: 7 },
    popular: true,
  },
  {
    id: "vip_monthly",
    name: "VIP Aylık",
    icon: "👑",
    category: "vip",
    description: "30 gün: Timer yok, 2x çarpan, VIP rozet",
    price: "₺149,99",
    reward: { type: "vip", amount: 30 },
    bestValue: true,
  },
  {
    id: "diamond_small",
    name: "Küçük Elmas Paketi",
    icon: "💎",
    category: "diamonds",
    description: "50 Elmas",
    price: "₺29,99",
    reward: { type: "diamonds", amount: 50 },
  },
  {
    id: "diamond_medium",
    name: "Orta Elmas Paketi",
    icon: "💎",
    category: "diamonds",
    description: "150 Elmas",
    price: "₺69,99",
    reward: { type: "diamonds", amount: 150 },
    popular: true,
  },
  {
    id: "diamond_large",
    name: "Büyük Elmas Paketi",
    icon: "💎",
    category: "diamonds",
    description: "500 Elmas",
    price: "₺149,99",
    reward: { type: "diamonds", amount: 500 },
    bestValue: true,
  },
  {
    id: "diamond_mega",
    name: "Mega Elmas Paketi",
    icon: "💎",
    category: "diamonds",
    description: "1200 Elmas",
    price: "₺249,99",
    reward: { type: "diamonds", amount: 1200 },
  },
  {
    id: "coin_small",
    name: "Küçük Altın Paketi",
    icon: "🪙",
    category: "coins",
    description: "100.000 TL",
    price: "₺19,99",
    reward: { type: "coins", amount: 100_000 },
  },
  {
    id: "coin_medium",
    name: "Orta Altın Paketi",
    icon: "🪙",
    category: "coins",
    description: "1.000.000 TL",
    price: "₺59,99",
    reward: { type: "coins", amount: 1_000_000 },
    popular: true,
  },
  {
    id: "coin_large",
    name: "Büyük Altın Paketi",
    icon: "🪙",
    category: "coins",
    description: "10.000.000 TL",
    price: "₺129,99",
    reward: { type: "coins", amount: 10_000_000 },
    bestValue: true,
  },
];

export const SHOP_CATEGORIES = ["Tümü", "VIP", "Elmas", "Altın"];
