import {Entity,PrimaryGeneratedColumn,ManyToOne, JoinColumn} from "typeorm";
import { TaskTemplate } from "./TaskTemplate";

@Entity("template_dependencies")
export class TemplateDependency {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => TaskTemplate, (template) => template.dependencies)
    @JoinColumn({ name: "template_id" })
    template!: TaskTemplate;

    @ManyToOne(() => TaskTemplate)
    @JoinColumn({ name: "depends_on_template_id" })
    dependsOn!: TaskTemplate;
}