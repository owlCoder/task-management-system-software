import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user_roles")
export class UserRole {
    @PrimaryGeneratedColumn()
    role_id!: number;
    @Column({length: 100})   
    role_name!: string;
}