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

/**
 * Implementation of the SIEM service
 */
export class SIEMService implements ISIEMService {
    private readonly siemClient: AxiosInstance;

    constructor(private readonly loggerService: ILoggerService) {
        this.siemClient = createAxiosClient(API_ENDPOINTS.SIEM);
    }

    /**
     * Sends an event to siem if event's logging level allows it
     * @param {SIEMEvent} event - event being sent to siem
     */
    sendEvent(event: SIEMEvent): void {
        if(!isSIEMEvent(event.url, event.method, event.statusCode, event.code)){
            return;
        }

        this.sendToSIEM(event)
    }

    /**
     * Sends an event to siem (fire-and-forget)
     * @param {SIEMEvent} event - event being sent to siem
     */
    private sendToSIEM(event: SIEMEvent): void {
        // extracting siem payload from event
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