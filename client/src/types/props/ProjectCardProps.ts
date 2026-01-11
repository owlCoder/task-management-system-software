import type { ProjectDTO } from "../../models/project/ProjectDTO";

export type Props = {
    project: ProjectDTO;
    selected?: boolean;
    onSelect?: (id: number) => void;
    onView?: (p: ProjectDTO) => void;
    onEdit?: (p: ProjectDTO) => void;
    onDelete?: (p: ProjectDTO) => void;
    canManage?: boolean;
};