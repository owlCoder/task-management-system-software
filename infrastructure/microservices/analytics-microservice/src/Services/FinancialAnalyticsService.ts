import { Repository } from "typeorm";
import { IFinancialAnalyticsService } from "../Domain/services/IFinancialAnalyticsService";
import { Project } from "../../../project-microservice/src/Domain/models/Project";
import { Task } from "../../../task-microservice/src/Domain/models/Task";
import { Sprint } from "../../../project-microservice/src/Domain/models/Sprint";
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

  // ---------------- BUDGET TRACKING ----------------
  async getBudgetTrackingForProject(projectId: number): Promise<BudgetTrackingDto> {
    const project = await this.projectRepository.findOne({
      where: { project_id: projectId }
    });

    if (!project) throw new Error("Project not found");

    const tasks = await this.taskRepository
      .createQueryBuilder("task")
      .leftJoin("task.sprint", "sprint")
      .leftJoin("sprint.project", "project")
      .where("project.project_id = :projectId", { projectId })
      .getMany();

    const totalSpent = tasks.reduce(
      (sum, t) => sum + (t.estimated_cost ?? 0),
      0
    );

    const remaining = project.allowed_budget - totalSpent;

    return {
      project_id: project.project_id,
      allowed_budget: project.allowed_budget,
      total_spent: Number(totalSpent.toFixed(2)),
      remaining_budget: Number(remaining.toFixed(2)),
      variance: Number(remaining.toFixed(2))
    };
  }

  // ---------------- RESOURCE COST ALLOCATION ----------------
  async getResourceCostAllocationForProject(
    projectId: number
  ): Promise<ResourceCostAllocationDto> {

    const project = await this.projectRepository.findOne({
      where: { project_id: projectId }
    });

    if (!project) throw new Error("Project not found");

    const tasks = await this.taskRepository
      .createQueryBuilder("task")
      .leftJoin("task.sprint", "sprint")
      .leftJoin("sprint.project", "project")
      .where("project.project_id = :projectId", { projectId })
      .getMany();

    const costPerUser = new Map<number, number>();

    for (const task of tasks) {
      if (!task.worker_id) continue;

      const current = costPerUser.get(task.worker_id) ?? 0;
      costPerUser.set(current ? task.worker_id : task.worker_id, current + (task.estimated_cost ?? 0));
    }

    const resources: ResourceCostAllocationItemDto[] = [];

    costPerUser.forEach((value, userId) => {
      resources.push({
        user_id: userId,
        total_cost: Number(value.toFixed(2))
      });
    });

    return {
      project_id: project.project_id,
      resources
    };
  }

  // ---------------- PROFIT MARGIN ----------------
  async getProfitMarginForProject(projectId: number): Promise<ProfitMarginDto> {
    const project = await this.projectRepository.findOne({
      where: { project_id: projectId }
    });

    if (!project) throw new Error("Project not found");

    const tasks = await this.taskRepository
      .createQueryBuilder("task")
      .leftJoin("task.sprint", "sprint")
      .leftJoin("sprint.project", "project")
      .where("project.project_id = :projectId", { projectId })
      .getMany();

    const totalCost = tasks.reduce(
      (sum, t) => sum + (t.estimated_cost ?? 0),
      0
    );

    const profit = project.allowed_budget - totalCost;
    const profitMargin =
      project.allowed_budget > 0
        ? (profit / project.allowed_budget) * 100
        : 0;

    return {
      project_id: project.project_id,
      allowed_budget: Number(project.allowed_budget.toFixed(2)),
      total_cost: Number(totalCost.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      profit_margin_percentage: Number(profitMargin.toFixed(2))
    };
  }
}
