import { TaskStatus } from "../enums/TaskStatus";
import type { TaskDTO } from "../models/task/TaskDTO";

export const mockTasks: TaskDTO[] = [
  // ===== PROJECT 1 – SPRINT 1 =====
  {
    task_id: 1001,
    sprint_id: 1,
    worker_id: 101,
    project_manager_id: 201,
    title: "Design wireframes for dashboard",
    task_description:
      "Create low/high-fidelity wireframes covering main user flows.",
    task_status: TaskStatus.IN_PROGRESS,
    estimated_cost: 1200,
    total_hours_spent: 600, // 50% done
    finished_at: undefined,
  },
  {
    task_id: 1002,
    sprint_id: 1,
    worker_id: 102,
    project_manager_id: 201,
    title: "Implement auth flow",
    task_description: "Add login, register, and token refresh to gateway.",
    task_status: TaskStatus.COMPLETED,
    estimated_cost: 1500,
    total_hours_spent: 1500,
    finished_at: new Date("2024-06-10"),
  },

  // ===== PROJECT 1 – SPRINT 2 =====
  {
    task_id: 1003,
    sprint_id: 2,
    worker_id: 103,
    project_manager_id: 201,
    title: "Project settings page",
    task_description: "CRUD for project metadata, sprints, and roles.",
    task_status: TaskStatus.CREATED,
    estimated_cost: 900,
    total_hours_spent: 0,
    finished_at: undefined,
  },
  {
    task_id: 1004,
    sprint_id: 2,
    worker_id: 104,
    project_manager_id: 201,
    title: "Write unit tests",
    task_description: "Increase coverage for project and task services.",
    task_status: TaskStatus.IN_PROGRESS,
    estimated_cost: 700,
    total_hours_spent: 10,
    finished_at: undefined,
  },

  // ===== PROJECT 2 – SPRINT 1 =====
  {
    task_id: 2001,
    sprint_id: 3,
    worker_id: 105,
    project_manager_id: 202,
    title: "Audio mixing pass",
    task_description: "Balance levels and compress main tracks.",
    task_status: TaskStatus.COMPLETED,
    estimated_cost: 600,
    total_hours_spent: 600,
    finished_at: new Date("2024-07-02"),
  },
  {
    task_id: 2002,
    sprint_id: 3,
    worker_id: 106,
    project_manager_id: 202,
    title: "SFX selection",
    task_description: "Select and trim SFX for transitions and alerts.",
    task_status: TaskStatus.IN_PROGRESS,
    estimated_cost: 400,
    total_hours_spent: 5,
    finished_at: undefined,
  },
];

// Funkcija koja vraća taskove za sprint i dodaje "progress" u %
export const getMockTasksBySprint = (sprintId: number) => {
  return mockTasks
    .filter((t) => t.sprint_id === sprintId)
    .map((t) => {
      const progress =
        t.task_status === TaskStatus.COMPLETED
          ? 100
          : t.estimated_cost! > 0
            ? Math.min(Math.round((t.total_hours_spent! / t.estimated_cost!) * 100), 99)
            : 0;

      return {
        ...t,
        progress, // novo polje za Burndown/Burnup
      };
    });
};
