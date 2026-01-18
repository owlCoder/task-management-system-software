import {Entity,PrimaryGeneratedColumn,Column,ManyToOne, JoinColumn,OneToMany,CreateDateColumn} from "typeorm";
import { TaskTemplate } from "./TaskTemplate";

@Entity("TemplateDependencies")
export class TemplateDependency {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => TaskTemplate, (template) => template.dependencies)
    @JoinColumn({ name: "template_id" })
    template!: TaskTemplate;

    @Column({ type: "int" })
    depends_on_template_id!: number;
}