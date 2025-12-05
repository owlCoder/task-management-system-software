import { Notification } from '../models/Notification';

export interface INotificationRepository {
  
  // CRUD 
  create(notification: Partial<Notification>): Notification;
  save(notification: Notification): Promise<Notification>;
  findAll(): Promise<Notification[]>;
  findOne(id: number): Promise<Notification | null>;
  findByUserId(userId: number): Promise<Notification[]>;
  delete(id: number): Promise<boolean>;
  deleteMultiple(ids: number[]): Promise<void>;
  
  // bulk operacije
  updateMultiple(ids: number[], data: Partial<Notification>): Promise<void>;
  
  // counter
  countUnread(userId: number): Promise<number>;
}