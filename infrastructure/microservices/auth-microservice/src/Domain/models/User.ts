import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserRole } from "./UserRole";

/** 
  Acquired from user-microservice
*/

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ type: "varchar", unique: true, nullable: true, length: 100 })
  username?: string | null; // Google useri ne moraju imati username, vec email

  @Column({ type: "varchar", nullable: true })
  password_hash?: string | null; // zbog google user-a

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
  
  @Column({ type: "varchar", length: 255, nullable: true })
  image_url!: string | null; 

  @Column({ type: "varchar", unique: true, nullable: true })
  google_id!: string | null;

  @Column({ type: "varchar", nullable: true, length: 255 })
  image_key!: string;
}
