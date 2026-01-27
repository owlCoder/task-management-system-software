/**
 * Payload sent to SIEM-microservice
 * @field message - detailed description of the event
 * @field source - microservice that captured the event (self)
 * @field ipAddress - ip address of the sender 
 */
export interface SIEMPayload {
    message: string;
    source: string;
    ipAddress?: string;
}