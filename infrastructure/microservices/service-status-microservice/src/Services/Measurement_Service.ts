import { Repository } from "typeorm";
import { MeasurementDto } from "../Domain/DTOs/Measurement_DTO";
import { Measurement } from "../Domain/models/Measurement";
import { IMeasurement_Service } from "../Domain/Services/IMeasurement_Service";
import { Db } from "../Database/DbConnectionPool";
import { EOperationalStatus } from "../Domain/enums/EOperationalStatus";
import { Microservice } from "../Domain/models/Microservice";
import { CreateMeasurementDto } from "../Domain/DTOs/CreateMeasurement_DTO";

export class Measurement_Service implements IMeasurement_Service {


    async deleteOldNonDownMeasurements(olderThanMs: number): Promise<number> {
        const cutoffDate = new Date(Date.now() - olderThanMs);

        const result = await this.measurementRepository
            .createQueryBuilder()
            .delete()
            .from(Measurement)
            .where("status != :status", { status: EOperationalStatus.Down })
            .andWhere("measurementDate < :cutoff", { cutoff: cutoffDate })
            .execute();

        return result.affected ?? 0;
    }


    async deleteOldMeasurements(status: EOperationalStatus, olderThanMs: number): Promise<number> {
        const cutoffDate = new Date(Date.now() - olderThanMs);

        const result = await this.measurementRepository
            .createQueryBuilder()
            .delete()
            .from(Measurement)
            .where("status = :status", { status })
            .andWhere("measurementDate < :cutoff", { cutoff: cutoffDate })
            .execute();

        return result.affected ?? 0;
    }

    private get measurementRepository(): Repository<Measurement> {
        return Db.getRepository(Measurement);
    }

    private get microserviceRepository(): Repository<Microservice> {
        return Db.getRepository(Microservice);
    }


    async getNewMeasurements(): Promise<MeasurementDto[]> {

        const subQuery = this.measurementRepository
            .createQueryBuilder("m2")
            .select("MAX(m2.measurement_date)")
            .where("m2.ID_microservice = m.ID_microservice");

        const measurements = await this.measurementRepository
            .createQueryBuilder("m")
            .leftJoinAndSelect("m.microservice", "microservice")
            .where(`m.measurement_date = (${subQuery.getQuery()})`)
            .getMany();

        return measurements.map(m => this.toDto(m));
    }

    async getAverageUptime(): Promise<{ microserviceId: number; uptime: number }[]> {
        const result = await this.measurementRepository
            .createQueryBuilder("m")
            .select("m.ID_microservice", "microserviceId")
            .addSelect(
                `ROUND(
                (SUM(CASE WHEN m.status = :operational THEN 1 ELSE 0 END) * 100.0)
                / COUNT(*),
            2)`,
                "uptime"
            )
            .setParameter("operational", EOperationalStatus.Operational)
            .groupBy("m.ID_microservice")
            .getRawMany();

        return result.map(r => ({
            microserviceId: Number(r.microserviceId),
            uptime: Number(r.uptime),
        }));
    }


    async getMeasurementByID(measurementID: number): Promise<MeasurementDto> {
        const measurement = await this.measurementRepository.findOne({
            where: { measurement_id: measurementID },
            relations: ["microservice"],
        });

        if (!measurement) {
            return new MeasurementDto(0, 0, EOperationalStatus.Down, 0, "");
        }

        return this.toDto(measurement);
    }

    async getMeasurementsFromMicroservice(microserviceId: number): Promise<MeasurementDto[]> {
        const measurements = await this.measurementRepository.find({
            where: {
                microservice: { ID_microservice: microserviceId },
            },
            relations: ["microservice"],
            order: { measurement_date: "DESC" },
        });

        return measurements.map(m => this.toDto(m));
    }

    async getAllDownMeasurements(): Promise<MeasurementDto[]> {
        const measurements = await this.measurementRepository.find({
            where: { "status": EOperationalStatus.Down },
            relations: ['microservice']
        });

        return measurements.map(m => this.toDto(m));
    }

    async getAllMeasurements(): Promise<MeasurementDto[]> {
        const measurements = await this.measurementRepository.find({
            relations: ["microservice"],
            order: { measurement_date: "DESC" },
        });
        return measurements.map(m => this.toDto(m));
    }

    async setMeasurement(measurement: CreateMeasurementDto): Promise<boolean> {

        const microservice = await this.microserviceRepository.findOne({
            where: { ID_microservice: measurement.microserviceId },
        });

        if (!microservice) {
            return false;
        }

        const entity = this.measurementRepository.create({
            microservice,
            status: measurement.status,
            response_time: measurement.responseTime,
        });

        await this.measurementRepository.save(entity);
        return true;
    }

    async deleteMeasurement(measurementID: number): Promise<boolean> {
        const result = await this.measurementRepository.delete({
            measurement_id: measurementID,
        });

        return (result.affected ?? 0) > 0;
    }

    private toDto(entity: Measurement): MeasurementDto {
        return new MeasurementDto(
            entity.measurement_id,
            entity.microservice.ID_microservice,
            entity.status,
            entity.response_time,
            entity.measurement_date.toISOString()
        );
    }
}