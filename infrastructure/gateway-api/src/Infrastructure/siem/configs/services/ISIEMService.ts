import { SIEMEvent } from "../events/SIEMEvent";

/**
 * Interface defining the SIEM Service
 */
export interface ISIEMService {
    /**
     * Sends an event to siem
     * @param {SIEMEvent} event - event being sent to siem
     */
    sendEvent(event: SIEMEvent): void;
}