import { create } from "zustand";
import { TAP_LEVELS } from "../data/tapLevels";
import { INVESTMENTS, getInvestmentCost, calcTotalPassiveIncome } from "../data/investments";
import { BUSINESSES, getBusinessUpgradeCost, calcTotalBusinessIncome } from "../data/businesses";
import { COLLECTIBLES, calcCollectibleBoosts } from "../data/collections";
import { ACHIEVEMENTS } from "../data/achievements";
import { SHOP_ITEMS } from "../data/shopItems";
import { MANAGERS } from "../data/managers";
import { getTimerDuration } from "../data/timerConfig";
import { saveGame, loadGame } from "../utils/saveLoad";
import { getActiveQuests } from "../data/quests";

function calcPassiveWithTimers(
  inv: Record<string, number>,
  biz: Record<string, number>,
  invTimers: Record<string, number>,
  bizTimers: Record<string, number>,
  passiveBoostPct: number,
  prestigeMult: number,
  vipMult: number,
) {
  const now = Date.now();
  const effectiveInv: Record<string, number> = {};
  for (const [id, count] of Object.entries(inv)) {
    if (invTimers[id] && invTimers[id] > now) {
      effectiveInv[id] = Math.max(0, count - 1);
    } else {
      effectiveInv[id] = count;
    }
  }
  const effectiveBiz: Record<string, number> = {};
  for (const [id, level] of Object.entries(biz)) {
    if (bizTimers[id] && bizTimers[id] > now) {
      effectiveBiz[id] = Math.max(0, level - 1);
    } else {
      effectiveBiz[id] = level;
    }
  }
  const base = calcTotalPassiveIncome(effectiveInv) + calcTotalBusinessIncome(effectiveBiz);
  return base * (1 + passiveBoostPct / 100) * prestigeMult * vipMult;
}

interface GameState {
  balance: number;
  totalEarned: number;
  totalTaps: number;
  lastSaveTime: number;

  tapLevel: number;
  tapValue: number;

  boostActive: boolean;
  boostMultiplier: number;
  boostEndTime: number;

  hourlyPassiveIncome: number;

  taxDebt: number;
  taxPaid: number;

  playerName: string;
  companyName: string;
  onboardingDone: boolean;

  ownedInvestments: Record<string, number>;
  ownedBusinesses: Record<string, number>;
  ownedCollectibles: Record<string, boolean>;
  collectibleTapBoost: number;
  collectiblePassiveBoost: number;

  lastDailyClaimDate: string;
  dailyStreak: number;

  prestigeLevel: number;
  prestigeMultiplier: number;
  lifetimeEarned: number;

  claimedAchievements: Record<string, string[]>;

  activeEventId: string | null;
  eventEndTime: number;
  eventTapMult: number;
  eventPassiveMult: number;

  // Timers
  businessTimers: Record<string, number>;
  investmentTimers: Record<string, number>;

  // Shop / VIP
  diamonds: number;
  isVip: boolean;
  vipEndTime: number;

  // Managers
  ownedManagers: string[];
  assignedManagers: Record<string, string>;

  // Quest tracking
  questProgress: Record<string, number>;
  claimedQuests: string[];
  lastQuestResetDate: string;
  lastWeeklyResetDate: string;

  // Wheel
  lastWheelSpinDate: string;
  wheelSpinsToday: number;

  // Actions
  tap: (comboMult?: number) => void;
  buyInvestment: (id: string) => void;
  upgradeBusiness: (id: string) => void;
  buyCollectible: (id: string) => void;
  activateBoost: () => void;
  checkBoostExpiry: () => void;
  checkLevelUp: () => void;
  addPassiveIncome: (amount: number) => void;
  setPlayerInfo: (name: string, company: string) => void;
  finishOnboarding: (name: string, company: string) => void;
  payTax: () => void;
  claimDailyReward: (amount: number) => void;
  canClaimDaily: () => boolean;
  prestige: () => void;
  claimAchievement: (id: string, tier: string) => void;
  checkAchievements: () => { id: string; tier: string; reward: number }[];
  startEvent: (eventId: string, durationSec: number, tapMult: number, passiveMult: number) => void;
  clearEvent: () => void;
  applyOfflineEarnings: () => number;
  skipTimer: (type: "business" | "investment", id: string) => boolean;
  checkTimerCompletions: () => void;
  isTimerActive: (type: "business" | "investment", id: string) => boolean;
  getTimerRemaining: (type: "business" | "investment", id: string) => number;
  purchaseShopItem: (id: string) => boolean;
  checkVipExpiry: () => void;
  hireManager: (managerId: string) => void;
  assignManager: (managerId: string, businessId: string) => void;
  unassignManager: (managerId: string) => void;
  getBusinessManagerBonus: (businessId: string) => { speedMult: number; incomeMult: number; costReduction: number };
  updateQuestProgress: (key: string, amount: number) => void;
  claimQuestReward: (questId: string) => void;
  checkQuestReset: () => void;
  canSpinFree: () => boolean;
  recordWheelSpin: () => void;
  resetGame: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  balance: 0,
  totalEarned: 0,
  totalTaps: 0,
  lastSaveTime: Date.now(),

