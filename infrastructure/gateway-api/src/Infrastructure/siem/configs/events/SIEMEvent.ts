/**
 * Interface representing the event for the SIEM
 * @field service - name of the service that captured event (self)
 * @field method - called method (GET, POST, etc.)
 * @field url - route of the request
 * @field statusCode - response status code sent to client
 * @field code - gateway middleware error code (AUTHENTICATION_ERR, AUTHORIZATION_ERR, etc.)
 * @field ip - ip address of the sender
 * @field userId - id of the sender
 * @field userRole - role of the sender
 * @field message - brief description of the event 
 */
export interface SIEMEvent {
    service: string;
    method: string;
    url: string;
    statusCode: number;
    code?: string;
    ip?: string;
    userId?: number;
    userRole?: string;
    message: string;
}