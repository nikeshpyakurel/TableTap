import { create } from "zustand";
import { generateThemeColors } from "../utils/themeColorUtils";

type BrandColors = {
  primary: string;
  primaryAccent: string;
  secondary: string;
};

type ThemeStore = {
  brandColors: BrandColors;
  setBrandColors: (colors: BrandColors) => void;
  setBrandColorsFromHex: (hex: string) => void;
};

const fallbackColors: BrandColors = {
  primary: "#ff6b26",
  primaryAccent: "#fc7f42",
  secondary: "#ff9747",
};

export const useThemeStore = create<ThemeStore>((set) => ({
  brandColors: fallbackColors,
  setBrandColors: (colors) => set({ brandColors: colors }),
  setBrandColorsFromHex: (hex) =>
    set({ brandColors: generateThemeColors(hex) }),
}));
