import { create } from "zustand";
import { TAP_LEVELS } from "../data/tapLevels";
import { INVESTMENTS, getInvestmentCost, calcTotalPassiveIncome } from "../data/investments";
import { BUSINESSES, getBusinessUpgradeCost, calcTotalBusinessIncome } from "../data/businesses";
import { COLLECTIBLES, calcCollectibleBoosts } from "../data/collections";
import { saveGame, loadGame } from "../utils/saveLoad";

interface GameState {
  balance: number;
  totalEarned: number;

  tapLevel: number;
  tapValue: number;

  boostActive: boolean;
  boostMultiplier: number;
  boostEndTime: number;

  hourlyPassiveIncome: number;

  taxDebt: number;

  playerName: string;
  companyName: string;

  ownedInvestments: Record<string, number>;
  ownedBusinesses: Record<string, number>;
  ownedCollectibles: Record<string, boolean>;
  collectibleTapBoost: number;
  collectiblePassiveBoost: number;

  tap: () => void;
  buyInvestment: (id: string) => void;
  upgradeBusiness: (id: string) => void;
  buyCollectible: (id: string) => void;
  activateBoost: () => void;
  checkBoostExpiry: () => void;
  checkLevelUp: () => void;
  addPassiveIncome: (amount: number) => void;
  setPlayerInfo: (name: string, company: string) => void;
  payTax: () => void;
  resetGame: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  balance: 0,
  totalEarned: 0,

  tapLevel: 1,
  tapValue: 2,

  boostActive: false,
  boostMultiplier: 1,
  boostEndTime: 0,

  hourlyPassiveIncome: 0,

  taxDebt: 0,

  playerName: "",
  companyName: "",

  ownedInvestments: {},
  ownedBusinesses: {},
  ownedCollectibles: {},
  collectibleTapBoost: 0,
  collectiblePassiveBoost: 0,

  tap: () => {
    const { tapValue, boostActive, boostMultiplier, collectibleTapBoost } = get();
    const tapMult = 1 + collectibleTapBoost / 100;
    const earning = Math.floor(tapValue * (boostActive ? boostMultiplier : 1) * tapMult);
    set((s) => ({
      balance: s.balance + earning,
      totalEarned: s.totalEarned + earning,
      taxDebt: s.taxDebt + earning * 0.08,
    }));
    get().checkLevelUp();
  },

  activateBoost: () => {
    set({
      boostActive: true,
      boostMultiplier: 25,
      boostEndTime: Date.now() + 30_000,
    });
  },

  checkBoostExpiry: () => {
    const { boostActive, boostEndTime } = get();
    if (boostActive && Date.now() > boostEndTime) {
      set({ boostActive: false, boostMultiplier: 1 });
    }
  },

  checkLevelUp: () => {
    const { totalEarned, tapLevel } = get();
    if (tapLevel >= 20) return;
    const current = TAP_LEVELS[tapLevel - 1];
    if (totalEarned >= current.threshold) {
      const next = TAP_LEVELS[tapLevel];
      set({ tapLevel: next.level, tapValue: next.tapValue });
    }
  },

  addPassiveIncome: (amount: number) => {
    const passiveMult = 1 + get().collectiblePassiveBoost / 100;
    const boosted = amount * passiveMult;
    set((s) => ({
      balance: s.balance + boosted,
      totalEarned: s.totalEarned + boosted,
      taxDebt: s.taxDebt + boosted * 0.08,
    }));
  },

  buyInvestment: (id: string) => {
    const { balance, ownedInvestments, ownedBusinesses, collectiblePassiveBoost, tapLevel } = get();
    const inv = INVESTMENTS.find((i) => i.id === id);
    if (!inv || tapLevel < inv.unlockLevel) return;
    const owned = ownedInvestments[id] || 0;
    const cost = getInvestmentCost(inv, owned);
    if (balance < cost) return;
    const newOwned = { ...ownedInvestments, [id]: owned + 1 };
    const basePassive = calcTotalPassiveIncome(newOwned) + calcTotalBusinessIncome(ownedBusinesses);
    set({
      balance: balance - cost,
      ownedInvestments: newOwned,
      hourlyPassiveIncome: basePassive * (1 + collectiblePassiveBoost / 100),
    });
  },

