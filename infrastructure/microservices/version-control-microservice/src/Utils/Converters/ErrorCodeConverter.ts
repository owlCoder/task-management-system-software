import { ErrorCode } from "../../Domain/enums/ErrorCode";

export function errorCodeToHttpStatus(error: ErrorCode): number {
    switch (error) {
        case ErrorCode.NOT_FOUND:
            return 404;
        case ErrorCode.FORBIDDEN:
            return 403;
        case ErrorCode.INVALID_INPUT:
            return 400;
        default:
            return 500;
    }
}
