import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({ name: "user_id" })
  id!: number;

  @Column({ type: "varchar", unique: true, length: 100 })
  username!: string;

  @Column({ name: "password_hash", type: "varchar", length: 300 })
  password!: string;

  @Column({ name: "user_role", type: "int", default: 0 })
  role!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "boolean", default: false })
  is_deleted!: boolean;

  @Column({ type: "int", nullable: true })
  weekly_working_hour_sum!: number | null;
}
