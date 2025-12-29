import { Socket } from "socket.io-client";

// Interfejs za Socket Manager
// Definise osnovne operacije za upravljanje WebSocket konekcijom
export interface ISocketManager {
  connect(): void;
  disconnect(): void;
  joinUserRoom(userId: number): void;
  leaveUserRoom(userId: number): void;
  getSocket(): Socket | null;
  isConnected(): boolean;
}
