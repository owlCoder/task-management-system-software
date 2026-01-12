import { Repository } from "typeorm";
import { MicroserviceDto } from "../Domain/DTOs/Microservice_DTO";
import { IMicroservice_Service } from "../Domain/Services/IMicroservice_Service";
import { Microservice } from "../Domain/models/Microservice";
import { Db } from "../Database/DbConnectionPool";

export class Microservice_Service implements IMicroservice_Service {

    private microserviceRepository: Repository<Microservice>;

    constructor() {
        this.microserviceRepository = Db.getRepository(Microservice);
    }

    async getAllMicroservices(): Promise<MicroserviceDto[]> {
        const microservices = await this.microserviceRepository.find({
            order: { microservice_name: "ASC" },
        });

        return microservices.map(m => this.toDto(m));
    }

    async getMicroserviceByName(microserviceName: string): Promise<MicroserviceDto> {
        const microservice = await this.microserviceRepository.findOne({
            where: { microservice_name: microserviceName },
        });

        if (!microservice) {
            return new MicroserviceDto(0, "");
        }

        return this.toDto(microservice);
    }
    async getMicroserviceByID(microserviceId: number): Promise<MicroserviceDto> {

        const microservice = await this.microserviceRepository.findOne({
            where: { ID_microservice: microserviceId },
        });

        if (!microservice) {
            return new MicroserviceDto(0, "");
        }

        return this.toDto(microservice);
    }

    async setMicroservice(microserviceName: string): Promise<boolean> {
        const existing = await this.microserviceRepository.findOne({
            where: { microservice_name: microserviceName },
        });

        if (existing) {
            return false;
        }

        const newMicroservice = this.microserviceRepository.create({
            microservice_name: microserviceName
        });

        await this.microserviceRepository.save(newMicroservice);

        return true;
    }
    
    async deleteMicroservice(microserviceId: number): Promise<boolean> {
        const result = await this.microserviceRepository.delete({
            ID_microservice: microserviceId,
        });

        return (result.affected ?? 0) > 0;
    }

    private toDto(entity: Microservice): MicroserviceDto {
        return {
            microserviceId: entity.ID_microservice,
            microserviceName: entity.microservice_name,
        };
    }
}