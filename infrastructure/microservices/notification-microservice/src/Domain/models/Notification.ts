import { NotificationType } from '../enums/NotificationType';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity('notifications')
export class Notification {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO
  })
  type!: NotificationType;

  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @CreateDateColumn()
  createdAt!: Date;
}