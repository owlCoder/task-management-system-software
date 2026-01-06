import { UserRole } from "../../enums/user/UserRole";

export const ProjectPolicies = Object.freeze({
    READONLY: [
        UserRole.PROJECT_MANAGER, 
        UserRole.ANALYTICS_DEVELOPMENT_MANAGER,
        UserRole.ANIMATION_WORKER, 
        UserRole.AUDIO_MUSIC_STAGIST
    ],
    WRITE: [UserRole.PROJECT_MANAGER]
} as const);