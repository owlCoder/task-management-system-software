import { UserRole } from "../../Domain/enums/UserRole";

export function canAttach(role: string, fileType: string): { success: boolean, message?: string } {
    const isImage = fileType === "image" || fileType.startsWith("image/");
    const isVideo = fileType === "video" || fileType.startsWith("video/");
    const isAudio = fileType === "audio" || fileType.startsWith("audio/");

    if (role === UserRole.ANIMATION_WORKER && !isImage && !isVideo) {
        return { success: false, message: "Only image/video allowed" };
    }

    if (role === UserRole.AUDIO_MUSIC_STAGIST && !isAudio) {
        return { success: false, message: "Only audio allowed" };
    }

    return { success: true };
}