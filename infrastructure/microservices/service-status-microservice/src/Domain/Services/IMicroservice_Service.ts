import { MicroserviceDto } from "../DTOs/Microservice_DTO";
export interface IMicroservice_Service {
  
  getMicroserviceByName(microserviceName: string): Promise<MicroserviceDto>;
  getMicroserviceByID(microserviceId: number):Promise<MicroserviceDto>;
  getAllMicroservices():Promise<MicroserviceDto[]>;

  setMicroservice(microserviceName: string):Promise<boolean>;
  deleteMicroservice(microserviceId: number):Promise<boolean>;
}