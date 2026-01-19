import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Project } from "./Project";

@Entity("sprints")
export class Sprint {
    @PrimaryGeneratedColumn()
    sprint_id!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    sprint_title!: string;

    @Column({ type: "varchar", length: 500, nullable: false })
    sprint_description!: string;

    @Column({ type: "date", nullable: false })
    start_date!: Date; // ili Date

    @Column({ type: "date", nullable: false })
    end_date!: Date; // ili Date

    @Column({ type: "int", nullable: false })
    project_id!: number;

    @Column({ type: "int", nullable: false })
    story_points!: number;

    @ManyToOne(() => Project, (p) => p.sprints)
    @JoinColumn({
        name: "project_id",
        referencedColumnName: "project_id",
    })
    project!: Project;


}