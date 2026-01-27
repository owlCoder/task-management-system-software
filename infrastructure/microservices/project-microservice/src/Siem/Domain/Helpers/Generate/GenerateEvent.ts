import { Request } from "express";
import { SIEMEvent } from "../../Models/SIEMEvent";

export function generateEvent(
  service: string,
  req: Request,
  statusCode: number,
  message: string,
): SIEMEvent {
  return {
    service: service,
    method: req.method,
    url: req.url,
    statusCode: statusCode,
    message: message,
  };
}
