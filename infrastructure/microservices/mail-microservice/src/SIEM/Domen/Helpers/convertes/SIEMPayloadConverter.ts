import { SIEMEvent } from "../../model/SIEMEvent";
import { SIEMPayload } from "../../model/SIEMPayload";

export function convertEventToSIEMPayload(event: SIEMEvent): SIEMPayload {
  const messageParts = [event.message];

  if (event.method && event.url) {
    messageParts.push(`| ${event.method} ${event.url}`);
  }

  if (event.statusCode) {
    messageParts.push(`| Status: ${event.statusCode}`);
  }


  const payload: SIEMPayload = {
    message: messageParts.join(" "),
    source: event.service,
  };

  return payload;
}
