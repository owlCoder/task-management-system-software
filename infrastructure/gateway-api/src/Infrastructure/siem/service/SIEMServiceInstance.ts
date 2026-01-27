import { ISIEMService } from "../configs/services/ISIEMService";

// instance of the siem service
let siemServiceInstance: ISIEMService | null = null;

/**
 * Ensures siem service is initialized only once
 * @param {ISIEMService} siemService - implemenatation of the siem service
 * @throws when initialization is called multiple times
 */
export function initSIEMService(siemService: ISIEMService): void {
    if(siemServiceInstance){
        throw new Error('SIEM service is already initialized'); 
    }

    siemServiceInstance = siemService;
}

/**
 * Getter for the global siem service
 * @returns siem service interface
 * @throws when getter is called before initialization
 */
export function getSIEMService(): ISIEMService {
    if (!siemServiceInstance) {
        throw new Error('SIEM service not initialized. Call initSIEMService() first');
    }

    return siemServiceInstance;
}