  tapLevel: 1,
  tapValue: 2,

  boostActive: false,
  boostMultiplier: 1,
  boostEndTime: 0,

  hourlyPassiveIncome: 0,

  taxDebt: 0,
  taxPaid: 0,

  playerName: "",
  companyName: "",
  onboardingDone: false,

  lastDailyClaimDate: "",
  dailyStreak: 0,

  ownedInvestments: {},
  ownedBusinesses: {},
  ownedCollectibles: {},
  collectibleTapBoost: 0,
  collectiblePassiveBoost: 0,

  prestigeLevel: 0,
  prestigeMultiplier: 1,
  lifetimeEarned: 0,

  claimedAchievements: {},

  activeEventId: null,
  eventEndTime: 0,
  eventTapMult: 1,
  eventPassiveMult: 1,

  businessTimers: {},
  investmentTimers: {},

  diamonds: 0,
  isVip: false,
  vipEndTime: 0,

  questProgress: {},
  claimedQuests: [],
  lastQuestResetDate: "",
  lastWeeklyResetDate: "",

  ownedManagers: [],
  assignedManagers: {},

  lastWheelSpinDate: "",
  wheelSpinsToday: 0,

  tap: (comboMult?: number) => {
    const {
      tapValue, boostActive, boostMultiplier,
      collectibleTapBoost, prestigeMultiplier, eventTapMult, isVip,
    } = get();
    const vipMult = isVip ? 2 : 1;
    const tapMult = (1 + collectibleTapBoost / 100) * prestigeMultiplier * eventTapMult * (comboMult ?? 1) * vipMult;
    const earning = Math.floor(tapValue * (boostActive ? boostMultiplier : 1) * tapMult);
    set((s) => ({
      balance: s.balance + earning,
      totalEarned: s.totalEarned + earning,
      lifetimeEarned: s.lifetimeEarned + earning,
      totalTaps: s.totalTaps + 1,
      taxDebt: s.taxDebt + earning * 0.08,
    }));
    get().checkLevelUp();
    get().updateQuestProgress("totalTaps", 1);
    get().updateQuestProgress("totalEarned", earning);
  },

  activateBoost: () => {
    set({
      boostActive: true,
      boostMultiplier: 25,
      boostEndTime: Date.now() + 30_000,
    });
    get().updateQuestProgress("boostsUsed", 1);
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
    const { collectiblePassiveBoost, prestigeMultiplier, eventPassiveMult, isVip } = get();
    const vipMult = isVip ? 2 : 1;
    const boosted = amount * (1 + collectiblePassiveBoost / 100) * prestigeMultiplier * eventPassiveMult * vipMult;
    set((s) => ({
      balance: s.balance + boosted,
      totalEarned: s.totalEarned + boosted,
      lifetimeEarned: s.lifetimeEarned + boosted,
      taxDebt: s.taxDebt + boosted * 0.08,
    }));
  },

