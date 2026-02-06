import { AxiosInstance } from "axios";
import { createAxiosClient } from "../Domen/axios/client/AxiosClientFactory";
import { ISIEMService } from "../Domen/services/ISIEMService";
import { SIEMEvent } from "../Domen/model/SIEMEvent";
import { convertEventToSIEMPayload } from "../Domen/Helpers/convertes/SIEMPayloadConverter";
import { ILogerService } from "../../Domain/services/ILogerService";

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
      this.loggerService.log(
        `Failed to send SIEM event: ${err instanceof Error ? err.message : "Unknown"}`,
      );
    });
  }
}
