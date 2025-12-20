import { Router, Request, Response } from "express";
import { Repository } from "typeorm";
import { Project } from "../../Domain/models/Project";
import { ProjectUser } from "../../Domain/models/ProjectUser";
import { ILogerService } from "../../Domain/services/ILogerService";
import { Db } from "../../Database/DbConnectionPool";
import { ProjectDTO } from "../../Domain/DTOs/ProjectDTO";

export class ProjectsController {
  private readonly router: Router;
  private readonly projectRepo: Repository<Project>;
  private readonly projectUserRepo: Repository<ProjectUser>;

  constructor(private readonly logger: ILogerService) {
    this.router = Router();
    this.projectRepo = Db.getRepository(Project);
    this.projectUserRepo = Db.getRepository(ProjectUser);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/projects/user/:userId", this.getProjectsByUserId.bind(this));
    this.router.get("/projects/:id", this.getProjectById.bind(this));
    this.router.get("/projects/:id/details", this.getProjectDetailsById.bind(this));
    this.router.post("/projects", this.createProject.bind(this));
    this.router.put("/projects/:id", this.updateProject.bind(this));
    this.router.delete("/projects/:id", this.deleteProject.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async getProjectsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);

      const projectUsers = await this.projectUserRepo.find({
        where: { user_id: userId },
        relations: ["project"],
      });

      const projects = projectUsers.map((pu) => this.toProjectDTO(pu.project));
      res.json(projects);
    } catch (error) {
      this.logger.error("Error fetching projects by user ID: " + (error as any).message);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const projectId = parseInt(req.params.id, 10);

      const project = await this.projectRepo.findOne({
        where: { project_id: projectId },
      });

      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      res.json(this.toProjectDTO(project));
    } catch (error) {
      this.logger.error("Error fetching project: " + (error as any).message);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async getProjectDetailsById(req: Request, res: Response): Promise<void> {
    try {
      const projectId = parseInt(req.params.id, 10);
      const project = await this.projectRepo.findOne({
        where: { project_id: projectId },
        relations: ["project_users", "sprints"],
      });

      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      const dto = {
        ...this.toProjectDTO(project),
        users: project.project_users.map((pu) => ({ pu_id: pu.pu_id, user_id: pu.user_id })),
        sprints: project.sprints.map((s) => ({
          sprint_id: s.sprint_id,
          sprint_title: s.sprint_title,
          sprint_description: s.sprint_description,
          start_date: s.start_date,
          end_date: s.end_date,
        })),
      };

      res.json(dto);
    } catch (error) {
      this.logger.error("Error fetching project details: " + (error as any).message);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async createProject(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const newProject = this.projectRepo.create({
        project_name: body.project_name,
        project_description: body.project_description,
        image_file_uuid: body.image_file_uuid,
        total_weekly_hours_required: body.total_weekly_hours_required,
        allowed_budget: body.allowed_budget,
      });

      const saved = await this.projectRepo.save(newProject);
      this.logger.log(`Project created: ${saved.project_name}`);

      res.status(201).json(this.toProjectDTO(saved));
    } catch (error) {
      this.logger.error("Error creating project: " + (error as any).message);
      res.status(500).json({ error: "Error creating project" });
    }
  }

  private async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const body = req.body;

      const existing = await this.projectRepo.findOne({ where: { project_id: id } });
      if (!existing) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      Object.assign(existing, body);
      const updated = await this.projectRepo.save(existing);
      this.logger.log(`Project updated: ${updated.project_name}`);

      res.json(this.toProjectDTO(updated));
    } catch (error) {
      this.logger.error("Error updating project: " + (error as any).message);
      res.status(500).json({ error: "Error updating project" });
    }
  }

  private async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await this.projectRepo.delete({ project_id: id });

      if (result.affected === 0) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      this.logger.log(`Project deleted: ${id}`);
      res.json({ deleted: true });
    } catch (error) {
      this.logger.error("Error deleting project: " + (error as any).message);
      res.status(500).json({ error: "Error deleting project" });
    }
  }

  private toProjectDTO(project: Project): ProjectDTO {
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