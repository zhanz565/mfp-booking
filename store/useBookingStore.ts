import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Strict Type Definitions
export interface VehicleInfo {
  year: string;
  make: string;
  model: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface BookingState {
  step: number;
  services: string[];
  // FIXED: Changed from Date to string for API and Persistence compatibility
  date: string | undefined; 
  slot: string | undefined;
  vehicle: VehicleInfo;
  customer: CustomerInfo;
}

interface BookingStore {
  data: BookingState;
  setStep: (step: number) => void;
  updateData: (updates: Partial<BookingState>) => void;
  reset: () => void;
}

// 2. Initial State Constant (Clean reset logic)
const INITIAL_STATE: BookingState = {
  step: 1,
  services: [],
  date: undefined,
  slot: undefined,
  vehicle: { year: '', make: '', model: '' },
  customer: { name: '', phone: '', email: '' },
};

// 3. Store Initialization
export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      data: INITIAL_STATE,
      setStep: (step) => 
        set((state) => ({ data: { ...state.data, step } })),
      updateData: (updates) => 
        set((state) => ({ data: { ...state.data, ...updates } })),
      reset: () => 
        set({ data: INITIAL_STATE }),
    }),
    { 
      name: 'mfp-booking-storage',
      // This saves the progress so if a user refreshes the page, 
      // their vehicle and service selections aren't lost.
    }
  )
);