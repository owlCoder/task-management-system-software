import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserRole } from "./UserRole";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ type: "varchar", unique: true, nullable: false, length: 100 })
  username!: string;

  @Column({ type: "varchar", nullable: false })
  password_hash!: string;

  @ManyToOne(() => UserRole, (user_role) => user_role.users, {
    nullable: false,
  })
  @JoinColumn({ name: "user_role_id" }) //ovo poravlja naziv kolone umesto da bude user_role_user_role_id, imacemo samo user_role_id. Prvi naziv bi bio takav jer TypeORM po defaultu generise strani kljuc po formuli:
  // <ime_polja_u_entitetu>_<primarni_kljuc_ref_tabele>
  user_role!: UserRole;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "boolean", nullable: false, default: false })
  is_deleted!: boolean;

  @Column({ type: "int", nullable: true, default: 0 })
  weekly_working_hour_sum!: number;
}
