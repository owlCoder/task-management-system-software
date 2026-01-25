import { SIEMRouteConfig } from "../../configs/routes/SIEMRouteConfig";
import { ROUTE_CONFIG } from "../../constants/RouteConfigs";

export function findRouteConfig(path: string, method: string): SIEMRouteConfig {
    const entry = `${method} ${path.split('?')[0]}`
    if (ROUTE_CONFIG[entry]) {
        return ROUTE_CONFIG[entry];
    }

    for (const [pattern, level] of Object.entries(ROUTE_CONFIG)) {
        if (matchesPattern(entry, pattern)) {
            return level;
        }
    }

    return ROUTE_CONFIG['*'];
}

function matchesPattern(entry: string, pattern: string): boolean {
    const regexPattern = pattern
        .replace(/:\w+/g, '[^/]+')
        .replace(/\*/g, '.*')
        .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(entry);
}