import { create } from "zustand";

/* ----------------------------- Store State ----------------------------- */
// ── Basic Phone Signup Data ────────────────────────────────────────
type TBasicPhoneSignupData = {
  phone?: string;
  rememberMe?: boolean;
  role?: string;
};

// ── Basic Phone Signup Data State ───────────────────────────────────
type TBasicPhoneSignupDataState = {
  basicPhoneSignupData: TBasicPhoneSignupData | null;
  setBasicPhoneSignupData: (data: TBasicPhoneSignupData) => void;
  clearSetupBasicSignupData: () => void;
};

/* -------------------------------- Store -------------------------------- */
export const useBasicPhoneSignupDataStore = create<TBasicPhoneSignupDataState>(
  (set) => ({
    basicPhoneSignupData: null,
    setBasicPhoneSignupData: (data: TBasicPhoneSignupData) =>
      set({ basicPhoneSignupData: data }),
    clearSetupBasicSignupData: () => set({ basicPhoneSignupData: null }),
  }),
);
