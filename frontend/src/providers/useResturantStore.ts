import { create } from "zustand";

type Restaurant = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  address: string;
  zip_code: string;
  photo: string | null;
  coverImage: string;
  theme: string;
  phone: string;
  status: string;
};

type RestaurantStore = {
  restaurant: Restaurant | null;
  setRestaurant: (data: Restaurant) => void;
  updateRestaurant: (partial: Partial<Restaurant>) => void;
  clearRestaurant: () => void;
};

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurant: null,

  setRestaurant: (data) => set({ restaurant: data }),

  updateRestaurant: (partial) =>
    set((state) => ({
      restaurant: state.restaurant ? { ...state.restaurant, ...partial } : null,
    })),

  clearRestaurant: () => set({ restaurant: null }),
}));
