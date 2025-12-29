import { Repository } from "typeorm";
import { IFinancialAnalyticsService } from "../Domain/services/IFinancialAnalyticsService";
import { Project } from "../Domain/models/Project";
import { Task } from "../Domain/models/Task";
import { Sprint } from "../Domain/models/Sprint";
import { BudgetTrackingDto } from "../Domain/DTOs/BudgetTrackingDto";
import { ResourceCostAllocationDto } from "../Domain/DTOs/ResourceCostAllocationDto";
import { ResourceCostAllocationItemDto } from "../Domain/DTOs/ResourceCostAllocationItemDto";
import { ProfitMarginDto } from "../Domain/DTOs/ProfitMarginDto";

export class FinancialAnalyticsService implements IFinancialAnalyticsService {
  constructor(
    private readonly projectRepository: Repository<Project>,
    private readonly sprintRepository: Repository<Sprint>,
    private readonly taskRepository: Repository<Task>
  ) {}

  async getBudgetTrackingForProject(projectId: number): Promise<BudgetTrackingDto> {
    const project = await this.projectRepository.findOneBy({ project_id: projectId });
    if (!project) throw new Error("Project not found");

    const sprints = await this.sprintRepository.find({ where: { project } });

    let totalSpent = 0;

    for (const sprint of sprints) {
      // TODO: CHANGE TO SPRINT
      // trenutno ide po project_id jer Task nema sprint_id
      const sprintTasks = await this.taskRepository.find({
        where: { sprint_id: sprint.sprint_id }
      });
      totalSpent += sprintTasks.reduce((sum, t) => sum + (t.estimated_cost ?? 0), 0);
    }

    const remaining = project.allowed_budget - totalSpent;
    const variance = totalSpent - project.allowed_budget;

    return {
      project_id: project.project_id,
      allowed_budget: Number(project.allowed_budget.toFixed(2)),
      total_spent: Number(totalSpent.toFixed(2)),
      remaining_budget: Number(remaining.toFixed(2)),
      variance: Number(variance.toFixed(2))
    };
  }

  async getResourceCostAllocationForProject(projectId: number): Promise<ResourceCostAllocationDto> {
    const project = await this.projectRepository.findOneBy({ project_id: projectId });
    if (!project) throw new Error("Project not found");

    const sprints = await this.sprintRepository.find({ where: { project } });

    const costPerUser = new Map<number, number>();

    for (const sprint of sprints) {
      // TODO: CHANGE TO SPRINT
      const sprintTasks = await this.taskRepository.find({ where: { sprint_id: sprint.sprint_id } });
      for (const task of sprintTasks) {
        if (!task.worker_id) continue;
        const current = costPerUser.get(task.worker_id) ?? 0;
        costPerUser.set(task.worker_id, current + (task.estimated_cost ?? 0));
      }
    }

    const resources: ResourceCostAllocationItemDto[] = [];
    costPerUser.forEach((total_cost, user_id) => {
      resources.push({
        user_id,
        total_cost: Number(total_cost.toFixed(2))
      });
    });

    return {
      project_id: project.project_id,
      resources
    };
  }

  async getProfitMarginForProject(projectId: number): Promise<ProfitMarginDto> {
    const project = await this.projectRepository.findOneBy({ project_id: projectId });
    if (!project) throw new Error("Project not found");

    const sprints = await this.sprintRepository.find({ where: { project } });

    let totalCost = 0;

    for (const sprint of sprints) {
      // TODO: CHANGE TO SPRINT
      const sprintTasks = await this.taskRepository.find({ where: { sprint_id: sprint.sprint_id } });
      totalCost += sprintTasks.reduce((sum, t) => sum + (t.estimated_cost ?? 0), 0);
    }

    const profit = project.allowed_budget - totalCost;
    const profitMargin = project.allowed_budget > 0 ? (profit / project.allowed_budget) * 100 : 0;

    return {
      project_id: project.project_id,
      allowed_budget: Number(project.allowed_budget.toFixed(2)),
      total_cost: Number(totalCost.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      profit_margin_percentage: Number(profitMargin.toFixed(2))
    };
  }
}