  buyInvestment: (id: string) => {
    const s = get();
    const inv = INVESTMENTS.find((i) => i.id === id);
    if (!inv || s.tapLevel < inv.unlockLevel) return;
    const owned = s.ownedInvestments[id] || 0;
    const cost = getInvestmentCost(inv, owned);
    if (s.balance < cost) return;
    const newOwned = { ...s.ownedInvestments, [id]: owned + 1 };
    const newLevel = owned + 1;
    const vipMult = s.isVip ? 2 : 1;

    if (s.isVip) {
      set({
        balance: s.balance - cost,
        ownedInvestments: newOwned,
        hourlyPassiveIncome: calcPassiveWithTimers(
          newOwned, s.ownedBusinesses,
          s.investmentTimers, s.businessTimers,
          s.collectiblePassiveBoost, s.prestigeMultiplier, vipMult,
        ),
      });
    } else {
      const duration = getTimerDuration(newLevel);
      const newTimers = { ...s.investmentTimers, [id]: Date.now() + duration * 1000 };
      set({
        balance: s.balance - cost,
        ownedInvestments: newOwned,
        investmentTimers: newTimers,
        hourlyPassiveIncome: calcPassiveWithTimers(
          newOwned, s.ownedBusinesses,
          newTimers, s.businessTimers,
          s.collectiblePassiveBoost, s.prestigeMultiplier, vipMult,
        ),
      });
    }
    get().updateQuestProgress("investmentsBought", 1);
  },

  upgradeBusiness: (id: string) => {
    const s = get();
    const biz = BUSINESSES.find((b) => b.id === id);
    if (!biz || s.tapLevel < biz.unlockTapLevel) return;
    const level = s.ownedBusinesses[id] || 0;
    if (level >= biz.maxLevel) return;
    const cost = getBusinessUpgradeCost(biz, level);
    if (s.balance < cost) return;
    const newOwned = { ...s.ownedBusinesses, [id]: level + 1 };
    const newLevel = level + 1;
    const vipMult = s.isVip ? 2 : 1;

    if (s.isVip) {
      set({
        balance: s.balance - cost,
        ownedBusinesses: newOwned,
        hourlyPassiveIncome: calcPassiveWithTimers(
          s.ownedInvestments, newOwned,
          s.investmentTimers, s.businessTimers,
          s.collectiblePassiveBoost, s.prestigeMultiplier, vipMult,
        ),
      });
    } else {
      const duration = getTimerDuration(newLevel);
      const newTimers = { ...s.businessTimers, [id]: Date.now() + duration * 1000 };
      set({
        balance: s.balance - cost,
        ownedBusinesses: newOwned,
        businessTimers: newTimers,
        hourlyPassiveIncome: calcPassiveWithTimers(
          s.ownedInvestments, newOwned,
          s.investmentTimers, newTimers,
          s.collectiblePassiveBoost, s.prestigeMultiplier, vipMult,
        ),
      });
    }
    get().updateQuestProgress("businessesUpgraded", 1);
  },

  buyCollectible: (id: string) => {
    const s = get();
    const item = COLLECTIBLES.find((c) => c.id === id);
    if (!item || s.tapLevel < item.unlockLevel) return;
    if (s.ownedCollectibles[id]) return;
    if (s.balance < item.cost) return;
    const newOwned = { ...s.ownedCollectibles, [id]: true };
    const boosts = calcCollectibleBoosts(newOwned);
    const vipMult = s.isVip ? 2 : 1;
    set({
      balance: s.balance - item.cost,
      ownedCollectibles: newOwned,
      collectibleTapBoost: boosts.tapBoost,
      collectiblePassiveBoost: boosts.passiveBoost,
      hourlyPassiveIncome: calcPassiveWithTimers(
        s.ownedInvestments, s.ownedBusinesses,
        s.investmentTimers, s.businessTimers,
        boosts.passiveBoost, s.prestigeMultiplier, vipMult,
      ),
    });
    get().updateQuestProgress("collectiblesBought", 1);
  },

  setPlayerInfo: (name: string, company: string) => {
    set({ playerName: name, companyName: company });
  },

  finishOnboarding: (name: string, company: string) => {
    set({ playerName: name, companyName: company, onboardingDone: true });
    get().saveToStorage();
  },

  payTax: () => {
    const { balance, taxDebt } = get();
    if (taxDebt <= 0) return;
    const payment = Math.min(balance, taxDebt);
    set((s) => ({
      balance: s.balance - payment,
      taxDebt: s.taxDebt - payment,
      taxPaid: s.taxPaid + payment,
    }));
    get().updateQuestProgress("taxPaid", 1);
  },

  claimDailyReward: (amount: number) => {
    const today = new Date().toISOString().split("T")[0];
    set((s) => ({
      balance: s.balance + amount,
      totalEarned: s.totalEarned + amount,
      lifetimeEarned: s.lifetimeEarned + amount,
      lastDailyClaimDate: today,
      dailyStreak: s.dailyStreak + 1,
    }));
    get().saveToStorage();
  },

