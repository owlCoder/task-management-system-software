import { Repository } from "typeorm";
import { SprintCreateDTO } from "../Domain/DTOs/SprintCreateDTO";
import { SprintDTO } from "../Domain/DTOs/SprintDTO";
import { SprintUpdateDTO } from "../Domain/DTOs/SprintUpdateDTO";
import { Project } from "../Domain/models/Project";
import { Sprint } from "../Domain/models/Sprint";
import { ISprintService } from "../Domain/services/ISprintService";
import { SprintMapper } from "../Utils/Mappers/SprintMapper";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";


export class SprintService implements ISprintService {

    constructor(
    private readonly sprintRepository: Repository<Sprint>,
    private readonly projectRepository: Repository<Project>
  ) {}
  
    async createSprint(data: SprintCreateDTO): Promise<Result<SprintDTO>> {
        const project = await this.projectRepository.findOne({
            where: { project_id: data.project_id },
        });
        if(!project) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Project with id ${data.project_id} not found`,
            };
        }

        const sprint = this.sprintRepository.create({
            project,
            sprint_title: data.sprint_title,
            sprint_description: data.sprint_description,
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date),
            story_points: data.story_points,
        });

        const saved = await this.sprintRepository.save(sprint);
        return { success: true, data: SprintMapper.toDTO(saved) };
    }

    async getSprintsByProject(project_id: number): Promise<Result<SprintDTO[]>> {
        const sprints = await this.sprintRepository.find({
            where: { project: { project_id } },
            relations: ["project"],
        });
        return { success: true, data: sprints.map((s) => SprintMapper.toDTO(s)) };
    }

    async getSprintById(sprint_id: number): Promise<Result<SprintDTO>> {
        const sprint = await this.sprintRepository.findOne({
            where: { sprint_id },
            relations: ["project"],
        });

        if(!sprint) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Sprint with id ${sprint_id} not found`,
            };
        }

        return { success: true, data: SprintMapper.toDTO(sprint) };
    }

    async updateSprint(sprint_id: number, data: SprintUpdateDTO): Promise<Result<SprintDTO>> {
        const sprint = await this.sprintRepository.findOne({
            where: { sprint_id },
            relations: ["project"], 
        });
        if(!sprint) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Sprint with id ${sprint_id} not found`,
            };
        }

        if (data.start_date) sprint.start_date = new Date(data.start_date);
        if (data.end_date) sprint.end_date = new Date(data.end_date);
        if (data.sprint_title !== undefined) sprint.sprint_title = data.sprint_title;
        if (data.sprint_description !== undefined) sprint.sprint_description = data.sprint_description;
        if (data.story_points !== undefined) sprint.story_points = data.story_points;

        const saved = await this.sprintRepository.save(sprint);
        return { success: true, data: SprintMapper.toDTO(saved) };
    }

    async deleteSprint(sprint_id: number): Promise<Result<boolean>> {
        const result = await this.sprintRepository.delete(sprint_id);
        if (!result.affected || result.affected === 0) {
            return {
                success: false,
                code: ErrorCode.NOT_FOUND,
                error: `Sprint with id ${sprint_id} not found`,
            };
        }
        return { success: true, data: true };
    }
}