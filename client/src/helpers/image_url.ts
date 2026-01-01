import type { ProjectDTO } from "../models/project/ProjectDTO";

/**
 * Vraća data URL za sliku projekta iz base64 podataka
 * @param project - ProjectDTO objekat sa image_data i image_content_type
 * @returns Data URL za sliku ili prazan string ako nema slike
 */
export function getProjectImageUrl(project: Pick<ProjectDTO, 'image_data' | 'image_content_type'>): string {
    if (project.image_data && project.image_content_type) {
        return `data:${project.image_content_type};base64,${project.image_data}`;
    }
    return '';
}

/**
 * Proverava da li projekat ima sliku
 */
export function hasProjectImage(project: Pick<ProjectDTO, 'image_data' | 'image_content_type'>): boolean {
    return !!(project.image_data && project.image_content_type);
}