  canClaimDaily: () => {
    const { lastDailyClaimDate } = get();
    if (!lastDailyClaimDate) return true;
    const today = new Date().toISOString().split("T")[0];
    return lastDailyClaimDate !== today;
  },

  skipTimer: (type: "business" | "investment", id: string) => {
    const s = get();
    if (s.isVip) {
      const timers = type === "business" ? { ...s.businessTimers } : { ...s.investmentTimers };
      delete timers[id];
      const vipMult = 2;
      const newBizTimers = type === "business" ? timers : s.businessTimers;
      const newInvTimers = type === "investment" ? timers : s.investmentTimers;
      set({
        [type === "business" ? "businessTimers" : "investmentTimers"]: timers,
        hourlyPassiveIncome: calcPassiveWithTimers(
          s.ownedInvestments, s.ownedBusinesses,
          newInvTimers, newBizTimers,
          s.collectiblePassiveBoost, s.prestigeMultiplier, vipMult,
        ),
      } as Partial<GameState>);
      return true;
    }
    if (s.diamonds >= 5) {
      const timers = type === "business" ? { ...s.businessTimers } : { ...s.investmentTimers };
      delete timers[id];
      const vipMult = 1;
      const newBizTimers = type === "business" ? timers : s.businessTimers;
      const newInvTimers = type === "investment" ? timers : s.investmentTimers;
      set({
        diamonds: s.diamonds - 5,
        [type === "business" ? "businessTimers" : "investmentTimers"]: timers,
        hourlyPassiveIncome: calcPassiveWithTimers(
          s.ownedInvestments, s.ownedBusinesses,
          newInvTimers, newBizTimers,
          s.collectiblePassiveBoost, s.prestigeMultiplier, vipMult,
        ),
      } as Partial<GameState>);
      return true;
    }
    return false;
  },

  checkTimerCompletions: () => {
    const s = get();
    const now = Date.now();
    let changed = false;
    const newBizTimers = { ...s.businessTimers };
    for (const [id, end] of Object.entries(newBizTimers)) {
      if (end <= now) {
        delete newBizTimers[id];
        changed = true;
      }
    }
    const newInvTimers = { ...s.investmentTimers };
    for (const [id, end] of Object.entries(newInvTimers)) {
      if (end <= now) {
        delete newInvTimers[id];
        changed = true;
      }
    }
    if (changed) {
      const vipMult = s.isVip ? 2 : 1;
      set({
        businessTimers: newBizTimers,
        investmentTimers: newInvTimers,
        hourlyPassiveIncome: calcPassiveWithTimers(
          s.ownedInvestments, s.ownedBusinesses,
          newInvTimers, newBizTimers,
          s.collectiblePassiveBoost, s.prestigeMultiplier, vipMult,
        ),
      });
    }
  },

  isTimerActive: (type: "business" | "investment", id: string) => {
    const timers = type === "business" ? get().businessTimers : get().investmentTimers;
    return !!timers[id] && timers[id] > Date.now();
  },

  getTimerRemaining: (type: "business" | "investment", id: string) => {
    const timers = type === "business" ? get().businessTimers : get().investmentTimers;
    if (!timers[id]) return 0;
    return Math.max(0, Math.ceil((timers[id] - Date.now()) / 1000));
  },

  purchaseShopItem: (id: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === id);
    if (!item) return false;
    const s = get();

