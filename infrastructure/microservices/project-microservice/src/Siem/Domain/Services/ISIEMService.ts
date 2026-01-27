import { SIEMEvent } from "../Models/SIEMEvent";


export interface ISIEMService {
  sendEvent(event: SIEMEvent): void;
}