  upgradeBusiness: (id: string) => {
    const { balance, ownedInvestments, ownedBusinesses, collectiblePassiveBoost, tapLevel } = get();
    const biz = BUSINESSES.find((b) => b.id === id);
    if (!biz || tapLevel < biz.unlockTapLevel) return;
    const level = ownedBusinesses[id] || 0;
    if (level >= biz.maxLevel) return;
    const cost = getBusinessUpgradeCost(biz, level);
    if (balance < cost) return;
    const newOwned = { ...ownedBusinesses, [id]: level + 1 };
    const basePassive = calcTotalPassiveIncome(ownedInvestments) + calcTotalBusinessIncome(newOwned);
    set({
      balance: balance - cost,
      ownedBusinesses: newOwned,
      hourlyPassiveIncome: basePassive * (1 + collectiblePassiveBoost / 100),
    });
  },

  buyCollectible: (id: string) => {
    const { balance, ownedCollectibles, ownedInvestments, ownedBusinesses, tapLevel } = get();
    const item = COLLECTIBLES.find((c) => c.id === id);
    if (!item || tapLevel < item.unlockLevel) return;
    if (ownedCollectibles[id]) return;
    if (balance < item.cost) return;
    const newOwned = { ...ownedCollectibles, [id]: true };
    const boosts = calcCollectibleBoosts(newOwned);
    const basePassive = calcTotalPassiveIncome(ownedInvestments) + calcTotalBusinessIncome(ownedBusinesses);
    set({
      balance: balance - item.cost,
      ownedCollectibles: newOwned,
      collectibleTapBoost: boosts.tapBoost,
      collectiblePassiveBoost: boosts.passiveBoost,
      hourlyPassiveIncome: basePassive * (1 + boosts.passiveBoost / 100),
    });
  },

  setPlayerInfo: (name: string, company: string) => {
    set({ playerName: name, companyName: company });
  },

  payTax: () => {
    const { balance, taxDebt } = get();
    if (taxDebt <= 0) return;
    const payment = Math.min(balance, taxDebt);
    set({
      balance: balance - payment,
      taxDebt: taxDebt - payment,
    });
  },

  resetGame: () => {
    set({
      balance: 0,
      totalEarned: 0,
      tapLevel: 1,
      tapValue: 2,
      boostActive: false,
      boostMultiplier: 1,
      boostEndTime: 0,
      hourlyPassiveIncome: 0,
      taxDebt: 0,
      playerName: "",
      companyName: "",
      ownedInvestments: {},
      ownedBusinesses: {},
      ownedCollectibles: {},
      collectibleTapBoost: 0,
      collectiblePassiveBoost: 0,
    });
    get().saveToStorage();
  },

  saveToStorage: () => {
    const s = get();
    saveGame({
      balance: s.balance,
      totalEarned: s.totalEarned,
      tapLevel: s.tapLevel,
      tapValue: s.tapValue,
      boostActive: s.boostActive,
      boostEndTime: s.boostEndTime,
      hourlyPassiveIncome: s.hourlyPassiveIncome,
      taxDebt: s.taxDebt,
      playerName: s.playerName,
      companyName: s.companyName,
      ownedInvestments: s.ownedInvestments,
      ownedBusinesses: s.ownedBusinesses,
      ownedCollectibles: s.ownedCollectibles,
    });
  },

  loadFromStorage: async () => {
    const data = await loadGame();
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      set({
        balance: (d.balance as number) ?? 0,
        totalEarned: (d.totalEarned as number) ?? 0,
        tapLevel: (d.tapLevel as number) ?? 1,
        tapValue: (d.tapValue as number) ?? 2,
        boostActive: (d.boostActive as boolean) ?? false,
        boostEndTime: (d.boostEndTime as number) ?? 0,
        taxDebt: (d.taxDebt as number) ?? 0,
        playerName: (d.playerName as string) ?? "",
        companyName: (d.companyName as string) ?? "",
        ownedInvestments: (d.ownedInvestments as Record<string, number>) ?? {},
        ownedBusinesses: (d.ownedBusinesses as Record<string, number>) ?? {},
        ownedCollectibles: (d.ownedCollectibles as Record<string, boolean>) ?? {},
        collectibleTapBoost: calcCollectibleBoosts((d.ownedCollectibles as Record<string, boolean>) ?? {}).tapBoost,
        collectiblePassiveBoost: calcCollectibleBoosts((d.ownedCollectibles as Record<string, boolean>) ?? {}).passiveBoost,
        hourlyPassiveIncome:
          (calcTotalPassiveIncome((d.ownedInvestments as Record<string, number>) ?? {}) +
          calcTotalBusinessIncome((d.ownedBusinesses as Record<string, number>) ?? {})) *
          (1 + calcCollectibleBoosts((d.ownedCollectibles as Record<string, boolean>) ?? {}).passiveBoost / 100),
      });
    }
  },
}));

useGameStore.getState().loadFromStorage();
