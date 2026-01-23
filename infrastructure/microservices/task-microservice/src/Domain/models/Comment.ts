import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn
     } from "typeorm";
import { Task } from "./Task";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    comment_id!: number;
    // 
    @Column({ type: "int", unique: false, nullable: false })
    user_id!: number;  // ID korisnika koji je napisao komentar

    @Column("text")
    comment!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Task, (task) => task.comments, {
    nullable: false,
    onDelete: "CASCADE"
    })
    @JoinColumn({ name: "task_id" })
    task?: Task;//kolona koja se dobije je taskTaskId,tako typeorm pravi vezu izmedju tabela
}
