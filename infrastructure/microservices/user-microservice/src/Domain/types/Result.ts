import { ErrorCode } from "../enums/ErrorCode";

export type Result<T> =
  | { success: true; data: T }
  | { success: false; code: ErrorCode; error: string };
