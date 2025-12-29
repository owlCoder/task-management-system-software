import { SocketManager } from "./SocketManager";
import { SocketEventService } from "./SocketEventService";
import { defaultSocketConfig } from "../../config/socket.config";

export const socketManager = new SocketManager(defaultSocketConfig);

export const socketEventService = new SocketEventService(socketManager);

export { socketManager as default };