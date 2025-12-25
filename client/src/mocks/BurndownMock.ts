// mocks/BurndownMock.ts
import type { BurndownDto } from "../models/analytics/BurndownDto";
import { mockTasks } from "./TaskMock";
import { mockSprints } from "./SprintMock";
import { mockProjects } from "./ProjectsMock";
import { BurndownTaskDTO } from "../models/analytics/BurndownTaskDto";

export const getMockBurndownBySprint = (sprintId: number): BurndownDto => {
    // pronadji sprint
    const sprint = mockSprints.find((s) => s.sprint_id === sprintId);
    if (!sprint) {
        throw new Error("Sprint not found in mock data");
    }

    // pronadji project
    const project = mockProjects.find((p) => p.id === String(sprint.project_id));
    if (!project) {
        throw new Error("Project not found in mock data");
    }

    // uzmi sve taskove za dati sprint
    const tasksForSprint = mockTasks.filter((t) => t.sprint_id === sprintId);

    // ukupni "budget" svih taskova u sprintu
    const totalEstimated = tasksForSprint.reduce(
        (acc, t) => acc + (t.estimated_cost || 0),
        0
    );

    // izracunaj ideal i real progress kao backend service
    const burndownTasks: BurndownTaskDTO[] = tasksForSprint.map((t) => {
        const ideal = totalEstimated > 0
            ? ((t.estimated_cost || 0) / totalEstimated) * 100
            : 0;
        const real = t.total_hours_spent || 0;

        return {
            task_id: t.task_id,
            ideal_progress: ideal,
            real_progress: real,
        };
    });

    return {
        project_id: Number(project.id),
        sprint_id: sprintId,
        tasks: burndownTasks,
    };
};
