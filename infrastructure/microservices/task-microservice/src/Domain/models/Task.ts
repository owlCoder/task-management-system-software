import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { TaskStatus } from "../enums/task_status";

@Entity("Tasks") 
export class Task {
    @PrimaryGeneratedColumn()
    task_id!: number;
    @Column({ type: "int", unique: false, nullable: false })
    project_id!: number;

    @Column({ type: "varchar", unique: false, nullable: false, length: 100 })
    title!: string;
    
    @Column({ type: "varchar", unique: false, nullable: false, length: 100 })
    task_description!: string;
    
    @Column({ type: "enum", enum: TaskStatus, unique: false, nullable: false,default: TaskStatus.CREATED })
    task_status!: TaskStatus;

    @Column({ type: "int", unique: false, nullable: true })
    attachment_file_uuid!: number;

    @Column({ type: "int",default: 0, unique: false, nullable: true })
    estimated_cost!: number;
    @Column({ type: "int",default: 0, unique: false, nullable: true })
    total_hours_spent!: number;
}
