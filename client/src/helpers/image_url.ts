import type { ProjectDTO } from "../models/project/ProjectDTO";

/**
 * Vraća URL slike projekta
 */
export function getProjectImageUrl(project: Pick<ProjectDTO, "image_url">): string {
    return project.image_url || "";
}

/**
 * Proverava da li projekat ima sliku
 */
export function hasProjectImage(project: Pick<ProjectDTO, "image_url">): boolean {
    return !!(project.image_url && project.image_url.trim() !== "");
}