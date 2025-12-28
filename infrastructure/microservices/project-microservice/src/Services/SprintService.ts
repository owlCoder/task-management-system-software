import { Repository } from "typeorm";
import { SprintCreateDTO } from "../Domain/DTOs/SprintCreateDTO";
import { SprintDTO } from "../Domain/DTOs/SprintDTO";
import { SprintUpdateDTO } from "../Domain/DTOs/SprintUpdateDTO";
import { Project } from "../Domain/models/Project";
import { Sprint } from "../Domain/models/Sprint";
import { ISprintService } from "../Domain/services/ISprintService";


export class SprintService implements ISprintService {

    constructor(
    private readonly sprintRepository: Repository<Sprint>,
    private readonly projectRepository: Repository<Project>
  ) {}
  
    async createSprint(data: SprintCreateDTO): Promise<SprintDTO> {
        const project = await this.projectRepository.findOne({
            where: { project_id: data.project_id },
        });
        if(!project) {
            throw new Error(`Project with id ${data.project_id} not found`);
        }

        const sprint = this.sprintRepository.create({
            project,
            sprint_title: data.sprint_title,
            sprint_description: data.sprint_description,
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date),
        });

        const saved = await this.sprintRepository.save(sprint);
        return this.toDTO(saved);
    }
    async getSprintsByProject(project_id: number): Promise<SprintDTO[]> {
        const sprints = await this.sprintRepository.find({
            where: { project: { project_id } },
            relations: ["project"],
        });
        return sprints.map((s) => this.toDTO(s));
    }

    async getSprintById(sprint_id: number): Promise<SprintDTO> {
        const sprint = await this.sprintRepository.findOne({
            where: { sprint_id },
            relations: ["project"],
        });
        if(!sprint) {
            throw new Error(`Sprint with id ${sprint_id} not found`);
        }
        return this.toDTO(sprint);
    }

    async updateSprint(sprint_id: number, data: SprintUpdateDTO): Promise<SprintDTO> {
        const sprint = await this.sprintRepository.findOne({
            where: { sprint_id },
        });
        if(!sprint) {
            throw new Error(`Sprint with id ${sprint_id} not found`);
        }

        if (data.start_date) sprint.start_date = new Date(data.start_date);
        if (data.end_date) sprint.end_date = new Date(data.end_date);
        if (data.sprint_title !== undefined) sprint.sprint_title = data.sprint_title;
        if (data.sprint_description !== undefined) sprint.sprint_description = data.sprint_description;

        const saved = await this.sprintRepository.save(sprint);
        return this.toDTO(saved);
    }

    async deleteSprint(sprint_id: number): Promise<boolean> {
        const result = await this.sprintRepository.delete(sprint_id);
        return !!result.affected && result.affected > 0;
    }

    private toDTO(s: Sprint): SprintDTO {
        return {
            sprint_id: s.sprint_id,
            project_id: (s.project as any).project_id,
            sprint_title: s.sprint_title,
            sprint_description: s.sprint_description,
            start_date: s.start_date,
            end_date: s.end_date,
        };
    }
}