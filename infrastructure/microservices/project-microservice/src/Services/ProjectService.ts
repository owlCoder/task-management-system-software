import { Repository } from "typeorm";
import { ProjectCreateDTO } from "../Domain/DTOs/ProjectCreateDTO";
import { ProjectDTO } from "../Domain/DTOs/ProjectDTO";
import { ProjectUpdateDTO } from "../Domain/DTOs/ProjectUpdateDTO";
import { IProjectService } from "../Domain/services/IProjectService";
import { Project } from "../Domain/models/Project";
import { ProjectMapper } from "../Utils/Mappers/ProjectMapper";
import { IR2StorageService } from "../Storage/R2StorageService";

export class ProjectService implements IProjectService {
    constructor(
        private readonly projectRepository: Repository<Project>,
        private readonly storageService: IR2StorageService
    ) {}

    async CreateProject(data: ProjectCreateDTO): Promise<ProjectDTO> {
        const project = this.projectRepository.create({
            project_name: data.project_name,
            project_description: data.project_description,
            image_key: data.image_key || "",
            image_url: data.image_url || "",
            total_weekly_hours_required: data.total_weekly_hours_required,
            allowed_budget: data.allowed_budget,
        });

        const saved = await this.projectRepository.save(project);
        return ProjectMapper.toDTO(saved);
    }

    async getProjects(): Promise<ProjectDTO[]> {
        const projects = await this.projectRepository.find();
        return projects.map((p) => ProjectMapper.toDTO(p));
    }

    async getProjectsByUserId(user_id: number): Promise<ProjectDTO[]> {
        const projects = await this.projectRepository
            .createQueryBuilder("project")
            .innerJoin("project.project_users", "pu")
            .where("pu.user_id = :user_id", { user_id })
            .getMany();
        return projects.map((p) => ProjectMapper.toDTO(p));
    }

    async getProjectById(project_id: number): Promise<ProjectDTO> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        if (!project) {
            throw new Error(`Project with id ${project_id} not found`);
        }
        return ProjectMapper.toDTO(project);
    }

    async updateProject(project_id: number, data: ProjectUpdateDTO): Promise<ProjectDTO> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        if (!project) {
            throw new Error(`Project with id ${project_id} not found`);
        }

        // Ako se menja slika, obriši staru sa R2
        if (data.image_key !== undefined && project.image_key) {
            await this.storageService.deleteImage(project.image_key);
        }

        // Ažuriraj polja
        if (data.project_name !== undefined) project.project_name = data.project_name;
        if (data.project_description !== undefined) project.project_description = data.project_description;
        if (data.image_key !== undefined) project.image_key = data.image_key;
        if (data.image_url !== undefined) project.image_url = data.image_url;
        if (data.total_weekly_hours_required !== undefined) {
            project.total_weekly_hours_required = data.total_weekly_hours_required;
        }
        if (data.allowed_budget !== undefined) project.allowed_budget = data.allowed_budget;

        const saved = await this.projectRepository.save(project);
        return ProjectMapper.toDTO(saved);
    }

    async deleteProject(project_id: number): Promise<boolean> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        
        if (project && project.image_key) {
            // Obriši sliku sa R2 pre brisanja projekta
            await this.storageService.deleteImage(project.image_key);
        }

        const result = await this.projectRepository.delete(project_id);
        return !!result.affected && result.affected > 0;
    }

    async projectExists(project_id: number): Promise<boolean> {
        const count = await this.projectRepository.count({ where: { project_id } });
        return count > 0;
    }
}