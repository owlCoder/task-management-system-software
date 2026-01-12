import { Repository } from "typeorm";
import { ProjectCreateDTO } from "../Domain/DTOs/ProjectCreateDTO";
import { ProjectDTO } from "../Domain/DTOs/ProjectDTO";
import { ProjectUpdateDTO } from "../Domain/DTOs/ProjectUpdateDTO";
import { IProjectService } from "../Domain/services/IProjectService";
import { Project } from "../Domain/models/Project";
import { ProjectMapper } from "../Utils/Mappers/ProjectMapper";
import { IR2StorageService } from "../Storage/R2StorageService";
import { ProjectStatus } from "../Domain/enums/ProjectStatus";
import { IProjectUserService } from "../Domain/services/IProjectUserService";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";

export class ProjectService implements IProjectService {
    constructor(
        private readonly projectRepository: Repository<Project>,
        private readonly storageService: IR2StorageService,
        private readonly projectUserService: IProjectUserService
    ) {}

    async CreateProject(data: ProjectCreateDTO): Promise<Result<ProjectDTO>> {
        const project = this.projectRepository.create({
            project_name: data.project_name,
            project_description: data.project_description,
            image_key: data.image_key || "",
            image_url: data.image_url || "",
            total_weekly_hours_required: data.total_weekly_hours_required,
            allowed_budget: data.allowed_budget,
            start_date: data.start_date ? new Date(data.start_date) : null,
            sprint_count: data.sprint_count,
            sprint_duration: data.sprint_duration,
            status: data.status || ProjectStatus.NOT_STARTED,
        });

        const saved = await this.projectRepository.save(project);
        return { success: true, data: ProjectMapper.toDTO(saved) };
    }

    async getProjects(): Promise<Result<ProjectDTO[]>> {
        const projects = await this.projectRepository.find();
        return { success: true, data: projects.map((p) => ProjectMapper.toDTO(p)) };
    }

    async getProjectsByUserId(user_id: number): Promise<Result<ProjectDTO[]>> {
        const projects = await this.projectRepository
            .createQueryBuilder("project")
            .innerJoin("project.project_users", "pu")
            .where("pu.user_id = :user_id", { user_id })
            .getMany();
        return { success: true, data: projects.map((p) => ProjectMapper.toDTO(p)) };
    }

    async getProjectById(project_id: number): Promise<Result<ProjectDTO>> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        if (!project) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Project with id ${project_id} not found`,
            };
        }
        return { success: true, data: ProjectMapper.toDTO(project) };
    }

    async updateProject(project_id: number, data: ProjectUpdateDTO): Promise<Result<ProjectDTO>> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        if (!project) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Project with id ${project_id} not found`,
            };
        }

        if (data.image_key !== undefined && project.image_key) {
            await this.storageService.deleteImage(project.image_key);
        }

        const oldWeeklyHours = project.total_weekly_hours_required;

        if (data.project_name !== undefined) project.project_name = data.project_name;
        if (data.project_description !== undefined) project.project_description = data.project_description;
        if (data.image_key !== undefined) project.image_key = data.image_key;
        if (data.image_url !== undefined) project.image_url = data.image_url;
        if (data.total_weekly_hours_required !== undefined) {
            project.total_weekly_hours_required = data.total_weekly_hours_required;
        }
        if (data.allowed_budget !== undefined) project.allowed_budget = data.allowed_budget;
        if (data.start_date !== undefined) {
            project.start_date = data.start_date ? new Date(data.start_date) : null;
        }
        if (data.sprint_count !== undefined) project.sprint_count = data.sprint_count;
        if (data.sprint_duration !== undefined) project.sprint_duration = data.sprint_duration;
        if (data.status !== undefined) project.status = data.status;

        const saved = await this.projectRepository.save(project);
        if (data.total_weekly_hours_required !== undefined && 
            oldWeeklyHours !== data.total_weekly_hours_required) {
            await this.projectUserService.updateWeeklyHoursForAllUsers(
                project_id,
                oldWeeklyHours,
                data.total_weekly_hours_required
            );
        }
        return { success: true, data: ProjectMapper.toDTO(saved) };
    }

    async deleteProject(project_id: number): Promise<Result<boolean>> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        
        if (project && project.image_key) {
            await this.storageService.deleteImage(project.image_key);
        }

        const result = await this.projectRepository.delete(project_id);
        if (!result.affected || result.affected === 0) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Project with id ${project_id} not found`,
            };
        }
        return { success: true, data: true };
    }

    async projectExists(project_id: number): Promise<Result<boolean>> {
        const count = await this.projectRepository.count({ where: { project_id } });
        return { success: true, data: count > 0 };
    }
}