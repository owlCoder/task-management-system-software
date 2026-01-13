import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,OneToMany} from "typeorm";
import { ReviewStatus } from "../enums/ReviewStatus";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
  taskId!: number;
  @Column({ type: "int", nullable: true, default: 0 })
  authorId!: number;
  @Column({ type: "varchar", unique: true, nullable: false, length: 100 })
  time!: string;
  @Column({ type: "varchar"})
  status!: ReviewStatus;
  @Column({ type: "int", nullable: true, default: 0 })
  commentId!: number;
  
}
