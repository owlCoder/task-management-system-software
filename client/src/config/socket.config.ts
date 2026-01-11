// Socket konfiguracija
// Centralizovano mesto za sve socket-related konfiguracije
export interface SocketConfig {
  baseURL: string;
  transports: string[];
  reconnection: boolean;
  reconnectionAttempts: number;
  reconnectionDelay: number;
}

// Defaultna socket konfiguracija
export const defaultSocketConfig: SocketConfig = {
  baseURL: import.meta.env.VITE_NOTIFICATION_SERVICE_URL,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
};
