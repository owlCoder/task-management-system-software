import { Router, Request, Response } from "express";
import { Repository } from "typeorm";
import { Project } from "../../Domain/models/Project";
import { ProjectUser } from "../../Domain/models/ProjectUser";
import { ILogerService } from "../../Domain/services/ILogerService";
import { Db } from "../../Database/DbConnectionPool";

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
    this.router.get("/projects", this.getAllProjects.bind(this));
    this.router.get("/projects/:id", this.getProjectById.bind(this));
    this.router.post("/projects", this.createProject.bind(this));
    this.router.put("/projects/:id", this.updateProject.bind(this));
    this.router.delete("/projects/:id", this.deleteProject.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectRepo.find({
        relations: ["project_users", "sprints"],
      });
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const project = await this.projectRepo.findOne({
        where: { project_id: Number(req.params.id) },
        relations: ["project_users", "sprints"],
      });

      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project", error);
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

      res.status(201).json(saved);
    } catch (error) {
      console.error("Error creating project", error);
      res.status(500).json({ error: "Error creating project" });
    }
  }

  private async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const body = req.body;

      const existing = await this.projectRepo.findOne({
        where: { project_id: id },
      });

      if (!existing) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      Object.assign(existing, body);

      const updated = await this.projectRepo.save(existing);
      this.logger.log(`Project updated: ${updated.project_name}`);

      res.json(updated);
    } catch (error) {
      console.error("Error updating project", error);
      res.status(500).json({ error: "Error updating project" });
    }
  }

  private async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await this.projectRepo.delete({ project_id: id });

      if (result.affected === 0) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      this.logger.log(`Project deleted: ${id}`);
      res.json({ deleted: true });
    } catch (error) {
      console.error("Error deleting project", error);
      res.status(500).json({ error: "Error deleting project" });
    }
  }
}