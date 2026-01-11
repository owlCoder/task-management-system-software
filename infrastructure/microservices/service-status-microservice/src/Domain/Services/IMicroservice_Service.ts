import { MicroserviceDto } from "../DTOs/Microservice_DTO";
export interface IMicroservice_Service {
  
  getMicroserviceByName(microserviceName: string): MicroserviceDto;
  getMicroserviceByID(microserviceId: number): MicroserviceDto;
  setMicroservice(microserviceId: number): void;
  deleteMicroservice(microserviceId: number): void;
}