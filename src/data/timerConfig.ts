export function getTimerDuration(level: number): number {
  if (level <= 0) return 0;
  if (level === 1) return 30;
  if (level <= 3) return 30 + (level - 1) * 30;
  if (level <= 5) return 90 + (level - 3) * 105;
  if (level <= 10) return 300 + (level - 5) * 300;
  if (level <= 20) return 1800 + (level - 10) * 540;
  return 7200;
}

export function formatTimer(seconds: number): string {
  if (seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return `${h}:${String(rm).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
