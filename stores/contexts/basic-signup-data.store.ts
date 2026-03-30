import { create } from "zustand";

/* ----------------------------- Store State ----------------------------- */
// ── Basic Signup Data ────────────────────────────────────────
type TBasicSignupData = {
  firstName?: string;
  lastName?: string;
  dob?: string;
  username?: string;
  gender?: string;
  selectedRole?: string;
  phone?: string;
  selectedLocation?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

// ── Basic Signup Data State ───────────────────────────────────
type TBasicSignupDataState = {
  basicSignupData: TBasicSignupData | null;
  setBasicSignupData: (data: TBasicSignupData) => void;
  clearSignupData: () => void;
};

/* -------------------------------- Store -------------------------------- */
export const useBasicSignupDataStore = create<TBasicSignupDataState>((set) => ({
  basicSignupData: null,
  setBasicSignupData: (data: TBasicSignupData) =>
    set({ basicSignupData: data }),
  clearSignupData: () => set({ basicSignupData: null }),
}));
