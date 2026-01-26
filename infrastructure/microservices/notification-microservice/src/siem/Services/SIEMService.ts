import { AxiosInstance } from "axios";
import { createAxiosClient } from "../Domain/axios/client/AxiosClientFactory";
import { ISIEMService } from "../Domain/services/ISIEMService";
import { SIEMEvent } from "../Domain/model/SIEMEvent";
import { convertEventToSIEMPayload } from "../Domain/Helpers/convertes/SIEMPayloadConverter";
import { ILogerService } from "../../Domain/Services/ILogerService";

export class SIEMService implements ISIEMService {
  private readonly siemClient: AxiosInstance;

  constructor(private readonly loggerService: ILogerService) {
    this.siemClient = createAxiosClient(process.env.SIEM!);
  }

  sendEvent(event: SIEMEvent): void {
    this.sendToSIEM(event);
  }

  private sendToSIEM(event: SIEMEvent): void {
    const payload = convertEventToSIEMPayload(event);
    this.siemClient.post("/parserEvents/log", payload).catch((err) => {
      this.loggerService.err(
        "SIEM",
        "SEND_EVENT_FAILED",
        event.url ?? "N/A",
        event.method ?? "N/A",
        `Failed to send SIEM event: ${err instanceof Error ? err.message : "Unknown"}`,
      );
    });
  }
}
