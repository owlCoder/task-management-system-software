import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,OneToMany} from "typeorm";

@Entity("reviewComments")
export class ReviewComment {
  @PrimaryGeneratedColumn()
  commentId!: number;
  @Column({ type: "int", nullable: false })
  reviewId!: number;
  @Column({ type: "int", nullable: false})
  authorId!: number;
  @Column({ type: "int", nullable: false})
  taskId!: number;
  @Column({ type: "varchar", nullable: false, length: 100 })
  time!: string;
  @Column({ type: "varchar", unique: false, nullable: false })
  commentText!: string;
  
}
