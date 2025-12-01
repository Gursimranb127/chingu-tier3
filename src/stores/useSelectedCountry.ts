import { create } from 'zustand';
import { ChinguCountryStats } from '@/features/chingu/chingu.type';

interface SelectedCountryStore {
  selectedCountry: ChinguCountryStats | null;
  setSelectedCountry: (country: ChinguCountryStats | null) => void;
}

const useSelectedCountryStore = create<SelectedCountryStore>((set) => ({
  selectedCountry: null,
  setSelectedCountry: (country) => set({ selectedCountry: country }),
}));

export function useSelectedCountry() {
  const selectedCountry = useSelectedCountryStore(
    (state) => state.selectedCountry
  );
  const setSelectedCountry = useSelectedCountryStore(
    (state) => state.setSelectedCountry
  );

  return {
    selectedCountry,
    setSelectedCountry,
  };
}
