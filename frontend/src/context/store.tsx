import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StoreState {
  restaurantId: string;
  tableId: string;
  respOrderId: string;
  contactNumber: string;
  setRestaurantIdAndTableId: (restaurantId: string, tableId: string) => void;
  setRespOrderId: (orderId: string) => void;
  setContactNumber: (contactNumber: string) => void;
}

const useMenuInfo = create<StoreState>()(
  persist(
    (set) => ({
      restaurantId: "",
      tableId: "",
      respOrderId: "",
      contactNumber: "",
      setRestaurantIdAndTableId: (restaurantId, tableId) =>
        set({ restaurantId, tableId }),
      setRespOrderId: (orderId) => set({ respOrderId: orderId }),
      setContactNumber: (contactNumber) =>
        set({ contactNumber: String(contactNumber) }),
    }),
    {
      name: "menu-info",
      storage: createJSONStorage(() => sessionStorage),

      partialize: (state) => ({
        restaurantId: state.restaurantId,
        tableId: state.tableId,
        respOrderId: state.respOrderId,
        contactNumber: state.contactNumber,
      }),
    }
  )
);

export default useMenuInfo;
