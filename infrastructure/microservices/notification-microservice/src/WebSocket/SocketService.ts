import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { SocketEvents } from './SocketEvents';
import type { NotificationResponseDTO } from '../Domain/DTOs/NotificationDTO';

export class SocketService {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    // Inicijalizuj Socket.IO sa CORS
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupEventHandlers();
  }

   // Setup event handlers za socket konekcije
  private setupEventHandlers(): void {
    this.io.on(SocketEvents.CONNECTION, (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // omogucava klijentu da se pridruzi "sobi" za svog userId-a
      socket.on(SocketEvents.JOIN_USER_ROOM, (userId: number) => {
        const room = `user:${userId}`;
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
      });

      // omogucava klijentu da napusti sobu
      socket.on(SocketEvents.LEAVE_USER_ROOM, (userId: number) => {
        const room = `user:${userId}`;
        socket.leave(room);
        console.log(`Client ${socket.id} left room: ${room}`);
      });

      // disconnect event
      socket.on(SocketEvents.DISCONNECT, () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public emitNotificationCreated(notification: NotificationResponseDTO): void {
    const room = `user:${notification.userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATION_CREATED, notification);
    console.log(`Emitted NOTIFICATION_CREATED to room: ${room}`);
  }

  public emitNotificationDeleted(notificationId: number, userId: number): void {
    const room = `user:${userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATION_DELETED, { id: notificationId });
    console.log(`Emitted NOTIFICATION_DELETED to room: ${room}`);
  }

  public emitNotificationMarkedRead(notification: NotificationResponseDTO): void {
    const room = `user:${notification.userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATION_MARKED_READ, notification);
    console.log(`Emitted NOTIFICATION_MARKED_READ to room: ${room}`);
  }

  public emitNotificationMarkedUnread(notification: NotificationResponseDTO): void {
    const room = `user:${notification.userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATION_MARKED_UNREAD, notification);
    console.log(`Emitted NOTIFICATION_MARKED_UNREAD to room: ${room}`);
  }

  public emitNotificationsBulkDeleted(ids: number[], userId: number): void {
    const room = `user:${userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATIONS_BULK_DELETED, { ids });
    console.log(`mitted NOTIFICATIONS_BULK_DELETED to room: ${room}`);
  }


  public emitNotificationsBulkMarkedRead(ids: number[], userId: number): void {
    const room = `user:${userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATIONS_BULK_MARKED_READ, { ids });
    console.log(`Emitted NOTIFICATIONS_BULK_MARKED_READ to room: ${room}`);
  }

  public emitNotificationsBulkMarkedUnread(ids: number[], userId: number): void {
    const room = `user:${userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATIONS_BULK_MARKED_UNREAD, { ids });
    console.log(`Emitted NOTIFICATIONS_BULK_MARKED_UNREAD to room: ${room}`);
  }

  // getter za Socket.IO server instancu
  public getIO(): SocketIOServer {
    return this.io;
  }
}
