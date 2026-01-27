import { SIEMLogLevel } from "./SIEMLogLevel";

/**
 * Config mapped to the route
 * @field level - level of the siem logging
 */
export interface SIEMRouteConfig {
    level: SIEMLogLevel;
}