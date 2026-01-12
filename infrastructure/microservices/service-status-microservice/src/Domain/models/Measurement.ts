import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from "typeorm";
import { EOperationalStatus } from "../enums/EOperationalStatus";
import { Microservice } from "./Microservice";

@Entity("Measurements")
export class Measurement {

    @PrimaryGeneratedColumn()
    measurement_id!: number;

    @ManyToOne(() => Microservice, { nullable: false })
    @JoinColumn({ name: "ID_microservice" })
    microservice!: Microservice;

    @Column({
        type: "enum",
        enum: EOperationalStatus,
        nullable: false,
    })
    status!: EOperationalStatus;

    @Column({ type: "int", nullable: false })
    response_time!: number;

    @CreateDateColumn({
        type: "datetime",
    })
    measurement_date!: Date;
}
