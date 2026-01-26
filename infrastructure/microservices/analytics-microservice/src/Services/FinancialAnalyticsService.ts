import { IFinancialAnalyticsService } from "../Domain/services/IFinancialAnalyticsService";
import { BudgetTrackingDto } from "../Domain/DTOs/BudgetTrackingDto";
import { ResourceCostAllocationDto } from "../Domain/DTOs/ResourceCostAllocationDto";
import { ResourceCostAllocationItemDto } from "../Domain/DTOs/ResourceCostAllocationItemDto";
import { ProfitMarginDto } from "../Domain/DTOs/ProfitMarginDto";
import { ProjectServiceClient } from "./external-services/ProjectServiceClient";
import { TaskServiceClient } from "./external-services/TaskServiceClient";

export class FinancialAnalyticsService implements IFinancialAnalyticsService {
  constructor(
    private readonly projectServiceClient: ProjectServiceClient,
    private readonly taskServiceClient: TaskServiceClient
  ) {}

  async getBudgetTrackingForProject(projectId: number): Promise<BudgetTrackingDto> {
    try {
      const project = await this.projectServiceClient.getProjectById(projectId);

      if (!project) {
        return {
          project_id: projectId,
          allowed_budget: 0,
          total_spent: 0,
          remaining_budget: 0,
          variance: 0
        };
      }

      const sprints = await this.projectServiceClient.getSprintsByProject(project.project_id);
      const sprintIds = sprints.map((s) => s.sprint_id);
      const tasks = await this.taskServiceClient.getTasksBySprintIds(sprintIds);

      const totalSpent = tasks.reduce((sum, t) => sum + (t.estimated_cost ?? 0), 0);

      const remaining = project.allowed_budget - totalSpent;
      const variance = totalSpent - project.allowed_budget;

      return {
        project_id: project.project_id,
        allowed_budget: Number(project.allowed_budget.toFixed(2)),
        total_spent: Number(totalSpent.toFixed(2)),
        remaining_budget: Number(remaining.toFixed(2)),
        variance: Number(variance.toFixed(2))
      };
    } catch {
      return {
        project_id: projectId,
        allowed_budget: 0,
        total_spent: 0,
        remaining_budget: 0,
        variance: 0
      };
    }
  }

  async getResourceCostAllocationForProject(projectId: number): Promise<ResourceCostAllocationDto> {
    try {
      const project = await this.projectServiceClient.getProjectById(projectId);

      if (!project) {
        return {
          project_id: projectId,
          resources: []
        };
      }

      // 1) Total project cost = sum(estimated_cost) over all tasks in all sprints
      const sprints = await this.projectServiceClient.getSprintsByProject(project.project_id);
      const sprintIds = sprints.map((s) => s.sprint_id);
      const tasks = await this.taskServiceClient.getTasksBySprintIds(sprintIds);
      const totalProjectCost = tasks.reduce((sum, t) => sum + (t.estimated_cost ?? 0), 0);

      // 2) Load project members from projects_db.project_users
      const projectMembers = await this.projectServiceClient.getUsersForProject(project.project_id);


      if (projectMembers.length === 0) {
        return {
          project_id: project.project_id,
          resources: []
        };
      }

      // 3) Allocate total cost by weekly_hours weight (fallback: equal split)
      const totalWeeklyHours = projectMembers.reduce(
        (sum, pu) => sum + (pu.weekly_hours ?? 0),
        0
      );

      const resources: ResourceCostAllocationItemDto[] = projectMembers.map((pu) => {
        const weight =
          totalWeeklyHours > 0
            ? (pu.weekly_hours ?? 0) / totalWeeklyHours
            : 1 / projectMembers.length;

        const allocated = totalProjectCost * weight;

        return {
          user_id: pu.user_id,
          total_cost: Number(allocated.toFixed(2))
        };
      });

      return {
        project_id: project.project_id,
        resources
      };
    } catch (err) {
      console.error("getResourceCostAllocationForProject error:", err);
      return { project_id: projectId, resources: [] };
    }

  }

  async getProfitMarginForProject(projectId: number): Promise<ProfitMarginDto> {
    try {
      const project = await this.projectServiceClient.getProjectById(projectId);

      if (!project) {
        return {
          project_id: projectId,
          allowed_budget: 0,
          total_cost: 0,
          profit: 0,
          profit_margin_percentage: 0
        };
      }

      const sprints = await this.projectServiceClient.getSprintsByProject(project.project_id);
      const sprintIds = sprints.map((s) => s.sprint_id);
      const tasks = await this.taskServiceClient.getTasksBySprintIds(sprintIds);

      const totalCost = tasks.reduce((sum, t) => sum + (t.estimated_cost ?? 0), 0);

      const profit = project.allowed_budget - totalCost;
      const profitMargin =
        project.allowed_budget > 0 ? (profit / project.allowed_budget) * 100 : 0;

      return {
        project_id: project.project_id,
        allowed_budget: Number(project.allowed_budget.toFixed(2)),
        total_cost: Number(totalCost.toFixed(2)),
        profit: Number(profit.toFixed(2)),
        profit_margin_percentage: Number(profitMargin.toFixed(2))
      };
    } catch (err) {
        console.error("getProfitMarginForProject error:", err);
        return {
            project_id: projectId,
            allowed_budget: 0,
            total_cost: 0,
            profit: 0,
            profit_margin_percentage: 0
        };
    }

  }
}
