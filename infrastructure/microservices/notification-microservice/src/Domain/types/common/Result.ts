import { ErrorCode } from '../../enums/ErrorCode';

export type Result<T> =
  | { success: true; data: T }
  | { success: false; errorCode: ErrorCode; message: string };