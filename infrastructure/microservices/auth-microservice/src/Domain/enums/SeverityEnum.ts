
/**
 * Log severity levels for the logging system.
 * Lower numbers = higher priority (DEBUG shows everything, ERROR shows only errors).
 */
export enum SeverityEnum {
    /** Detailed debugging information for development */
    DEBUG = 0,
    /** General information about application flow */
    INFO = 1,
    /** Warning messages for potential issues */
    WARN = 2,
    /** Error messages for failures */
    ERROR = 3,
}

export const SeverityColors = {
    [SeverityEnum.DEBUG]: '\x1b[34m', // blue
    [SeverityEnum.INFO]: '\x1b[32m', // green
    [SeverityEnum.WARN]: '\x1b[33m', // yellow
    [SeverityEnum.ERROR]: '\x1b[31m', // red
};