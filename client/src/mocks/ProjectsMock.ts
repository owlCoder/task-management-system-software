import type { ProjectDTO } from "../models/project/ProjectDTO";
import { ProjectStatus } from "../enums/ProjectStatus";
import { UserRole } from "../enums/UserRole";

export const mockProjects: ProjectDTO[] = [
  {
    id: "1",
    name: "Naziv prvog projekta",
    description: "jduahsdjaskcnajshcudie",
    imageUrl: "https://picsum.photos/seed/proj1/800/450",
    members: [
      {
        id: 1,
        projectId: 1,
        userId: 101,
        hoursPerWeek: 10,
        role: UserRole.PROJECT_MANAGER,
        user: {
          user_id: 101,
          username: "mila",
          email: "mila@example.com",
          role_name: UserRole.PROJECT_MANAGER,
          profileImage: "https://i.pravatar.cc/150?img=11",
        },
      },
      {
        id: 2,
        projectId: 1,
        userId: 102,
        hoursPerWeek: 20,
        role: UserRole.ANIMATION_WORKER,
        user: {
          user_id: 102,
          username: "ivan",
          email: "ivan@example.com",
          role_name: UserRole.ANIMATION_WORKER,
          profileImage: "https://i.pravatar.cc/150?img=12",
        },
      },
      {
        id: 2,
        projectId: 1,
        userId: 102,
        hoursPerWeek: 20,
        role: UserRole.ANIMATION_WORKER,
        user: {
          user_id: 102,
          username: "ivan",
          email: "ivan@example.com",
          role_name: UserRole.ANIMATION_WORKER,
          profileImage: "https://i.pravatar.cc/150?img=12",
        },
      },
      {
        id: 2,
        projectId: 1,
        userId: 102,
        hoursPerWeek: 20,
        role: UserRole.ANIMATION_WORKER,
        user: {
          user_id: 102,
          username: "ivan",
          email: "ivan@example.com",
          role_name: UserRole.ANIMATION_WORKER,
          profileImage: "https://i.pravatar.cc/150?img=12",
        },
      },
    ],
    totalWeeklyHours: 30,
    allowedBudget: 12000,
    status: ProjectStatus.ACTIVE,
    numberOfSprints: 2,
    sprintDuration: 4,
    startDate: "2024-06-01",
  },
  {
    id: "2",
    name: "Naziv drugog projekta",
    description:
      "ajsdhausudgausxaspojoiashdosandsapjdkaoskdsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    imageUrl: "https://picsum.photos/seed/proj2/800/450",
    members: [
      {
        id: 3,
        projectId: 2,
        userId: 103,
        hoursPerWeek: 30,
        role: UserRole.AUDIO_MUSIC_STAGIST,
        user: {
          user_id: 103,
          username: "jelena",
          email: "jelena@example.com",
          role_name: UserRole.AUDIO_MUSIC_STAGIST,
          profileImage: "https://i.pravatar.cc/150?img=15",
        },
      },
    ],
    totalWeeklyHours: 30,
    allowedBudget: 6000,
    status: ProjectStatus.PAUSED,

    numberOfSprints: 3,
    sprintDuration: 7,
    startDate: "2024-07-01",
  },
];
