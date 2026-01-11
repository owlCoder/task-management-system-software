import type { ProjectDTO } from "../../models/project/ProjectDTO";

export type Props = {
    project: ProjectDTO | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updated: ProjectDTO, imageFile?: File) => void;
};
