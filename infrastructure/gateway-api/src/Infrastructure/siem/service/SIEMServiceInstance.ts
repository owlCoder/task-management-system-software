import { ISIEMService } from "../configs/services/ISIEMService";

let siemServiceInstance: ISIEMService | null = null;

export function initSIEMService(siemService: ISIEMService): void {
    if(siemServiceInstance){
        throw new Error('SIEM service is already initialized'); 
    }

    siemServiceInstance = siemService;
}

export function getSIEMService(): ISIEMService {
    if (!siemServiceInstance) {
        throw new Error('SIEM service not initialized. Call initSIEMService() first');
    }

    return siemServiceInstance;
}