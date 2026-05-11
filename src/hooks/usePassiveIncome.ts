import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export function usePassiveIncome() {
  const checkBoostExpiry = useGameStore((s) => s.checkBoostExpiry);
  const addPassiveIncome = useGameStore((s) => s.addPassiveIncome);
  const checkTimerCompletions = useGameStore((s) => s.checkTimerCompletions);
  const checkVipExpiry = useGameStore((s) => s.checkVipExpiry);

  useEffect(() => {
    const id = setInterval(() => {
      checkBoostExpiry();
      checkTimerCompletions();
      checkVipExpiry();
      const hourly = useGameStore.getState().hourlyPassiveIncome;
      if (hourly > 0) {
        addPassiveIncome(hourly / 3600);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [checkBoostExpiry, addPassiveIncome, checkTimerCompletions, checkVipExpiry]);
}
