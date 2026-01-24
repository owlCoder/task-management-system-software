import { userInfo } from "os";
import { UserRole } from "../../enums/user/UserRole";

export const UserPolicies = Object.freeze({
    READONLY: [UserRole.ADMIN],
    WRITE: [UserRole.ADMIN],

    READ_MULTIPLE: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.ANALYTICS_DEVELOPMENT_MANAGER],
} as const);