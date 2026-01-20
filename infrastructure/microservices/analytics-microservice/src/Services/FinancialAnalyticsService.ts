import { Repository } from "typeorm";
import { IFinancialAnalyticsService } from "../Domain/services/IFinancialAnalyticsService";
import { Project } from "../Domain/models/Project";
import { Task } from "../Domain/models/Task";
import { Sprint } from "../Domain/models/Sprint";
import { ProjectUser } from "../Domain/models/ProjectUser";
import { BudgetTrackingDto } from "../Domain/DTOs/BudgetTrackingDto";
import { ResourceCostAllocationDto } from "../Domain/DTOs/ResourceCostAllocationDto";
import { ResourceCostAllocationItemDto } from "../Domain/DTOs/ResourceCostAllocationItemDto";
import { ProfitMarginDto } from "../Domain/DTOs/ProfitMarginDto";

export class FinancialAnalyticsService implements IFinancialAnalyticsService {
  constructor(
    private readonly projectRepository: Repository<Project>,
    private readonly sprintRepository: Repository<Sprint>,
    private readonly taskRepository: Repository<Task>,
    private readonly projectUserRepository: Repository<ProjectUser>
  ) {}

  async getBudgetTrackingForProject(projectId: number): Promise<BudgetTrackingDto> {
    try {
      const project = await this.projectRepository.findOneBy({ project_id: projectId });

      if (!project) {
        return {
          project_id: projectId,
          allowed_budget: 0,
          total_spent: 0,
          remaining_budget: 0,
          variance: 0
        };
      }

      const sprints = await this.sprintRepository.find({ where: { project_id: project.project_id } });

      let totalSpent = 0;

      for (const sprint of sprints) {
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
      const project = await this.projectRepository.findOneBy({ project_id: projectId });

      if (!project) {
        return {
          project_id: projectId,
          resources: []
        };
      }

      const sprints = await this.sprintRepository.find({
        where: { project_id: project.project_id }
        });


      // 1) Total project cost = sum(estimated_cost) over all tasks in all sprints
      let totalProjectCost = 0;
      for (const sprint of sprints) {
        const sprintTasks = await this.taskRepository.find({
          where: { sprint_id: sprint.sprint_id }
        });

        totalProjectCost += sprintTasks.reduce((sum, t) => sum + (t.estimated_cost ?? 0), 0);
      }

      // 2) Load project members from projects_db.project_users
      const projectMembers = await this.projectUserRepository.find({
        where: { project }
      });

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

      console.log("RCA projectId:", project.project_id);
      console.log("RCA sprints:", sprints.length);
      console.log("RCA totalProjectCost:", totalProjectCost);
      console.log("RCA members:", projectMembers.length);

      return {
        project_id: project.project_id,
        resources
      };
    } catch {
      return {
        project_id: projectId,
        resources: []
      };
    }
  }

  async getProfitMarginForProject(projectId: number): Promise<ProfitMarginDto> {
    try {
      const project = await this.projectRepository.findOneBy({ project_id: projectId });

      if (!project) {
        return {
          project_id: projectId,
          allowed_budget: 0,
          total_cost: 0,
          profit: 0,
          profit_margin_percentage: 0
        };
      }

      const sprints = await this.sprintRepository.find({
        where: { project_id: project.project_id }
        });


      let totalCost = 0;

      for (const sprint of sprints) {
        const sprintTasks = await this.taskRepository.find({
          where: { sprint_id: sprint.sprint_id }
        });

        totalCost += sprintTasks.reduce((sum, t) => sum + (t.estimated_cost ?? 0), 0);
      }

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
