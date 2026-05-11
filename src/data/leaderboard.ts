export interface LeaderboardEntry {
  id: string;
  name: string;
  companyName: string;
  totalEarned: number;
  isBot: boolean;
  isVip: boolean;
  prestigeLevel: number;
}

export type LeaderboardPeriod = "daily" | "weekly" | "allTime";

const FIRST_NAMES = [
  "Ahmet", "Mehmet", "Ali", "Mustafa", "Hasan",
  "Emre", "Burak", "Murat", "Eren", "Yusuf",
  "Fatma", "Ayşe", "Zeynep", "Elif", "Merve",
  "Selin", "Deniz", "Ece", "Naz", "Defne",
  "Arda", "Berk", "Can", "Doruk", "Ege",
  "Kerem", "Koray", "Onur", "Serkan", "Tolga",
  "Barış", "Cem", "Furkan", "İbrahim", "Kaan",
  "Oğuz", "Sinan", "Tarık", "Umut", "Volkan",
  "Aslı", "Burcu", "Ceren", "Damla", "Esra",
  "Gizem", "Hande", "İrem", "Melis", "Pınar",
];

const COMPANY_NAMES = [
  "Anadolu Holding", "Yıldız İnşaat", "Boğaziçi Tech",
  "Karadeniz Gıda", "Ege Tekstil", "Marmara Enerji",
  "Ankara Yazılım", "Trakya Otomotiv", "Akdeniz Turizm",
  "İstanbul Finans", "Kapadokya Madencilik", "Truva Lojistik",
  "Efes Tarım", "Osmanlı Gayrimenkul", "Pamukkale Sağlık",
  "Nemrut Mining", "Galata Yatırım", "Sultanahmet Gıda",
  "Kızılırmak Enerji", "Göreme Turizm", "Sapanca Doğa",
  "Bolu Gıda", "Antalya Denizcilik", "Trabzon Çay",
  "Konya Tarım", "Bursa Otomotiv", "İzmir Teknoloji",
  "Eskişehir Seramik", "Gaziantep Tekstil", "Mersin Liman",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function getDaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function getWeekSeed(): number {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  return d.getFullYear() * 100 + week;
}

export function generateBotPlayers(count: number, period: LeaderboardPeriod): LeaderboardEntry[] {
  const seed = period === "daily" ? getDaySeed() : period === "weekly" ? getWeekSeed() : 20260101;
  const rand = seededRandom(seed);

  const minWealth = period === "daily" ? 10_000 : period === "weekly" ? 100_000 : 1_000_000;
  const maxWealth = period === "daily" ? 5_000_000 : period === "weekly" ? 50_000_000 : 10_000_000_000;

  const bots: LeaderboardEntry[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let nameIdx: number;
    do {
      nameIdx = Math.floor(rand() * FIRST_NAMES.length);
    } while (usedNames.has(FIRST_NAMES[nameIdx]) && usedNames.size < FIRST_NAMES.length);
    usedNames.add(FIRST_NAMES[nameIdx]);

    const companyIdx = Math.floor(rand() * COMPANY_NAMES.length);
    const wealth = minWealth + rand() * (maxWealth - minWealth);
    const rankFactor = 1 - (i / count);
    const adjustedWealth = wealth * (0.3 + rankFactor * 0.7);

    bots.push({
      id: `bot_${i}`,
      name: FIRST_NAMES[nameIdx],
      companyName: COMPANY_NAMES[companyIdx],
      totalEarned: Math.floor(adjustedWealth),
      isBot: true,
      isVip: rand() > 0.7,
      prestigeLevel: Math.floor(rand() * 5),
    });
  }

  return bots.sort((a, b) => b.totalEarned - a.totalEarned);
}
