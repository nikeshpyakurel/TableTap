import { create } from "zustand";

interface IconStore {
  selectedIcon: string | null;
  setSelectedIcon: (icon: string | null) => void;
}

export const useIconStore = create<IconStore>((set) => ({
  selectedIcon: null,
  setSelectedIcon: (icon: string | null) => set({ selectedIcon: icon }),
}));
