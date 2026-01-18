import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Task } from "./Task";
import { TaskStatus } from "../enums/TaskStatus";

@Entity("task_versions")
export class TaskVersion {
  @PrimaryGeneratedColumn()
  version_id!: number;

  @ManyToOne(() => Task, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "task_id" })
  task!: Task;

  @Column({ type: "int", nullable: false })
  task_id!: number;

  @Column({ type: "int", nullable: false })
  version_number!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  title!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  task_description!: string;

  @Column({ type: "enum", enum: TaskStatus, nullable: false })
  task_status!: TaskStatus;

  @Column({ type: "int", nullable: true })
  attachment_file_uuid!: number | null;

  @Column({ type: "int", nullable: true })
  estimated_cost!: number | null;

  @Column({ type: "int", nullable: true })
  total_hours_spent!: number | null;

  @Column({ type: "int", nullable: true })
  worker_id!: number | null;

  @Column({ type: "datetime", nullable: true })
  due_date!: Date | null;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;
}