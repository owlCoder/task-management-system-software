import type { ISprintAPI } from "../../api/sprint/ISprintAPI";

export type CreateSprintModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onCreated?: () => void;
  sprintAPI: ISprintAPI;
};
