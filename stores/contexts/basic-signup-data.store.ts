import { create } from "zustand";

type TBasicSignupData = {
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: string;
  selectedRole?: string;
  phone?: string;
  selectedLocation?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

type TBasicSignupDataState = {
  basicSignupData: TBasicSignupData | null;
  setBasicSignupData: (data: TBasicSignupData) => void;
  clearSignupData: () => void;
};

export const useBasicSignupDataStore = create<TBasicSignupDataState>((set) => ({
  basicSignupData: null,
  setBasicSignupData: (data: TBasicSignupData) =>
    set({ basicSignupData: data }),
  clearSignupData: () => set({ basicSignupData: null }),
}));
