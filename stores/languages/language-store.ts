import { TLanguage } from "@/utils/types/language.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_PERSIST_KEYS } from "../_shared/persist-keys";

interface LanguageState {
  language: TLanguage;
  setLanguage: (language: TLanguage) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    { name: STORE_PERSIST_KEYS.language },
  ),
);
