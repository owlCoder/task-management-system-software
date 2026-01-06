import { ProjectUser } from "../../Domain/models/ProjectUser";
import { ProjectUserDTO } from "../../Domain/DTOs/ProjectUserDTO";

export const ProjectUserMapper = {
  toDTO(pu: ProjectUser): ProjectUserDTO {
    return {
      pu_id: pu.pu_id,
      project_id: (pu.project).project_id,
      user_id: pu.user_id,
      weekly_hours: pu.weekly_hours
    };
  },
};