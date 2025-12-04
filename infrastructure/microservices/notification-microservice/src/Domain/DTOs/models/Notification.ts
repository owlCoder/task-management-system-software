import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn 
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
    enum: ['info', 'warning', 'error'],
    default: 'info'
  })
  type!: 'info' | 'warning' | 'error';

  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}