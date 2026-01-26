import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,OneToMany} from "typeorm";
import { ReviewStatus } from "../enums/ReviewStatus";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
  reviewId!: number;
  @Column({ type: "int", nullable: false })
  taskId!: number;
  @Column({ type: "int", nullable: false})
  authorId!: number;
  @Column({ type: "varchar", unique: false, nullable: false, length: 100 })
  time!: string;
  @Column({ type: "int", nullable: true })
  reviewedBy: number | null = null; 
  @Column({ type: "varchar", nullable: true })
  reviewedAt: string | null = null;
  @Column({ type: "varchar"})
  status!: ReviewStatus;
  @Column({ type: "int", nullable: true })
  commentId: number | null = null;
  
}
