import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  role: string;
  setRole: (role: string) => void;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  isAuth: boolean | null;
  setIsAuth: (auth: boolean) => void;
  permission: string[];
  setPermission: (permissionArr: string[]) => void;
}

const authStore = (set: any): AuthState => ({
  accessToken: null,
  role: "",
  setRole: (role: string) => set({ role: role }),
  setAccessToken: (token: string) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
  isAuth: null,
  setIsAuth: (auth: boolean) => set({ isAuth: auth }),
  permission: [], // Initialize as an empty array
  setPermission: (permissionArr: string[]) =>
    set({ permission: permissionArr }),
});

const useStaffAuthStore = create<AuthState>()(authStore);

export default useStaffAuthStore;
