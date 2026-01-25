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