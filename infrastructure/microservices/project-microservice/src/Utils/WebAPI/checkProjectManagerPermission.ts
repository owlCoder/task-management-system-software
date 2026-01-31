import { IProjectUserService } from "../../Domain/services/IProjectUserService";
import { Request } from "express";

export async function checkProjectManagerPermission(
    req: Request,
    projectUserService: IProjectUserService,
    projectId: number
): Promise<boolean> {
    const rawUserId = req.headers["x-sender-id"];
    if (!rawUserId) {
        return false;
    }

    const userId = parseInt(Array.isArray(rawUserId) ? rawUserId[0] : rawUserId, 10);
    if(isNaN(userId)) {
        return false;
    }

    const result = await projectUserService.isUserOnProject(projectId, userId);
    return result.success && result.data === true;
}