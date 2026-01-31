import { Entity, PrimaryGeneratedColumn, Column, OneToMany }  from "typeorm";
import { TemplateDependency } from "./TemplateDependency";

@Entity("task_templates")
export class TaskTemplate {
    @PrimaryGeneratedColumn()
    template_id!: number;

    @Column({type: "varchar", unique: false, nullable: false, length: 100})
    template_title!: string;

    @Column({type: "varchar", unique: false, nullable: false, length: 100})
    template_description!: string;

    @Column({ type: "int",default: 0, unique: false, nullable: true })
    estimated_cost!: number;

    @Column({ type: "varchar", unique:false, nullable: true , length: 100})
    attachment_type!: string;

    @OneToMany(() => TemplateDependency, (dep) => dep.template)
    dependencies!: TemplateDependency[];

}