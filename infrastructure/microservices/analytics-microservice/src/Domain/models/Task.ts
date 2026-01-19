import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { TaskStatus } from "../enums/TaskStatus";

@Entity("Tasks")
export class Task {
  @PrimaryGeneratedColumn()
  task_id!: number;

  @Column({ type: "int", nullable: true })
  sprint_id!: number | null;

  @Column({ type: "varchar", length: 100, nullable: false })
  title!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  task_description!: string;

  @Column({
    type: "enum",
    enum: TaskStatus,
    nullable: false,
    default: TaskStatus.CREATED,
  })
  task_status!: TaskStatus;

  @Column({ type: "int", nullable: true })
  attachment_file_uuid!: number | null;

  @Column({ type: "int", nullable: false, default: 0 })
  estimated_cost!: number;

  @Column({ type: "int", nullable: false, default: 0 })
  total_hours_spent!: number;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @Column({ type: "datetime", nullable: true })
  finished_at!: Date | null;
}