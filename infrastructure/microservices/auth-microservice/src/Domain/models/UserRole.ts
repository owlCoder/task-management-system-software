import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("user_roles")
export class UserRole {
  @PrimaryGeneratedColumn()
  user_role_id!: number;

  @Column({ type: "varchar", unique: true, nullable: false, length: 100 })
  role_name!: string;

  @OneToMany(() => User, (user) => user.user_role)
  users!: User[]; 
}
