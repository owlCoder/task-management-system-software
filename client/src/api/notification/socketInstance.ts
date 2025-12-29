import { SocketManager } from "./SocketManager";
import { SocketEventService } from "./SocketEventService";
import { defaultSocketConfig } from "../../config/socket.config";

// - SocketManager prima config kroz konstruktor 
// - SocketEventService prima SocketManager kroz konstruktor 
export const socketManager = new SocketManager(defaultSocketConfig);

export const socketEventService = new SocketEventService(socketManager);

export { socketManager as default };