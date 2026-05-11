import { useEffect, useRef } from "react";
import { useGameStore } from "../store/useGameStore";
import { GAME_EVENTS } from "../data/events";

export function useRandomEvents() {
  const activeEventId = useGameStore((s) => s.activeEventId);
  const startEvent = useGameStore((s) => s.startEvent);
  const clearEvent = useGameStore((s) => s.clearEvent);
  const balance = useGameStore((s) => s.balance);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 45_000 + Math.random() * 75_000;
      timerRef.current = setTimeout(() => {
        if (useGameStore.getState().activeEventId) {
          scheduleNext();
          return;
        }
        const event = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)];

        if (event.effect.type === "taxDiscount") {
          const debt = useGameStore.getState().taxDebt;
          if (debt > 0) {
            useGameStore.setState({ taxDebt: debt * event.effect.value });
          }
          scheduleNext();
          return;
        }

        if (event.effect.type === "bonusCash") {
          const bal = useGameStore.getState().balance;
          const bonus = Math.max(bal * 0.1, 1000);
          useGameStore.setState((s) => ({
            balance: s.balance + bonus,
            totalEarned: s.totalEarned + bonus,
            lifetimeEarned: s.lifetimeEarned + bonus,
          }));
          scheduleNext();
          return;
        }

        const tapMult = event.effect.type === "tapMultiplier" ? event.effect.value : 1;
        const passiveMult = event.effect.type === "passiveMultiplier" ? event.effect.value : 1;
        startEvent(event.id, event.durationSec, tapMult, passiveMult);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startEvent, clearEvent]);
}
