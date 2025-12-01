import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn
     } from "typeorm";
import { Task } from "./Task";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    comment_id!: number;

    @Column({ type: "int", unique: false, nullable: false })
    user_id!: number;  // ID korisnika koji je napisao komentar

    @Column("text")
    comment!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Task, task => task.comments, { onDelete: "CASCADE" })
    task!: Task;
}
