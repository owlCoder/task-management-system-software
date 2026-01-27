import { SIEMRouteConfig } from "../../configs/routes/SIEMRouteConfig";
import { ROUTE_CONFIG } from "../../constants/RouteConfigs";

/**
 * Finds the siem config based on the route that was called
 * @param {string} path - requested route 
 * @param {string} method - called method
 * @returns siem route config that contains the level of logging of the route
 */
export function findRouteConfig(path: string, method: string): SIEMRouteConfig {
    // creating entry from method and path (without query parameters)
    const entry = `${method} ${path.split('?')[0]}`
    if (ROUTE_CONFIG[entry]) {
        return ROUTE_CONFIG[entry];
    }

    // comparing called route to existing ones, if the called route is dynamic
    for (const [pattern, level] of Object.entries(ROUTE_CONFIG)) {
        if (matchesPattern(entry, pattern)) {
            return level;
        }
    }

    return ROUTE_CONFIG['*'];
}

/**
 * Tries to match the called method and route to a pattern
 * @param {string} entry - called method and route 
 * @param {string} pattern - expected pattern 
 * @returns true if entry matches pattern, false otherwise
 */
function matchesPattern(entry: string, pattern: string): boolean {
    // replacing placeholders
    const regexPattern = pattern
        .replace(/:\w+/g, '[^/]+')
        .replace(/\*/g, '.*')
        .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(entry);
}