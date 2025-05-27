import { create } from "zustand";

type TBasicPhoneSignupData = {
    phone?: string;
    rememberMe?: boolean,
    role?: string; 
};

type TBasicPhoneSignupDataState = {
    basicPhoneSignupData: TBasicPhoneSignupData | null;   
    setBasicPhoneSignupData: (data: TBasicPhoneSignupData) => void;
    clearSetupBasicSignupData: () => void;
};

export const useBasicPhoneSignupDataStore = create<TBasicPhoneSignupDataState>((set) => ({
    basicPhoneSignupData: null,
    setBasicPhoneSignupData: (data: TBasicPhoneSignupData) => set({ basicPhoneSignupData: data  }),
    clearSetupBasicSignupData: () => set({ basicPhoneSignupData: null }),
}));