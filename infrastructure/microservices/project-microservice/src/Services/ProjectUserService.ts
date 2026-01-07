import { Repository } from "typeorm";
import { ProjectUserAssignDTO } from "../Domain/DTOs/ProjectUserAssignDTO";
import { ProjectUserDTO } from "../Domain/DTOs/ProjectUserDTO";
import { IProjectUserService } from "../Domain/services/IProjectUserService";
import { Project } from "../Domain/models/Project";
import { ProjectUser } from "../Domain/models/ProjectUser";
import { ProjectUserMapper } from "../Utils/Mappers/ProjectUserMapper";

export class ProjectUserService implements IProjectUserService{
    constructor(
        private readonly projectUserRepository: Repository<ProjectUser>,
        private readonly projectRepository: Repository<Project>
    ) {}

    async assignUserToProject(data: ProjectUserAssignDTO): Promise<ProjectUserDTO> {
        const project = await this.projectRepository.findOne({
            where: { project_id: data.project_id }
        });
        if (!project) {
            throw new Error(`Project with id ${data.project_id} not found`);
        }

        const existing = await this.projectUserRepository.findOne({
            where: { project: { project_id: data.project_id }, user_id: data.user_id },
            relations: ["project"],
        });
        if (existing) {
            throw new Error("User is already assigned to this project");
        }

        const assignments = await this.projectUserRepository.find({
            where: {user_id: data.user_id},
        });

        const currentTotal = assignments.reduce(
            (sum, a) => sum + a.weekly_hours,
            0
        );

        const newTotal = currentTotal + data.weekly_hours;

        if(newTotal > 40) {
            throw new Error(`User total weekly hours (${newTotal}) exceed allowed 40 hours`);
        }

        const pu = this.projectUserRepository.create({
            project: project,
            user_id: data.user_id,
            weekly_hours: data.weekly_hours,
        });

        const saved = await this.projectUserRepository.save(pu);
        return ProjectUserMapper.toDTO(saved);
    }

    async removeUserFromProject(project_id: number, user_id: number): Promise<boolean> {
        const result = await this.projectUserRepository.delete({
            user_id,
            project: { project_id },
        } as any);
        return !!result.affected && result.affected > 0;
    }

    async getUsersForProject(project_id: number): Promise<ProjectUserDTO[]> {
        const list = await this.projectUserRepository.find({
            where: { project: { project_id } },
            relations: ["project"],
        });
        return list.map(pu => ProjectUserMapper.toDTO(pu));
    }
}