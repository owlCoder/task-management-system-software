import type { ProjectDTO } from "../models/project/ProjectDTO";
import { UserDTO } from "../models/users/UserDTO";

/**
 * Vraća URL slike projekta
 */
export function getProjectImageUrl(project: Pick<ProjectDTO, "image_url">): string {
    return project.image_url || "";
}

/**
 * Vraća URL slike korisnika
 */
export function getUserImageUrl(user: Pick<UserDTO, "image_url">): string {
    return user.image_url || "";
}

/**
 * Proverava da li projekat ima sliku
 */
export function hasProjectImage(project: Pick<ProjectDTO, "image_url">): boolean {
    return !!(project.image_url && project.image_url.trim() !== "");
}

/**
 * Proverava da li korisnik ima sliku
 */
export function hasUserImage(user: Pick<UserDTO, "image_url">): boolean {
    return !!(user.image_url && user.image_url.trim() !== "");
}