import { SIEMEvent } from "../../configs/events/SIEMEvent";
import { SIEMPayload } from "../../configs/events/SIEMPayload";

/**
 * Converts a siem event to a siem payload
 * 
 * Message format: message [| method url] [| Status: statusCode] [| UserID: userId (userRole)]
 * @param event - event being sent to siem
 * @returns siem payload
 */
export function convertEventToSIEMPayload(event: SIEMEvent): SIEMPayload {
    const messageParts = [
        event.message
    ];

    if (event.method && event.url) {
        messageParts.push(`| ${event.method} ${event.url}`);
    }

    if (event.statusCode) {
        messageParts.push(`| Status: ${event.statusCode}`);
    }

    if (event.userId) {
        messageParts.push(`| UserID: ${event.userId}${event.userRole ? ` (${event.userRole})` : ''}`);
    }

    const payload: SIEMPayload = {
        message: messageParts.join(' '),
        source: event.service,
        ipAddress: event.ip
    };

    return payload;
}