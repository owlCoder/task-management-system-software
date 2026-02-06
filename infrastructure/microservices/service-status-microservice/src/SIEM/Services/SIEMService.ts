import { AxiosInstance } from "axios";
import { createAxiosClient } from "../Domen/axios/client/AxiosClientFactory";
import { ISIEMService } from "../Domen/services/ISIEMService";
import { SIEMEvent } from "../Domen/model/SIEMEvent";
import { convertEventToSIEMPayload } from "../Domen/Helpers/convertes/SIEMPayloadConverter";
import { ILoggerService } from "../../Domain/Services/ILoggerService";


export class SIEMService implements ISIEMService {
  private readonly siemClient: AxiosInstance;

  constructor(private readonly loggerService: ILoggerService) {
    this.siemClient = createAxiosClient(process.env.SIEM!);
  }

  sendEvent(event: SIEMEvent): void {
    this.sendToSIEM(event);
  }

  private sendToSIEM(event: SIEMEvent): void {
    const payload = convertEventToSIEMPayload(event);
    this.siemClient.post("/parserEvents/log", payload).catch((err) => {
      this.loggerService.err(
        "SEND_EVENT_FAILED",
        `[SIEM] url=${event.url ?? "N/A"} method=${event.method ?? "N/A"} | ${err instanceof Error ? err.message : "Unknown"
        }`
      );
    });
  }
}
