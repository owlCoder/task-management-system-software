import { Repository } from "typeorm";
import path from "path";
import fs from "fs";
import { ProjectCreateDTO } from "../Domain/DTOs/ProjectCreateDTO";
import { ProjectDTO } from "../Domain/DTOs/ProjectDTO";
import { ProjectUpdateDTO } from "../Domain/DTOs/ProjectUpdateDTO";
import { IProjectService } from "../Domain/services/IProjectService";
import { Project } from "../Domain/models/Project";
import { ProjectMapper } from "../Utils/Mappers/ProjectMapper";

const uploadsDir = path.join(__dirname, '../uploads');

export class ProjectService implements IProjectService {

    constructor(private readonly projectRepository: Repository<Project>) {}

    /**
     * Učitava sliku sa diska i vraća kao base64 string sa content type-om
     */
    private loadImageAsBase64(imageFilename: string): { data: string; contentType: string } | null {
        if (!imageFilename) return null;
        
        const filePath = path.join(uploadsDir, imageFilename);
        
        if (!fs.existsSync(filePath)) return null;
        
        try {
            const ext = path.extname(imageFilename).toLowerCase();
            const mimeTypes: { [key: string]: string } = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
            };
            
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            const fileBuffer = fs.readFileSync(filePath);
            const base64 = fileBuffer.toString('base64');
            
            return { data: base64, contentType };
        } catch (error) {
            console.error('Error loading image:', error);
            return null;
        }
    }

    /**
     * Obogaćuje DTO sa podacima o slici
     */
    private enrichWithImage(dto: ProjectDTO, imageFilename: string): ProjectDTO {
        const imageInfo = this.loadImageAsBase64(imageFilename);
        if (imageInfo) {
            dto.image_data = imageInfo.data;
            dto.image_content_type = imageInfo.contentType;
        }
        return dto;
    }

    async CreateProject(data: ProjectCreateDTO): Promise<ProjectDTO> {
        const project = this.projectRepository.create({
            project_name: data.project_name,
            project_description: data.project_description,
            image_file_uuid: data.image_file_uuid,
            total_weekly_hours_required: data.total_weekly_hours_required,
            allowed_budget: data.allowed_budget,
        });

        const saved = await this.projectRepository.save(project);
        const dto = ProjectMapper.toDTO(saved);
        return this.enrichWithImage(dto, saved.image_file_uuid);
    }

    async getProjects(): Promise<ProjectDTO[]> {
        const projects = await this.projectRepository.find();
        return projects.map((p) => {
            const dto = ProjectMapper.toDTO(p);
            return this.enrichWithImage(dto, p.image_file_uuid);
        });
    }

    async getProjectsByUserId(user_id: number): Promise<ProjectDTO[]> {
        const projects = await this.projectRepository
            .createQueryBuilder("project")
            .innerJoin("project.project_users", "pu")
            .where("pu.user_id = :user_id", { user_id })
            .getMany();
        return projects.map((p) => {
            const dto = ProjectMapper.toDTO(p);
            return this.enrichWithImage(dto, p.image_file_uuid);
        });
    }
    
    async getProjectById(project_id: number): Promise<ProjectDTO> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        if (!project) {
            throw new Error(`Project with id ${project_id} not found`);
        }
        const dto = ProjectMapper.toDTO(project);
        return this.enrichWithImage(dto, project.image_file_uuid);
    }

    async updateProject(project_id: number, data: ProjectUpdateDTO): Promise<ProjectDTO> {
        const project = await this.projectRepository.findOne({ where: { project_id } });
        if (!project) {
            throw new Error(`Project with id ${project_id} not found`);
        }
        Object.assign(project, data);
        const saved = await this.projectRepository.save(project);
        const dto = ProjectMapper.toDTO(saved);
        return this.enrichWithImage(dto, saved.image_file_uuid);
    }

    async deleteProject(project_id: number): Promise<boolean> {
        const result = await this.projectRepository.delete(project_id);
        return !!result.affected && result.affected > 0;
    }

    async projectExists(project_id: number): Promise<boolean> {
        const count = await this.projectRepository.count({ where: { project_id } });
        return count > 0;
    }
}