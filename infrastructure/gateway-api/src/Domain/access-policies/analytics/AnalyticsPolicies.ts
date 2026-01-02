import { UserRole } from "../../enums/user/UserRole";

export const AnalyticsPolicies = Object.freeze({
    READONLY: [UserRole.ANALYTICS_DEVELOPMENT_MANAGER],
    WRITE: [UserRole.ANALYTICS_DEVELOPMENT_MANAGER]
} as const);