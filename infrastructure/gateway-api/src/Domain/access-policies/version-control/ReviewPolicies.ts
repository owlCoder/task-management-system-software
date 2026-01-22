import { UserRole } from "../../enums/user/UserRole";

export const ReviewPolicies = Object.freeze({
  READ: [
    UserRole.PROJECT_MANAGER
  ],
  WRITE: [
    UserRole.PROJECT_MANAGER
  ]
} as const);
