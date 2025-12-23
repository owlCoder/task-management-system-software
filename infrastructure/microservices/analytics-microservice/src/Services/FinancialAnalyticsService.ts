import { Repository } from "typeorm";
import { IFinancialAnalyticsService } from "../Domain/services/IFinancialAnalyticsService";
import { Project } from "../../../project-microservice/src/Domain/models/Project";
import { Task } from "../../../task-microservice/src/Domain/models/Task";
import { BudgetTrackingDto } from "../Domain/DTOs/BudgetTrackingDto";

export class FinancialAnalyticsService implements IFinancialAnalyticsService {

    constructor(
        private readonly projectRepository: Repository<Project>,
        private readonly taskRepository: Repository<Task>
    ) { }

    async getBudgetTrackingForProject(projectId: number): Promise<BudgetTrackingDto> {

        const project = await this.projectRepository.findOneBy({ project_id: projectId });

        if (!project) {
            throw new Error("Project not found");
        }

        const tasks = await this.taskRepository.find({
            where: { project_id: projectId }
        });

        let totalSpent = 0;

        for (let i = 0; i < tasks.length; ++i) {
            totalSpent += tasks[i].estimated_cost;
        }

        const allowedBudget = project.allowed_budget;
        const remainingBudget = allowedBudget - totalSpent;
        const variance = remainingBudget;

        return {
            project_id: project.project_id,
            allowed_budget: allowedBudget,
            total_spent: parseFloat(totalSpent.toFixed(2)),
            remaining_budget: parseFloat(remainingBudget.toFixed(2)),
            variance: parseFloat(variance.toFixed(2))
        };
    }
}
