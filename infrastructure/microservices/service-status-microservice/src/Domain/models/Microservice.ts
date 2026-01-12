import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("Microservices")
export class Microservice{
    @PrimaryGeneratedColumn()
    ID_microservice!: number;

    @Column({ type: "varchar", unique: true, nullable: false, length: 100 })
    microservice_name!: string;
}