// mocks/BudgetTrackingMock.ts
import type { BudgetTrackingDto } from "../models/analytics/BudgetTrackingDto";
import { mockTasks } from "./TaskMock";
import { mockSprints } from "./SprintMock";
import { mockProjects } from "./ProjectsMock";

export const getMockBudgetTrackingByProject = (projectId: number): BudgetTrackingDto => {
    // Pronadji projekat
    const project = mockProjects.find(p => Number(p.project_id) === projectId);
    if (!project) {
        throw new Error("Project not found in mock data");
    }

    // Pronadji sve sprintove za projekat
    const sprintsForProject = mockSprints.filter(s => s.project_id === Number(project.project_id));

    // Pronadji sve taskove za te sprintove
    const tasksForProject = mockTasks.filter(t => sprintsForProject.some(s => s.sprint_id === t.sprint_id));

    // Izracunaj ukupno potroseni budget
    const totalSpent = tasksForProject.reduce((sum, t) => sum + (t.estimated_cost || 0), 0);

    // Dozvoljeni budget projekta
    const allowedBudget = project.allowed_budget ?? 0;

    // Preostali budget i varijansa
    const remainingBudget = allowedBudget - totalSpent;
    const variance = remainingBudget;

    return {
        project_id: Number(project.project_id),
        allowed_budget: allowedBudget,
        total_spent: totalSpent,
        remaining_budget: remainingBudget,
        variance: variance,
    };
};
