import { In, Repository } from "typeorm";
import { MeasurementDto } from "../Domain/DTOs/Measurement_DTO";
import { Measurement } from "../Domain/models/Measurement";
import { IMeasurement_Service } from "../Domain/Services/IMeasurement_Service";
import { Db } from "../Database/DbConnectionPool";
import { EOperationalStatus } from "../Domain/enums/EOperationalStatus";
import { Microservice } from "../Domain/models/Microservice";
import { CreateMeasurementDto } from "../Domain/DTOs/CreateMeasurement_DTO";
import { ServiceStatusTransportDto } from "../Domain/DTOs/ServiceStatusTransport_DTO";

export class Measurement_Service implements IMeasurement_Service {


    async deleteOldNonDownMeasurements(olderThanMs: number): Promise<number> {
        const cutoffDate = new Date(Date.now() - olderThanMs);

        const result = await this.measurementRepository
            .createQueryBuilder()
            .delete()
            .from(Measurement)
            .where("status != :status", { status: EOperationalStatus.Down })
            .andWhere("measurement_date < :cutoff", { cutoff: cutoffDate })
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
            .andWhere("measurement_date < :cutoff", { cutoff: cutoffDate })
            .execute();

        return result.affected ?? 0;
    }

    private get measurementRepository(): Repository<Measurement> {
        return Db.getRepository(Measurement);
    }

    private get microserviceRepository(): Repository<Microservice> {
        return Db.getRepository(Microservice);
    }


    async getAverageResponseTime(days: number): Promise<{ time: string; avgResponseTime: number }[]> {

        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);

        const result = await this.measurementRepository
            .createQueryBuilder("m")
            .select(`DATE_FORMAT(m.measurement_date, '%Y-%m-%d %H:%i')`, "time")
            .addSelect(`ROUND(AVG(m.response_time), 2)`, "avgResponseTime")
            .where("m.measurement_date >= :fromDate")
            .setParameter("fromDate", fromDate)
            .groupBy(`DATE_FORMAT(m.measurement_date, '%Y-%m-%d %H:%i')`)
            .orderBy(`time`, "ASC")
            .getRawMany();

        return result.map(r => ({
            time: r.time, avgResponseTime: Number(r.avgResponseTime),
        }));
    }


    async getLatestStatuses(): Promise<{ microserviceId: number; status: EOperationalStatus }[]> {

        const subQuery = this.measurementRepository
            .createQueryBuilder("m2")
            .select("MAX(m2.measurement_date)")
            .where("m2.ID_microservice = m.ID_microservice");

        const rows = await this.measurementRepository
            .createQueryBuilder("m")
            .select("m.ID_microservice", "microserviceId")
            .addSelect("m.status", "status")
            .where(`m.measurement_date = (${subQuery.getQuery()})`)
            .getRawMany();

        return rows.map(r => ({
            microserviceId: Number(r.microserviceId),
            status: r.status
        }));
    }


    async getAverageUptime(): Promise<{ microserviceId: number; uptime: number }[]> {
        const result = await this.measurementRepository
            .createQueryBuilder("m")
            .select("m.ID_microservice", "microserviceId")
            .addSelect(
                `(SUM(m.status != :down) * 100.0) / COUNT(*)`,
                "uptime"
            )
            .where("m.measurement_date >= CURDATE()")
            .setParameter("down", EOperationalStatus.Down)
            .groupBy("m.ID_microservice")
            .getRawMany();

        return result.map(r => ({
            microserviceId: Number(r.microserviceId),
            uptime: Math.round(Number(r.uptime) * 100) / 100
        }));
    }


    async getMeasurementByID(measurementID: number): Promise<MeasurementDto> {
        const measurement = await this.measurementRepository.findOne({
            where: { measurement_id: measurementID },
            relations: ["microservice"],
        });

        if (!measurement) {
            return new MeasurementDto(0, "", EOperationalStatus.Down, 0, "");
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
            where: { status: EOperationalStatus.Down },
            relations: ['microservice'],
            take: 20
        });

        return Promise.all(measurements.map(m => this.toDto(m)));
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
            where: { ID_microservice: measurement.microserviceId }
        });

        if (!microservice) {
            return false;
        }

        const entity = this.measurementRepository.create({
            microservice,
            status: measurement.status,
            response_time: measurement.responseTime
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
            entity.microservice.microservice_name,
            entity.status,
            entity.response_time,
            entity.measurement_date.toISOString()
        );
    }
}