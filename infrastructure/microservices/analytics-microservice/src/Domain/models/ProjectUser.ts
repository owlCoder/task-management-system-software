import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { Project } from "./Project";

@Entity("project_users")
export class ProjectUser {
  @PrimaryGeneratedColumn()
  pu_id!: number;

  @ManyToOne(() => Project, (project) => project.project_id, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ type: "int", nullable: false })
  user_id!: number;

  @Column({ type: "int", nullable: false })
  weekly_hours!: number;

  @CreateDateColumn({ type: "datetime" })
  added_at!: Date;
}
