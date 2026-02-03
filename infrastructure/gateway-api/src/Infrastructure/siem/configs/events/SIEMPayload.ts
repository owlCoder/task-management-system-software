/**
 * Payload sent to SIEM-microservice
 * @field message - detailed description of the event
 * @field source - microservice that captured the event (self)
 * @field userId - id of the sender
 * @field userRole - role of the sender
 * @field ipAddress - ip address of the sender 
 */
export interface SIEMPayload {
    message: string;
    source: string;
    userId?: number;
    userRole?: string;
    ipAddress?: string;
}