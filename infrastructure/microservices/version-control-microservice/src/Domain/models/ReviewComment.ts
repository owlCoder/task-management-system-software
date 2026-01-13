import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,OneToMany} from "typeorm";

@Entity("reviewComments")
export class ReviewComment {
  @PrimaryGeneratedColumn()
  commentId!: number;
  @Column({ type: "int", nullable: true, default: 0 })
  authorId!: number;
  @Column({ type: "int", nullable: true, default: 0 })
  taskId!: number;
  @Column({ type: "varchar", unique: true, nullable: false, length: 100 })
  time!: string;
  @Column({ type: "varchar", unique: true, nullable: false, length: 100 })
  commentText!: string;
  
}
