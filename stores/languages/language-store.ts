import { TLanguage } from "@/utils/types/app";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_PERSIST_KEYS } from "../shared/persist-keys";

/* ----------------------------- Store State ----------------------------- */
// ── Language State ───────────────────────────────────────────
type TLanguageState = {
  language: TLanguage;
  setLanguage: (language: TLanguage) => void;
};

/* -------------------------------- Store -------------------------------- */
export const useLanguageStore = create<TLanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language: TLanguage) => set({ language }),
    }),
    { name: STORE_PERSIST_KEYS.language },
  ),
);
