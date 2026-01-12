import { MicroserviceDto } from "../DTOs/Microservice_DTO";
export interface IMicroservice_Service {
  
  getMicroserviceByName(microserviceName: string): Promise<MicroserviceDto>;
  getMicroserviceByID(microserviceId: number):Promise<MicroserviceDto>;
  setMicroservice(microserviceId: number):Promise<boolean>;
  deleteMicroservice(microserviceId: number):Promise<boolean>;
}