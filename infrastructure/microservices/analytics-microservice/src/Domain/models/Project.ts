import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Sprint } from "./Sprint";

export enum ProjectStatus {
  ACTIVE = "Active",
  PAUSED = "Paused",
  COMPLETED = "Completed",
  NOT_STARTED = "Not Started",
}

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  project_id!: number;

  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  project_name!: string;

  @Column({ type: "longtext", nullable: false })
  project_description!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  image_key!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  image_url!: string | null;

  @Column({ type: "int", nullable: false })
  total_weekly_hours_required!: number;

  @Column({ type: "int", nullable: false })
  allowed_budget!: number;

  @Column({ type: "date", nullable: true })
  start_date!: string | null; // ili Date | null

  @Column({ type: "int", nullable: false, default: 1 })
  sprint_count!: number;

  @Column({ type: "int", nullable: false, default: 14 })
  sprint_duration!: number;

  @Column({
    type: "enum",
    enum: ProjectStatus,
    nullable: false,
    default: ProjectStatus.NOT_STARTED,
  })
  status!: ProjectStatus;

  sprints!: Sprint[];
}