import { create } from "zustand";
import { Product, ProductAddon } from "../pages/Products/Products";

export interface CartItem {
  product: Product;
  selectedAddons: ProductAddon[];
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  tableId: string | null;
  customerPhoneNumber: string | null;
  addToCart: (
    product: Product,
    selectedAddons: ProductAddon[],
    quantity: number
  ) => void;
  setTableId: (id: string) => void;
  deleteFromCart: (productId: string) => void;
  updateCartItem: (
    productId: string,
    quantity: number,
    selectedAddons: ProductAddon[]
  ) => void;
  setCustomerPhoneNumber: (phoneNumber: string) => void; // New action
  clearCart: () => void;
  removeTableId: () => void;
  clearCustomerPhoneNumber: () => void; // Clear action
}

// Create the Zustand store
export const useTableOrderCart = create<CartStore>((set) => ({
  tableId: null,
  setTableId: (id) => set({ tableId: id }),

  customerPhoneNumber: null, // Initialize state for phone number
  setCustomerPhoneNumber: (phoneNumber) =>
    set({ customerPhoneNumber: phoneNumber }),
  clearCustomerPhoneNumber: () => set({ customerPhoneNumber: null }),

  removeTableId: () => set({ tableId: null }),
  cart: [],
  addToCart: (
    product: Product,
    selectedAddons: ProductAddon[],
    quantity: number
  ) =>
    set((state) => ({
      cart: [...state.cart, { product, selectedAddons, quantity }],
    })),
  deleteFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),
  updateCartItem: (productId, quantity, selectedAddons) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity, selectedAddons }
          : item
      ),
    })),
  clearCart: () => set({ cart: [] }),
}));