    if (item.reward.type === "vip") {
      const days = item.reward.amount;
      const currentEnd = s.isVip ? s.vipEndTime : Date.now();
      const newEnd = currentEnd + days * 86400000;
      const newBizTimers: Record<string, number> = {};
      const newInvTimers: Record<string, number> = {};
      set({
        isVip: true,
        vipEndTime: newEnd,
        businessTimers: newBizTimers,
        investmentTimers: newInvTimers,
        hourlyPassiveIncome: calcPassiveWithTimers(
          s.ownedInvestments, s.ownedBusinesses,
          newInvTimers, newBizTimers,
          s.collectiblePassiveBoost, s.prestigeMultiplier, 2,
        ),
      });
    } else if (item.reward.type === "diamonds") {
      set({ diamonds: s.diamonds + item.reward.amount });
    } else if (item.reward.type === "coins") {
      set((prev) => ({
        balance: prev.balance + item.reward.amount,
        totalEarned: prev.totalEarned + item.reward.amount,
        lifetimeEarned: prev.lifetimeEarned + item.reward.amount,
      }));
    }
    get().saveToStorage();
    return true;
  },

  checkVipExpiry: () => {
    const { isVip, vipEndTime } = get();
    if (isVip && Date.now() > vipEndTime) {
      const s = get();
      set({
        isVip: false,
        vipEndTime: 0,
        hourlyPassiveIncome: calcPassiveWithTimers(
          s.ownedInvestments, s.ownedBusinesses,
          s.investmentTimers, s.businessTimers,
          s.collectiblePassiveBoost, s.prestigeMultiplier, 1,
        ),
      });
    }
  },

  prestige: () => {
    const s = get();
    if (s.totalEarned < 10_000_000) return;
    const newLevel = s.prestigeLevel + 1;
    const newMult = 1 + newLevel * 0.25;
    set({
      balance: 0,
      totalEarned: 0,
      totalTaps: 0,
      tapLevel: 1,
      tapValue: 2,
      boostActive: false,
      boostMultiplier: 1,
      boostEndTime: 0,
      hourlyPassiveIncome: 0,
      taxDebt: 0,
      ownedInvestments: {},
      ownedBusinesses: {},
      ownedCollectibles: {},
      collectibleTapBoost: 0,
      collectiblePassiveBoost: 0,
      prestigeLevel: newLevel,
      prestigeMultiplier: newMult,
      businessTimers: {},
      investmentTimers: {},
      activeEventId: null,
      eventEndTime: 0,
      eventTapMult: 1,
      eventPassiveMult: 1,
    });
    get().saveToStorage();
  },

  claimAchievement: (id: string, tier: string) => {
    const s = get();
    const claimed = s.claimedAchievements[id] || [];
    if (claimed.includes(tier)) return;
    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (!ach) return;
    const tierData = ach.tiers.find((t) => t.tier === tier);
    if (!tierData) return;
    set({
      claimedAchievements: {
        ...s.claimedAchievements,
        [id]: [...claimed, tier],
      },
      balance: s.balance + tierData.reward,
    });
  },

  checkAchievements: () => {
    const s = get();
    const investmentCount = Object.values(s.ownedInvestments).reduce((a, b) => a + b, 0);
    const businessCount = Object.values(s.ownedBusinesses).filter((v) => v > 0).length;
    const collectibleCount = Object.values(s.ownedCollectibles).filter(Boolean).length;
    const state = {
      totalEarned: s.totalEarned,
      tapLevel: s.tapLevel,
      totalTaps: s.totalTaps,
      investmentCount,
      businessCount,
      collectibleCount,
      taxPaid: s.taxPaid,
      prestigeLevel: s.prestigeLevel,
    };
    const unclaimed: { id: string; tier: string; reward: number }[] = [];
    for (const ach of ACHIEVEMENTS) {
      const val = ach.getValue(state);
      const claimed = s.claimedAchievements[ach.id] || [];
      for (const t of ach.tiers) {
        if (val >= t.target && !claimed.includes(t.tier)) {
          unclaimed.push({ id: ach.id, tier: t.tier, reward: t.reward });
        }
      }
    }
    return unclaimed;
  },

  startEvent: (eventId, durationSec, tapMult, passiveMult) => {
    set({
      activeEventId: eventId,
      eventEndTime: Date.now() + durationSec * 1000,
      eventTapMult: tapMult,
      eventPassiveMult: passiveMult,
    });
  },

  clearEvent: () => {
    set({
      activeEventId: null,
      eventEndTime: 0,
      eventTapMult: 1,
      eventPassiveMult: 1,
    });
  },

  applyOfflineEarnings: () => {
    const { lastSaveTime, hourlyPassiveIncome } = get();
    if (hourlyPassiveIncome <= 0 || lastSaveTime <= 0) return 0;
    const elapsed = (Date.now() - lastSaveTime) / 1000;
    const maxOfflineSec = 4 * 3600;
    const sec = Math.min(elapsed, maxOfflineSec);
    if (sec < 60) return 0;
    const earned = (hourlyPassiveIncome / 3600) * sec;
    set((s) => ({
      balance: s.balance + earned,
      totalEarned: s.totalEarned + earned,
      lifetimeEarned: s.lifetimeEarned + earned,
    }));
    return earned;
  },

  hireManager: (managerId: string) => {
    const s = get();
    const manager = MANAGERS.find((m) => m.id === managerId);
    if (!manager) return;
    if (s.ownedManagers.includes(managerId)) return;
    if (s.diamonds < manager.cost) return;
    set({
      diamonds: s.diamonds - manager.cost,
      ownedManagers: [...s.ownedManagers, managerId],
    });
    get().saveToStorage();
  },

  assignManager: (managerId: string, businessId: string) => {
    const s = get();
    if (!s.ownedManagers.includes(managerId)) return;
    const alreadyAssigned = Object.values(s.assignedManagers).includes(managerId);
    if (alreadyAssigned) return;
    set({
      assignedManagers: { ...s.assignedManagers, [businessId]: managerId },
    });
    get().saveToStorage();
  },

  unassignManager: (managerId: string) => {
    const s = get();
    const newAssigned = { ...s.assignedManagers };
    for (const [bizId, mgrId] of Object.entries(newAssigned)) {
      if (mgrId === managerId) {
        delete newAssigned[bizId];
        break;
      }
    }
    set({ assignedManagers: newAssigned });
    get().saveToStorage();
  },

  getBusinessManagerBonus: (businessId: string) => {
    const s = get();
    const managerId = s.assignedManagers[businessId];
    if (!managerId) return { speedMult: 1, incomeMult: 1, costReduction: 0 };
    const manager = MANAGERS.find((m) => m.id === managerId);
    if (!manager) return { speedMult: 1, incomeMult: 1, costReduction: 0 };
    let speedMult = 1;
    let incomeMult = 1;
    let costReduction = 0;
    switch (manager.ability.type) {
      case "speed":
        speedMult = 1 + manager.ability.value / 100;
        break;
      case "multiplier":
        incomeMult = manager.ability.value;
        break;
      case "costReduction":
        costReduction = manager.ability.value;
        break;
      case "combined":
        incomeMult = manager.ability.value;
        costReduction = manager.ability.secondaryValue ?? 0;
        break;
    }
    return { speedMult, incomeMult, costReduction };
  },

  updateQuestProgress: (key: string, amount: number) => {
    const s = get();
    const daySeed = new Date().getFullYear() * 10000 + new Date().getMonth() * 100 + new Date().getDate();
    const activeQuests = getActiveQuests(daySeed);
    const matching = activeQuests.filter((q) => q.trackingKey === key);
    if (matching.length === 0) return;
    const newProgress = { ...s.questProgress };
    for (const q of matching) {
      if (s.claimedQuests.includes(q.id)) continue;
      newProgress[q.id] = (newProgress[q.id] || 0) + amount;
    }
    set({ questProgress: newProgress });
  },

  claimQuestReward: (questId: string) => {
    const s = get();
    if (s.claimedQuests.includes(questId)) return;
    const daySeed = new Date().getFullYear() * 10000 + new Date().getMonth() * 100 + new Date().getDate();
    const activeQuests = getActiveQuests(daySeed);
    const quest = activeQuests.find((q) => q.id === questId);
    if (!quest) return;
    const progress = s.questProgress[questId] || 0;
    if (progress < quest.target) return;
    const updates: Partial<GameState> = { claimedQuests: [...s.claimedQuests, questId] };
    if (quest.reward.type === "coins") {
      updates.balance = s.balance + quest.reward.amount;
      updates.totalEarned = s.totalEarned + quest.reward.amount;
      updates.lifetimeEarned = s.lifetimeEarned + quest.reward.amount;
    } else {
      updates.diamonds = s.diamonds + quest.reward.amount;
    }
    set(updates);
    get().saveToStorage();
  },

  checkQuestReset: () => {
    const s = get();
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - jan1.getTime()) / 86400000) + 1;
    const weekKey = `${now.getFullYear()}-W${Math.ceil(dayOfYear / 7)}`;
    let needsUpdate = false;
    const updates: Partial<GameState> = {};
    if (s.lastQuestResetDate !== today) {
      const daySeed = now.getFullYear() * 10000 + now.getMonth() * 100 + now.getDate();
      const activeQuests = getActiveQuests(daySeed);
      const dailyIds = activeQuests.filter((q) => q.type === "daily").map((q) => q.id);
      const newProgress = { ...s.questProgress };
      for (const id of dailyIds) { newProgress[id] = 0; }
      updates.questProgress = newProgress;
      updates.claimedQuests = s.claimedQuests.filter((cid) => !dailyIds.includes(cid) && !cid.startsWith("daily_"));
      updates.lastQuestResetDate = today;
      needsUpdate = true;
    }
    if (s.lastWeeklyResetDate !== weekKey) {
      const daySeed = now.getFullYear() * 10000 + now.getMonth() * 100 + now.getDate();
      const activeQuests = getActiveQuests(daySeed);
      const weeklyIds = activeQuests.filter((q) => q.type === "weekly").map((q) => q.id);
      const ep = updates.questProgress || { ...s.questProgress };
      for (const wid of weeklyIds) { ep[wid] = 0; }
      updates.questProgress = ep;
      const ec = updates.claimedQuests || [...s.claimedQuests];
      updates.claimedQuests = ec.filter((cid) => !weeklyIds.includes(cid) && !cid.startsWith("weekly_"));
      updates.lastWeeklyResetDate = weekKey;
      needsUpdate = true;
    }
    if (needsUpdate) { set(updates); get().saveToStorage(); }
  },

  canSpinFree: () => {
    const { lastWheelSpinDate, wheelSpinsToday } = get();
    const today = new Date().toISOString().split("T")[0];
    if (lastWheelSpinDate !== today) return true;
    return wheelSpinsToday < 1;
  },

  recordWheelSpin: () => {
    const today = new Date().toISOString().split("T")[0];
    const { lastWheelSpinDate } = get();
    if (lastWheelSpinDate !== today) {
      set({ lastWheelSpinDate: today, wheelSpinsToday: 1 });
    } else {
      set((s) => ({ wheelSpinsToday: s.wheelSpinsToday + 1, lastWheelSpinDate: today }));
    }
  },

  resetGame: () => {
    set({
      balance: 0,
      totalEarned: 0,
      totalTaps: 0,
      lastSaveTime: Date.now(),
      tapLevel: 1,
      tapValue: 2,
      boostActive: false,
      boostMultiplier: 1,
      boostEndTime: 0,
      hourlyPassiveIncome: 0,
      taxDebt: 0,
      taxPaid: 0,
      playerName: "",
      companyName: "",
      onboardingDone: false,
      ownedInvestments: {},
      ownedBusinesses: {},
      ownedCollectibles: {},
      collectibleTapBoost: 0,
      collectiblePassiveBoost: 0,
      prestigeLevel: 0,
      prestigeMultiplier: 1,
      lifetimeEarned: 0,
      claimedAchievements: {},
      lastDailyClaimDate: "",
      dailyStreak: 0,
      businessTimers: {},
      investmentTimers: {},
      diamonds: 0,
      isVip: false,
      vipEndTime: 0,
      ownedManagers: [],
      assignedManagers: {},
      questProgress: {},
      claimedQuests: [],
      lastQuestResetDate: "",
      lastWeeklyResetDate: "",
      lastWheelSpinDate: "",
      wheelSpinsToday: 0,
      activeEventId: null,
      eventEndTime: 0,
      eventTapMult: 1,
      eventPassiveMult: 1,
    });
    get().saveToStorage();
  },

  saveToStorage: () => {
    const s = get();
    saveGame({
      balance: s.balance,
      totalEarned: s.totalEarned,
      totalTaps: s.totalTaps,
      lastSaveTime: Date.now(),
      tapLevel: s.tapLevel,
      tapValue: s.tapValue,
      boostActive: s.boostActive,
      boostEndTime: s.boostEndTime,
      taxDebt: s.taxDebt,
      taxPaid: s.taxPaid,
      playerName: s.playerName,
      companyName: s.companyName,
      onboardingDone: s.onboardingDone,
      ownedInvestments: s.ownedInvestments,
      ownedBusinesses: s.ownedBusinesses,
      ownedCollectibles: s.ownedCollectibles,
      prestigeLevel: s.prestigeLevel,
      prestigeMultiplier: s.prestigeMultiplier,
      lifetimeEarned: s.lifetimeEarned,
      claimedAchievements: s.claimedAchievements,
      lastDailyClaimDate: s.lastDailyClaimDate,
      dailyStreak: s.dailyStreak,
      businessTimers: s.businessTimers,
      investmentTimers: s.investmentTimers,
      diamonds: s.diamonds,
      isVip: s.isVip,
      vipEndTime: s.vipEndTime,
      ownedManagers: s.ownedManagers,
      assignedManagers: s.assignedManagers,
      questProgress: s.questProgress,
      claimedQuests: s.claimedQuests,
      lastQuestResetDate: s.lastQuestResetDate,
      lastWeeklyResetDate: s.lastWeeklyResetDate,
      lastWheelSpinDate: s.lastWheelSpinDate,
      wheelSpinsToday: s.wheelSpinsToday,
    });
  },

  loadFromStorage: async () => {
    const data = await loadGame();
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      const collectibles = (d.ownedCollectibles as Record<string, boolean>) ?? {};
      const investments = (d.ownedInvestments as Record<string, number>) ?? {};
      const businesses = (d.ownedBusinesses as Record<string, number>) ?? {};
      const boosts = calcCollectibleBoosts(collectibles);
      const prestige = (d.prestigeMultiplier as number) ?? 1;
      const bizTimers = (d.businessTimers as Record<string, number>) ?? {};
      const invTimers = (d.investmentTimers as Record<string, number>) ?? {};
      const vip = (d.isVip as boolean) ?? false;
      const vipEnd = (d.vipEndTime as number) ?? 0;
      const isStillVip = vip && vipEnd > Date.now();
      const vipMult = isStillVip ? 2 : 1;

      // Clear expired timers on load
      const now = Date.now();
      const cleanBizTimers: Record<string, number> = {};
      for (const [id, end] of Object.entries(bizTimers)) {
        if (end > now) cleanBizTimers[id] = end;
      }
      const cleanInvTimers: Record<string, number> = {};
      for (const [id, end] of Object.entries(invTimers)) {
        if (end > now) cleanInvTimers[id] = end;
      }

      set({
        balance: (d.balance as number) ?? 0,
        totalEarned: (d.totalEarned as number) ?? 0,
        totalTaps: (d.totalTaps as number) ?? 0,
        lastSaveTime: (d.lastSaveTime as number) ?? Date.now(),
        tapLevel: (d.tapLevel as number) ?? 1,
        tapValue: (d.tapValue as number) ?? 2,
        boostActive: (d.boostActive as boolean) ?? false,
        boostEndTime: (d.boostEndTime as number) ?? 0,
        taxDebt: (d.taxDebt as number) ?? 0,
        taxPaid: (d.taxPaid as number) ?? 0,
        playerName: (d.playerName as string) ?? "",
        companyName: (d.companyName as string) ?? "",
        onboardingDone: (d.onboardingDone as boolean) ?? false,
        ownedInvestments: investments,
        ownedBusinesses: businesses,
        ownedCollectibles: collectibles,
        collectibleTapBoost: boosts.tapBoost,
        collectiblePassiveBoost: boosts.passiveBoost,
        hourlyPassiveIncome: calcPassiveWithTimers(
          investments, businesses, cleanInvTimers, cleanBizTimers,
          boosts.passiveBoost, prestige, vipMult,
        ),
        prestigeLevel: (d.prestigeLevel as number) ?? 0,
        prestigeMultiplier: prestige,
        lifetimeEarned: (d.lifetimeEarned as number) ?? 0,
        claimedAchievements: (d.claimedAchievements as Record<string, string[]>) ?? {},
        lastDailyClaimDate: (d.lastDailyClaimDate as string) ?? "",
        dailyStreak: (d.dailyStreak as number) ?? 0,
        businessTimers: cleanBizTimers,
        investmentTimers: cleanInvTimers,
        diamonds: (d.diamonds as number) ?? 0,
        isVip: isStillVip,
        vipEndTime: isStillVip ? vipEnd : 0,
        ownedManagers: (d.ownedManagers as string[]) ?? [],
        assignedManagers: (d.assignedManagers as Record<string, string>) ?? {},
        questProgress: (d.questProgress as Record<string, number>) ?? {},
        claimedQuests: (d.claimedQuests as string[]) ?? [],
        lastQuestResetDate: (d.lastQuestResetDate as string) ?? "",
        lastWeeklyResetDate: (d.lastWeeklyResetDate as string) ?? "",
        lastWheelSpinDate: (d.lastWheelSpinDate as string) ?? "",
        wheelSpinsToday: (d.wheelSpinsToday as number) ?? 0,
        activeEventId: null,
        eventEndTime: 0,
        eventTapMult: 1,
        eventPassiveMult: 1,
      });
    }
  },
}));

useGameStore.getState().loadFromStorage();
