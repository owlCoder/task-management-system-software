import { io, Socket } from "socket.io-client";
import { ISocketManager } from "./ISocketManager";
import { SocketConfig } from "../../config/socket.config";
import { SocketEvents } from "../../constants/SocketEvents";

// Event handling je izdvojen u SocketEventService
export class SocketManager implements ISocketManager {
  private socket: Socket | null = null;
  private readonly config: SocketConfig;
  private pendingUserId: number | null = null;

  constructor(config: SocketConfig) {
    this.config = config;
  }

  // Konektuje se na WebSocket server
  connect(): void {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    this.socket = io(this.config.baseURL, {
      transports: this.config.transports as any,
      reconnection: this.config.reconnection,
      reconnectionAttempts: this.config.reconnectionAttempts,
      reconnectionDelay: this.config.reconnectionDelay,
    });

    this.socket.on("connect", () => {
      console.log(" Socket connected:", this.socket?.id);
      // Ako postoji pending userId, join-aj sobu sada
      if (this.pendingUserId !== null) {
        this.socket?.emit(SocketEvents.JOIN_USER_ROOM, this.pendingUserId);
        console.log(` Joined user room: ${this.pendingUserId}`);
      }
    });

    this.socket.on("disconnect", () => {
      console.log(" Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  // Diskonektuje WebSocket konekciju
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected");
    }
  }

  // Pridruzuje se "sobi" za odredjenog korisnika
  joinUserRoom(userId: number): void {
    this.pendingUserId = userId;
    if (this.socket?.connected) {
      this.socket.emit(SocketEvents.JOIN_USER_ROOM, userId);
      console.log(` Joined user room: ${userId}`);
    } else {
      console.log(` Pending join for user room: ${userId} (waiting for connection)`);
    }
  }

  // Napusta "sobu" za odredjenog korisnika
  leaveUserRoom(userId: number): void {
    this.pendingUserId = null;
    if (this.socket?.connected) {
      this.socket.emit(SocketEvents.LEAVE_USER_ROOM, userId);
      console.log(` Left user room: ${userId}`);
    }
  }

  // Provera da li je socket konektovan
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Getter za socket instancu
  getSocket(): Socket | null {
    return this.socket;
  }
}