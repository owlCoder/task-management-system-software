import { Repository } from "typeorm";
import { IFinancialAnalyticsService } from "../Domain/services/IFinancialAnalyticsService";
import { Project } from "../../../project-microservice/src/Domain/models/Project";
import { Task } from "../../../task-microservice/src/Domain/models/Task";
import { BudgetTrackingDto } from "../Domain/DTOs/BudgetTrackingDto";
import { ResourceCostAllocationDto } from "../Domain/DTOs/ResourceCostAllocationDto";
import { ResourceCostAllocationItemDto } from "../Domain/DTOs/ResourceCostAllocationItemDto";

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

        const tasks = await this.taskRepository.find({ where: { project_id: projectId } });

        let totalSpent = 0;
        for (let i = 0; i < tasks.length; ++i) {
            totalSpent += tasks[i].estimated_cost;
        }

        const allowedBudget = project.allowed_budget;
        const remainingBudget = allowedBudget - totalSpent;

        return {
            project_id: project.project_id,
            allowed_budget: allowedBudget,
            total_spent: parseFloat(totalSpent.toFixed(2)),
            remaining_budget: parseFloat(remainingBudget.toFixed(2)),
            variance: parseFloat(remainingBudget.toFixed(2))
        };
    }

    async getResourceCostAllocationForProject(projectId: number): Promise<ResourceCostAllocationDto> {

        const project = await this.projectRepository.findOneBy({ project_id: projectId });

        if (!project) {
            throw new Error("Project not found");
        }

        const tasks = await this.taskRepository.find({
            where: { project_id: projectId }
        });

        const costPerUser: Map<number, number> = new Map();

        for (let i = 0; i < tasks.length; ++i) {
            const workerId = tasks[i].worker_id;
            const cost = tasks[i].estimated_cost;

            if (!workerId) continue;

            if (!costPerUser.has(workerId)) {
                costPerUser.set(workerId, 0);
            }

            costPerUser.set(workerId, costPerUser.get(workerId)! + cost);
        }

        let resources: ResourceCostAllocationItemDto[] = [];

        costPerUser.forEach((value, key) => {
            resources.push({
                user_id: key,
                total_cost: parseFloat(value.toFixed(2))
            });
        });

        return {
            project_id: project.project_id,
            resources
        };
    }
}
