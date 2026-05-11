import { useState, useRef, useCallback } from "react";

export function useCombo() {
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerTap = useCallback(() => {
    setCombo((prev) => prev + 1);
    setShowCombo(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCombo(0);
      setShowCombo(false);
    }, 1500);
  }, []);

  const comboMultiplier = combo >= 50 ? 2.0 : combo >= 30 ? 1.5 : combo >= 15 ? 1.2 : 1;
  const comboLabel =
    combo >= 50 ? "ULTRA COMBO!" :
    combo >= 30 ? "SÜPER COMBO!" :
    combo >= 15 ? "COMBO!" : "";
  const comboColor =
    combo >= 50 ? "#ED64A6" :
    combo >= 30 ? "#F4C430" :
    combo >= 15 ? "#48BB78" : "#FFFFFF";

  return {
    combo,
    showCombo: showCombo && combo >= 5,
    comboMultiplier,
    comboLabel,
    comboColor,
    registerTap,
  };
}
