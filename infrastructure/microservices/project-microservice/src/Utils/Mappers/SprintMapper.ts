import { Sprint } from "../../Domain/models/Sprint";
import { SprintDTO } from "../../Domain/DTOs/SprintDTO";

export const SprintMapper = {
  toDTO(s: Sprint): SprintDTO {
    return {
      sprint_id: s.sprint_id,
      project_id: (s.project as any).project_id,
      sprint_title: s.sprint_title,
      sprint_description: s.sprint_description,
      start_date: s.start_date,
      end_date: s.end_date,
      story_points: s.story_points
    };
  },
};