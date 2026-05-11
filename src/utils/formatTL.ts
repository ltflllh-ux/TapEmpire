export function formatTL(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    const val = amount / 1_000_000_000_000;
    return `₺${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(".", ",")} Tr`;
  }
  if (amount >= 1_000_000_000) {
    const val = amount / 1_000_000_000;
    return `₺${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(".", ",")} Mr`;
  }
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return `₺${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(".", ",")} Mn`;
  }
  return `₺${Math.floor(amount).toLocaleString("tr-TR")}`;
}
