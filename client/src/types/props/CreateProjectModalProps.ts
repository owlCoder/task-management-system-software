import type { ProjectCreateDTO } from "../../models/project/ProjectCreateDTO";

export type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: ProjectCreateDTO) => void;
};