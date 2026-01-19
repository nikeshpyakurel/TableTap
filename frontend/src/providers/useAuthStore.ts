import { create } from "zustand";
import { devtools, createJSONStorage } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  isAuth: boolean | null;
  setIsAuth: (auth: boolean) => void;
  isModelOpen: boolean;
  setIsModelOpen: (model: boolean) => void;
  isNewOrder: boolean;
  setIsNewOrder: (model: boolean) => void;
  clearModelOpen: () => void;
  restaurantId: string | null;
  setRestaurantId: (id: string) => void;
  restaurantName: string | null;
  setRestaurantName: (name: string) => void;
  restaurantAddress: string | null;
  setRestaurantAddress: (address: string) => void;
  restaurantPhone: string | null;
  setRestaurantPhone: (phone: string) => void;
}

const authStore = (set: any): AuthState => ({
  accessToken: null,
  setAccessToken: (token: string) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
  isAuth: null,
  setIsAuth: (auth: boolean) => set({ isAuth: auth }),
  isModelOpen: true,
  isNewOrder: false,
  setIsNewOrder: (model: boolean) => set({ isNewOrder: model }),
  setIsModelOpen: (model: boolean) => set({ isModelOpen: model }),
  clearModelOpen: () => set({ isModelOpen: true }),
  restaurantId: null,
  setRestaurantId: (id: string) => set({ restaurantId: id }),
  restaurantName: null,
  setRestaurantName: (name: string) => set({ restaurantName: name }),
  restaurantAddress: null,
  setRestaurantAddress: (address: string) =>
    set({ restaurantAddress: address }),
  restaurantPhone: null,
  setRestaurantPhone: (phone: string) => set({ restaurantPhone: phone }),
});

const useAuthStore = create<AuthState>()(
  devtools(authStore, {
    name: "auth",
    storage: createJSONStorage(() => localStorage),
  })
);

export default useAuthStore;
