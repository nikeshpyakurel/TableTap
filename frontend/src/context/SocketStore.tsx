import { create } from "zustand";
import { Socket } from "socket.io-client";

interface SocketState {
  socketRef: Socket | null;
  setSocketRef: (socket: Socket | null) => void;
  clearSocketRef: () => void;
}

const useSocketStore = create<SocketState>((set) => ({
  socketRef: null, 
  setSocketRef: (socket: Socket | null) => set({ socketRef: socket }), 
  clearSocketRef: () => set({ socketRef: null }), 
}));

export default useSocketStore;