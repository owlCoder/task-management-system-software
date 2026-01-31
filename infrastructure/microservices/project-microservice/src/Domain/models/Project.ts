import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProjectUser } from "./ProjectUser";
import { Sprint } from "./Sprint";
import { ProjectStatus } from "../enums/ProjectStatus";

@Entity("projects")
export class Project {
    @PrimaryGeneratedColumn()
    project_id!: number;

    @Column({ type: "varchar", unique: true, nullable: false, length: 100 })
    project_name!: string;

    @Column({ type: "longtext", nullable: false })
    project_description!: string;

    @Column({ type: "varchar", nullable: true, length: 255 })
    image_key!: string;

    @Column({ type: "varchar", nullable: true, length: 500 })
    image_url!: string;

    @Column({ nullable: false })
    total_weekly_hours_required!: number;

    @Column({ nullable: false })
    allowed_budget!: number;

    @Column({ type: "date", nullable: true })
    start_date!: Date | null;

    @Column({ 
        type: "enum", 
        enum: ProjectStatus, 
        default: ProjectStatus.NOT_STARTED 
    })
    status!: ProjectStatus;

    @OneToMany(() => ProjectUser, (project_user) => project_user.project)
    project_users!: ProjectUser[];

    @OneToMany(() => Sprint, (sprint) => sprint.project)
    sprints!: Sprint[];
}