import { ErrorCode } from '../../Domain/types/common/ErrorCode';

export function mapErrorCodeToHttpStatus(errorCode: ErrorCode): number {
  switch (errorCode) {
    case ErrorCode.INVALID_INPUT:
      return 400;
    case ErrorCode.NOT_FOUND:
      return 404;
    case ErrorCode.UNAUTHORIZED:
      return 401;
    case ErrorCode.FORBIDDEN:
      return 403;
    case ErrorCode.CONFLICT:
      return 409;
    case ErrorCode.INTERNAL_ERROR:
      return 500;
    default:
      return 500;
  }
}
