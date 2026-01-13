import { Repository } from "typeorm";
import { MeasurementDto } from "../Domain/DTOs/Measurement_DTO";
import { Measurement } from "../Domain/models/Measurement";
import { IMeasurement_Service } from "../Domain/Services/IMeasurement_Service";
import { Db } from "../Database/DbConnectionPool";
import { EOperationalStatus } from "../Domain/enums/EOperationalStatus";
import { Microservice } from "../Domain/models/Microservice";

export class Measurement_Service implements IMeasurement_Service {

    private get measurementRepository(): Repository<Measurement> {
        return Db.getRepository(Measurement);
    }

    private get microserviceRepository(): Repository<Microservice> {
        return Db.getRepository(Microservice);
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

        return measurements.map(m => this.toDto(m));    }

    async getAllMeasurements(): Promise<MeasurementDto[]> {
        const measurements = await this.measurementRepository.find({
            relations: ["microservice"],
            order: { measurement_date: "DESC" },
        });
        return measurements.map(m => this.toDto(m));
    }

    async setMeasurement(measurement: MeasurementDto): Promise<boolean> {

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