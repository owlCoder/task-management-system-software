/**
 * Levels of SIEM logging
 * 
 * NEVER - never logs the request.
 * ERROR - logs the request on 4xx, 5xx.
 * CRITICAL - always logs the request.
 */
export enum SIEMLogLevel {
    NEVER,
    ERROR,
    CRITICAL
}