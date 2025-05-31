import { create } from "zustand";

interface SupportedState {
  supported: boolean;
  setSupported: (value: boolean) => void;
  gmail: string;
  setGmail: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  verified: boolean;
  setVerified: (value: boolean) => void;
  country: string;
  setCountry: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onboarded: boolean;
  setOnboarded: (value: boolean) => void;
}

export const useStore = create<SupportedState>((set) => ({
  supported: false,
  setSupported: (value) => set({ supported: value }),
  gmail: "",
  setGmail: (value) => set({ gmail: value }),
  name: "",
  setName: (value) => set({ name: value }),
  country: "",
  verified: false,
  setVerified: (value) => set({ verified: value }),
  setCountry: (value) => set({ country: value }),
  phoneNumber: "",
  setPhoneNumber: (value) => set({ phoneNumber: value }),
  onboarded: false,
  setOnboarded: (value) => set({ onboarded: value }),
}));
