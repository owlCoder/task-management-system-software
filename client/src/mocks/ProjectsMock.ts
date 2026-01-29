import { ProjectStatus } from "../enums/ProjectStatus";
import type { ProjectDTO } from "../models/project/ProjectDTO";

export const mockProjects: ProjectDTO[] = [
  {
    project_id: 1,
    project_name: "Naziv prvog projekta",
    project_description: "jduahsdjaskcnajshcudie",
    image_url: "https://picsum.photos/seed/proj1/800/450",
    total_weekly_hours_required: 30,
    allowed_budget: 12000,
    sprint_count: 2,
    sprint_duration: 4,
    start_date: "2024-06-01",
    status: ProjectStatus.ACTIVE,
  },
  {
    project_id: 2,
    project_name: "Naziv drugog projekta",
    project_description:
      "ajsdhausudgausxaspojoiashdosandsapjdkaoskdsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    image_url: "https://picsum.photos/seed/proj2/800/450",
    total_weekly_hours_required: 30,
    allowed_budget: 6000,
    sprint_count: 3,
    sprint_duration: 7,
    start_date: "2024-07-01",
    status: ProjectStatus.PAUSED,
  },
];