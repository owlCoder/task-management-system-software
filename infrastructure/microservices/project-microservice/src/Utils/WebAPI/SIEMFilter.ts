// src/Utils/WebAPI/sendSiemEvent.ts
import { Request } from "express";
import { ISIEMService } from "../../Siem/Domain/Services/ISIEMService";
import { generateEvent } from "../../Siem/Domain/Helpers/Generate/GenerateEvent";

export function sendSiemEvent(
    siemService: ISIEMService,
    req: Request,
    statusCode: number,
    message: string,
    isCriticalOperation: boolean
): void {
    // ne logovati 400 (Bad Request)
    if (statusCode === 400) return;

    const isSuccess = statusCode >= 200 && statusCode < 300;

    // na success logovati samo kriticne operacije
    if (isSuccess && !isCriticalOperation) return;

    siemService.sendEvent(
        generateEvent("project-microservice", req, statusCode, message)
    );
}