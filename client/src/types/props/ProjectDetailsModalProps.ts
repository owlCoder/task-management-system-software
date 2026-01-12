import type { ProjectDTO } from "../../models/project/ProjectDTO";
export type Props = {
    project: ProjectDTO | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (project: ProjectDTO) => void;
};
