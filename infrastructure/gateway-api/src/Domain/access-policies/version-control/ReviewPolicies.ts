import { UserRole } from "../../enums/user/UserRole";

export const ReviewPolicies = Object.freeze({
  READ: [
    UserRole.PROJECT_MANAGER
  ],
  WRITE: [
    UserRole.PROJECT_MANAGER
  ],
  SEND: [
    UserRole.ANIMATION_WORKER,
    UserRole.AUDIO_MUSIC_STAGIST
  ]
} as const);
