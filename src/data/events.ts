export interface GameEvent {
  id: string;
  name: string;
  icon: string;
  description: string;
  durationSec: number;
  effect: EventEffect;
  color: string;
}

export type EventEffect =
  | { type: "tapMultiplier"; value: number }
  | { type: "passiveMultiplier"; value: number }
  | { type: "taxDiscount"; value: number }
  | { type: "bonusCash"; value: number };

export const GAME_EVENTS: GameEvent[] = [
  {
    id: "borsa_rallisi",
    name: "Borsa Rallisi",
    icon: "📈",
    description: "Pasif gelirler 2 katına çıktı!",
    durationSec: 60,
    effect: { type: "passiveMultiplier", value: 2 },
    color: "#48BB78",
  },
  {
    id: "altin_firsati",
    name: "Altın Fırsatı",
    icon: "🪙",
    description: "Tap gelirleri 3 katına çıktı!",
    durationSec: 30,
    effect: { type: "tapMultiplier", value: 3 },
    color: "#F4C430",
  },
  {
    id: "musteri_akini",
    name: "Müşteri Akını",
    icon: "👥",
    description: "İşletme gelirleri 3 katına çıktı!",
    durationSec: 45,
    effect: { type: "passiveMultiplier", value: 3 },
    color: "#4299E1",
  },
  {
    id: "kripto_pump",
    name: "Kripto Pump",
    icon: "🚀",
    description: "Tap gelirleri 5 katına çıktı!",
    durationSec: 20,
    effect: { type: "tapMultiplier", value: 5 },
    color: "#9F7AEA",
  },
  {
    id: "vergi_indirimi",
    name: "Vergi İndirimi",
    icon: "🏛️",
    description: "Vergi borcu %50 azaldı!",
    durationSec: 0,
    effect: { type: "taxDiscount", value: 0.5 },
    color: "#48BB78",
  },
  {
    id: "bonus_odeme",
    name: "Devlet Teşviği",
    icon: "🎁",
    description: "Bonus nakit ödeme!",
    durationSec: 0,
    effect: { type: "bonusCash", value: 0 },
    color: "#F4C430",
  },
  {
    id: "mega_tap",
    name: "Mega Tap Festivali",
    icon: "🎉",
    description: "Tap gelirleri 10 katına çıktı!",
    durationSec: 15,
    effect: { type: "tapMultiplier", value: 10 },
    color: "#ED64A6",
  },
];
