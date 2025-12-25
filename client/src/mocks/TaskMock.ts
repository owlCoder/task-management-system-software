import { TaskStatus } from "../enums/TaskStatus";
import type { TaskDTO } from "../models/task/TaskDTO";

// Tasks are now linked to SPRINTS (not directly to projects)
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
    total_hours_spent: 8,
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
    total_hours_spent: 14,
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
    total_hours_spent: 3,
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
    total_hours_spent: 6,
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
    total_hours_spent: 2,
  },

  // ===== PROJECT 2 – SPRINT 2 =====
  {
    task_id: 2003,
    sprint_id: 4,
    worker_id: 107,
    project_manager_id: 202,
    title: "Render preview",
    task_description: "Export a 1080p preview for stakeholder review.",
    task_status: TaskStatus.PENDING,
    estimated_cost: 300,
    total_hours_spent: 0,
  },

  // ===== PROJECT 2 – SPRINT 3 =====
  {
    task_id: 2004,
    sprint_id: 5,
    worker_id: 108,
    project_manager_id: 202,
    title: "QA checklist",
    task_description: "Finalize QA checklist for release candidate.",
    task_status: TaskStatus.CREATED,
    estimated_cost: 250,
    total_hours_spent: 0,
  },
];

export const getMockTasksBySprint = (
  sprintId: number
): TaskDTO[] => {
  return mockTasks.filter((t) => t.sprint_id === sprintId);
};
