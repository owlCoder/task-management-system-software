export interface SIEMEvent {
  service: string;
  method: string;
  url: string;
  statusCode: number;
  message: string;
}
