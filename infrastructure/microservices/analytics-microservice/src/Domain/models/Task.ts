import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn
} from "typeorm";
import { TaskStatus } from "../enums/TaskStatus";
import { Comment } from "./Comment";

@Entity("Tasks")
export class Task {
  //ici preko sprint id a ne project id
  //datum zavrsetka

  @PrimaryGeneratedColumn()
  task_id!: number;
  @Column({ type: "int", unique: false, nullable: false })
  sprint_id!: number;

  @Column({ type: "int", nullable: true })
  worker_id!: number;

  @Column({ type: "int", nullable: false })
  project_manager_id!: number;

  @Column({ type: "varchar", unique: false, nullable: false, length: 100 })
  title!: string;

  @Column({ type: "varchar", unique: false, nullable: false, length: 100 })
  task_description!: string;

  @Column({ type: "enum", enum: TaskStatus, unique: false, nullable: false, default: TaskStatus.CREATED })
  task_status!: TaskStatus;

  @Column({ type: "int", unique: false, nullable: true })
  attachment_file_uuid!: number;

  @Column({ type: "int", default: 0, unique: false, nullable: true })
  estimated_cost!: number;
  @Column({ type: "int", default: 0, unique: false, nullable: true })
  total_hours_spent!: number;

  @CreateDateColumn()
  created_at!: Date

  @Column({ type: "datetime", nullable: true })
  finished_at?: Date;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments!: Comment[];
}
