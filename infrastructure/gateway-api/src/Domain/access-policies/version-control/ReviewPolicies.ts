import { UserRole } from "../../enums/user/UserRole";

export const ReviewPolicies = Object.freeze({
  READ: [
    UserRole.PROJECT_MANAGER,
    UserRole.ANIMATION_WORKER,
    UserRole.AUDIO_MUSIC_STAGIST
  ],
  WRITE: [
    UserRole.PROJECT_MANAGER
  ]
} as const);
