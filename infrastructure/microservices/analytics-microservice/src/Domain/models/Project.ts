import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectUser } from "./ProjectUser";
import { Sprint } from "./Sprint";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  project_id!: number;

  @Column({ type: "varchar", unique: true, nullable: false, length: 100 })
  project_name!: string;

  @Column({ type: "longtext", nullable: false })
  project_description!: string;

  @Column({ type: "varchar", nullable: false })
  image_file_uuid!: string;

  @Column({ nullable: false })
  total_weekly_hours_required!: number;

  @Column({ nullable: false })
  allowed_budget!: number;

  @OneToMany(() => ProjectUser, (project_user) => project_user.project)
  project_users!: ProjectUser[];

  @OneToMany(() => Sprint, (sprint) => sprint.project)
  sprints!: Sprint[];
}
