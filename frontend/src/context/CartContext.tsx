import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Addon {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  photo: string;
  newAddOn?: Addon[];
}

interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem, quantityChange: number) => void;
  removeFromCart: (id: string) => void;
  clearCartItem: (id: string) => void;
  clearCartItems: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = sessionStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addItemToCart = (item: CartItem, quantityChange: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = Math.max(1, existingItem.quantity + quantityChange);
        if (newQuantity <= 0) {
          return prevItems.filter((i) => i.id !== item.id);
        }
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          newAddOn: item.newAddOn || existingItem.newAddOn,
        };
        return updatedItems;
      }
      return [
        ...prevItems,
        { ...item, quantity: Math.max(1, item.quantity || 1) },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (item && item.quantity > 1) {
        return prevItems.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prevItems.filter((i) => i.id !== id);
    });
  };

  const clearCartItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const clearCartItems = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeFromCart,
        clearCartItem,
        clearCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
