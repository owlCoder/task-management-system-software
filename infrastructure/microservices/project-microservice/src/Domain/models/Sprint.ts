import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./Project";

@Entity("sprints")
export class Sprint {
    @PrimaryGeneratedColumn()
    sprint_id!: number;

    @ManyToOne(() => Project, (project) => project.sprints, {
        nullable: false,
        onDelete: "CASCADE",
    })

    @JoinColumn({ name: "project_id" })
    project!: Project;

    @Column({ type: "varchar", length: 100, nullable: false})
    sprint_title!: string;

    @Column({ type: "varchar", length: 500, nullable: false})
    sprint_description!: string;

    @Column({ type: "date", nullable: false })
    start_date!: Date;
    
    @Column({ type: "date", nullable: false })
    end_date!: Date;

    @Column({ type: "int", nullable: false, default: 0})
    story_points!: number;
}