import { create } from "zustand";
import { Product, ProductAddon } from "../pages/Products/Products";
import { devtools } from "zustand/middleware";

export interface CartItem {
  product: Product;
  selectedAddons: ProductAddon[];
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedAddons: ProductAddon[],
    quantity: number
  ) => void;
  deleteFromCart: (productId: string) => void;
  updateCartItem: (
    productId: string,
    quantity: number,
    selectedAddons: ProductAddon[]
  ) => void;
  clearCart: () => void;
}

// Create the Zustand store
export const useCartStore = create<CartStore>()(
  devtools((set) => ({
    cart: [],
    addToCart: (
      product: Product,
      selectedAddons: ProductAddon[],
      quantity: number
    ) =>
      set(
        (state) => ({
          cart: [...state.cart, { product, selectedAddons, quantity }],
        }),
        false,
        "cart/addToCart"
      ),
    deleteFromCart: (productId: string) =>
      set(
        (state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }),
        false,
        "cart/deleteFromCart"
      ),
    updateCartItem: (
      productId: string,
      quantity: number,
      selectedAddons: ProductAddon[]
    ) =>
      set(
        (state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId
              ? { ...item, quantity, selectedAddons }
              : item
          ),
        }),
        false,
        "cart/updateCartItem"
      ),
    clearCart: () => set({ cart: [] }, false, "cart/clearCart"),
  }))
);
