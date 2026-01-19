import { create } from "zustand";
import { Socket } from "socket.io-client";

interface SocketState {
  socketRef: Socket | null;
  setSocketRef: (socket: Socket | null) => void;
  clearSocketRef: () => void;
}

const useSocketStore = create<SocketState>((set) => ({
  socketRef: null, // Initial socketRef is null
  setSocketRef: (socket: Socket | null) => set({ socketRef: socket }), // Set the socket reference
  clearSocketRef: () => set({ socketRef: null }), // Clear the socket reference
}));

export default useSocketStore;
