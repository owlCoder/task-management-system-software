import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Measurement } from "./Measurement";


@Entity("microservices")
export class Microservice {
    @PrimaryGeneratedColumn()
    ID_microservice!: number;

    @Column({ type: "varchar", unique: true, nullable: false, length: 100 })
    microservice_name!: string;

    @OneToMany(() => Measurement, measurement => measurement.microservice)
    measurements!: Measurement[];
}
