import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export function usePassiveIncome() {
  const checkBoostExpiry = useGameStore((s) => s.checkBoostExpiry);
  const addPassiveIncome = useGameStore((s) => s.addPassiveIncome);

  useEffect(() => {
    const id = setInterval(() => {
      checkBoostExpiry();
      const hourly = useGameStore.getState().hourlyPassiveIncome;
      if (hourly > 0) {
        addPassiveIncome(hourly / 3600);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [checkBoostExpiry, addPassiveIncome]);
}
