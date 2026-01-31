import { SIEMEvent } from "../model/SIEMEvent";


export interface ISIEMService {
  sendEvent(event: SIEMEvent): void;
}
