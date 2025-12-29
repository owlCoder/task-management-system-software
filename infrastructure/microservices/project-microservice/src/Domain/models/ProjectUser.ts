import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./Project";

@Entity("project_users")
export class ProjectUser {
  @PrimaryGeneratedColumn()
  pu_id!: number;

  @ManyToOne(() => Project, (project) => project.project_id, {
    nullable: false,
  })
  @JoinColumn({ name: "project_id" })
  project!: Project;
  //kreira kolonu koja je fk za od tabele Project i njegovog project_id-a

  @Column({ unique: false })
  user_id!: number;

  @Column({ type: "int", nullable: false })
  weekly_hours!: number;
}
