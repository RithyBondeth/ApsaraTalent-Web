import { TLanguage } from "@/utils/types/language.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    { name: "language-storage" },
  ),
);
