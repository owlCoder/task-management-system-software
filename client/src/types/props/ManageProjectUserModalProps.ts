import { IProjectAPI } from "../../api/project/IProjectAPI";

export type Props = {
    projectId: number | null;
    projectName: string;
    weeklyHoursPerWorker: number;
    isOpen: boolean;
    onClose: () => void;
    onUsersUpdated?: () => void;
    projectAPI: IProjectAPI;
};