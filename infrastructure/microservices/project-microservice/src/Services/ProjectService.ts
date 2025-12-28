import { Repository } from "typeorm";
import { ProjectCreateDTO } from "../Domain/DTOs/ProjectCreateDTO";
import { ProjectDTO } from "../Domain/DTOs/ProjectDTO";
import { ProjectUpdateDTO } from "../Domain/DTOs/ProjectUpdateDTO";
import { IProjectService } from "../Domain/services/IProjectService";
import { Project } from "../Domain/models/Project";

export class ProjectService implements IProjectService {

    constructor(private readonly projectRepository: Repository<Project>) {}

    async CreateProject(data: ProjectCreateDTO): Promise<ProjectDTO> {
        const project = this.projectRepository.create({
            project_name: data.project_name,
            project_description: data.project_description,
            image_file_uuid: data.image_file_uuid,
            total_weekly_hours_required: data.total_weekly_hours_required,
            allowed_budget: data.allowed_budget,
        });

        const saved = await this.projectRepository.save(project);
        return this.toDTO(saved);
    }

    async getProjects(): Promise<ProjectDTO[]> {
        const projects = await this.projectRepository.find();
        return projects.map((p) => this.toDTO(p));
    }
    
    async getProjectById(project_id: number): Promise<ProjectDTO> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        if (!project) {
            throw new Error(`Project with id ${project_id} not found`);
        }
        return this.toDTO(project);
    }
    async updateProject(project_id: number, data: ProjectUpdateDTO): Promise<ProjectDTO> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        if (!project) {
            throw new Error(`Project with id ${project_id} not found`);
        }
        Object.assign(project, data);
        const saved = await this.projectRepository.save(project);
        return this.toDTO(saved);
    }

    async deleteProject(project_id: number): Promise<boolean> {
        const result = await this.projectRepository.delete(project_id);
        return !!result.affected && result.affected > 0;
    }

    private toDTO(project: Project): ProjectDTO {
        return {
            project_id: project.project_id,
            project_name: project.project_name,
            project_description: project.project_description,
            image_file_uuid: project.image_file_uuid,
            total_weekly_hours_required: project.total_weekly_hours_required,
            allowed_budget: project.allowed_budget,
        };
    }
}