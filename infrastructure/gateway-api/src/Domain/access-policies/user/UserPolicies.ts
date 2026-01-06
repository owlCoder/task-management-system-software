import { UserRole } from "../../enums/user/UserRole";

export const UserPolicies = Object.freeze({
    READONLY: [UserRole.ADMIN],
    WRITE: [UserRole.ADMIN]
} as const);