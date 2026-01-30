import { UserRole } from "../../enums/user/UserRole";

export const ReviewPolicies = Object.freeze({
  READ: [
    UserRole.ANIMATION_WORKER,
    UserRole.AUDIO_MUSIC_STAGIST,
    UserRole.PROJECT_MANAGER
  ],
  RESTRICTED_READ: [
    UserRole.PROJECT_MANAGER
  ],
  SEND_REVIEW: [
    UserRole.ANIMATION_WORKER,
    UserRole.AUDIO_MUSIC_STAGIST,
    UserRole.PROJECT_MANAGER
  ],
  WRITE: [
    UserRole.PROJECT_MANAGER
  ]
} as const);