import { SIEMEvent } from "../events/SIEMEvent";

export interface ISIEMService {
    sendEvent(event: SIEMEvent): void;
}