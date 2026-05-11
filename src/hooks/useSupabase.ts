import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useGameStore } from "../store/useGameStore";

export function useSupabaseSync() {
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        let userId = sessionData?.session?.user?.id;

        if (!userId) {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.log("Supabase anon auth error:", error.message);
            return;
          }
          userId = data.user?.id;
        }

        if (!userId) return;

        const store = useGameStore.getState();
        await supabase.from("players").upsert({
          user_id: userId,
          name: store.playerName || "İsimsiz",
          company_name: store.companyName || "",
          total_earned: Math.floor(store.totalEarned),
          prestige_level: store.prestigeLevel,
          is_vip: store.isVip,
          tap_level: store.tapLevel,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      } catch (e) {
        console.log("Supabase init error:", e);
      }
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        if (!userId) return;

        const store = useGameStore.getState();
        await supabase.from("players").upsert({
          user_id: userId,
          name: store.playerName || "İsimsiz",
          company_name: store.companyName || "",
          total_earned: Math.floor(store.totalEarned),
          prestige_level: store.prestigeLevel,
          is_vip: store.isVip,
          tap_level: store.tapLevel,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      } catch (e) {
        // silent fail
      }
    }, 30000);

    return () => clearInterval(id);
  }, []);
}
