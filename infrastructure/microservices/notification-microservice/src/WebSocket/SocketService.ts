import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { SocketEvents } from './SocketEvents';
import type { NotificationResponseDTO } from '../Domain/DTOs/NotificationResponseDTO';

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

      // Omogući klijentu da se pridruži "sobi" za svog userId-a
      socket.on(SocketEvents.JOIN_USER_ROOM, (userId: number) => {
        const room = `user:${userId}`;
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
      });

      // Omogući klijentu da napusti sobu
      socket.on(SocketEvents.LEAVE_USER_ROOM, (userId: number) => {
        const room = `user:${userId}`;
        socket.leave(room);
        console.log(`Client ${socket.id} left room: ${room}`);
      });

      // Disconnect event
      socket.on(SocketEvents.DISCONNECT, () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

   // Emituje događaj o kreiranoj notifikaciji
  public emitNotificationCreated(notification: NotificationResponseDTO): void {
    const room = `user:${notification.userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATION_CREATED, notification);
    console.log(`Emitted NOTIFICATION_CREATED to room: ${room}`);
  }

   // Emituje događaj o ažuriranoj notifikaciji
  public emitNotificationUpdated(notification: NotificationResponseDTO): void {
    const room = `user:${notification.userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATION_UPDATED, notification);
    console.log(`Emitted NOTIFICATION_UPDATED to room: ${room}`);
  }

   // Emituje događaj o obrisanoj notifikaciji
  public emitNotificationDeleted(notificationId: number, userId: number): void {
    const room = `user:${userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATION_DELETED, { id: notificationId });
    console.log(`Emitted NOTIFICATION_DELETED to room: ${room}`);
  }

   // Emituje događaj o notifikaciji označenoj kao pročitana
  public emitNotificationMarkedRead(notification: NotificationResponseDTO): void {
    const room = `user:${notification.userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATION_MARKED_READ, notification);
    console.log(`Emitted NOTIFICATION_MARKED_READ to room: ${room}`);
  }

   // Emituje događaj o notifikaciji označenoj kao nepročitana
  public emitNotificationMarkedUnread(notification: NotificationResponseDTO): void {
    const room = `user:${notification.userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATION_MARKED_UNREAD, notification);
    console.log(`Emitted NOTIFICATION_MARKED_UNREAD to room: ${room}`);
  }

  /**
   * Emituje događaj o bulk brisanju notifikacija
   */
  public emitNotificationsBulkDeleted(ids: number[], userId: number): void {
    const room = `user:${userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATIONS_BULK_DELETED, { ids });
    console.log(`mitted NOTIFICATIONS_BULK_DELETED to room: ${room}`);
  }

  /**
   * Emituje događaj o bulk označavanju kao pročitano
   */
  public emitNotificationsBulkMarkedRead(ids: number[], userId: number): void {
    const room = `user:${userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATIONS_BULK_MARKED_READ, { ids });
    console.log(`Emitted NOTIFICATIONS_BULK_MARKED_READ to room: ${room}`);
  }

  /**
   * Emituje događaj o bulk označavanju kao nepročitano
   */
  public emitNotificationsBulkMarkedUnread(ids: number[], userId: number): void {
    const room = `user:${userId}`;
    this.io.to(room).emit(SocketEvents.NOTIFICATIONS_BULK_MARKED_UNREAD, { ids });
    console.log(`Emitted NOTIFICATIONS_BULK_MARKED_UNREAD to room: ${room}`);
  }

  /**
   * Getter za Socket.IO server instancu
   */
  public getIO(): SocketIOServer {
    return this.io;
  }
}
s.txt
5 KB