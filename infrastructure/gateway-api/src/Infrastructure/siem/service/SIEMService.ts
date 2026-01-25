// Libraries
import { AxiosInstance } from "axios";

// Domain
import { ILoggerService } from "../../../Domain/services/common/ILoggerService";

// Constants
import { SERVICES } from "../../../Constants/services/Services";
import { API_ENDPOINTS } from "../../../Constants/services/APIEndpoints";
import { SIEM_ROUTES } from "../../../Constants/routes/siem/SiemRoutes";

// Infrastructure Configs
import { ISIEMService } from "../configs/services/ISIEMService";
import { SIEMEvent } from "../configs/events/SIEMEvent";
import { createAxiosClient } from "../../axios/client/AxiosClientFactory";

// Infrastructure Utils
import { isSIEMEvent } from "../utils/events/IsSIEMEvent";
import { convertEventToSIEMPayload } from "../utils/converters/SIEMPayloadConverter";

export class SIEMService implements ISIEMService {
    private readonly siemClient: AxiosInstance;

    constructor(private readonly loggerService: ILoggerService) {
        this.siemClient = createAxiosClient(API_ENDPOINTS.SIEM);
    }

    sendEvent(event: SIEMEvent): void {
        if(!isSIEMEvent(event.url, event.method, event.statusCode, event.code)){
            return;
        }

        this.sendToSIEM(event)
    }

    private sendToSIEM(event: SIEMEvent): void {
        const payload = convertEventToSIEMPayload(event);
        this.siemClient.post(SIEM_ROUTES.LOG_EVENT, payload).catch((err) => {
            this.loggerService.err(
                SERVICES.SIEM,
                'SEND_EVENT_FAILED',
                event.url ?? "N/A",
                event.method ?? "N/A",
                `Failed to send SIEM event: ${err instanceof Error ? err.message : 'Unknown'}`
            );
        });
    }

}