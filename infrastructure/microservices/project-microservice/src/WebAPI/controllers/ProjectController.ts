import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";  // npm install uuid && npm install --save-dev @types/uuid
import { IProjectService } from "../../Domain/services/IProjectService";
import { ProjectCreateDTO } from "../../Domain/DTOs/ProjectCreateDTO";
import { ProjectUpdateDTO } from "../../Domain/DTOs/ProjectUpdateDTO";
import { validateCreateProject, validateUpdateProject } from "../validators/ProjectValidator";

// Kreiraj uploads folder ako ne postoji
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer konfiguracija za čuvanje na disku
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

export class ProjectController {
    private readonly router: Router;

    constructor(private readonly projectService: IProjectService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/projects", this.getProjects.bind(this));
        this.router.get("/users/:userId/projects", this.getProjectsByUserId.bind(this));
        this.router.get("/projects/:id", this.getProjectById.bind(this));
        this.router.post("/projects", upload.single('image_file'), this.createProject.bind(this));
        this.router.put("/projects/:id", upload.single('image_file'), this.updateProject.bind(this));
        this.router.delete("/projects/:id", this.deleteProject.bind(this));
        this.router.get("/projects/:id/exists", this.projectExists.bind(this));
        
        // *** NOVI ENDPOINT: Serviranje slika ***
        this.router.get("/uploads/:filename", this.getImage.bind(this));
    }

    // *** NOVA METODA: Vraća sliku po filename-u ***
    private async getImage(req: Request, res: Response): Promise<void> {
        try {
            const filename = req.params.filename;
            
            // Sanitizacija - spreči path traversal napade
            const sanitizedFilename = path.basename(filename);
            const filePath = path.join(uploadsDir, sanitizedFilename);

            // Proveri da li fajl postoji
            if (!fs.existsSync(filePath)) {
                res.status(404).json({ message: "Image not found" });
                return;
            }

            // Odredi content type na osnovu ekstenzije
            const ext = path.extname(sanitizedFilename).toLowerCase();
            const mimeTypes: { [key: string]: string } = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
            };

            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache 1 godina
            
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } catch (err) {
            console.error('Error serving image:', err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await this.projectService.getProjects();
            res.status(200).json(projects);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjectsByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId)) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }

            const projects = await this.projectService.getProjectsByUserId(userId);
            res.status(200).json(projects);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }
            const project = await this.projectService.getProjectById(id);
            res.status(200).json(project);
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async createProject(req: Request, res: Response): Promise<void> {
        try {
            const data: ProjectCreateDTO = {
                project_name: req.body.project_name,
                project_description: req.body.project_description || '',
                image_file_uuid: '',
                total_weekly_hours_required: parseInt(req.body.total_weekly_hours_required, 10),
                allowed_budget: parseFloat(req.body.allowed_budget),
            };

            if (req.file) {
                data.image_file_uuid = req.file.filename;
            }

            const validation = validateCreateProject(data);
            if (!validation.success) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(400).json({ message: validation.message });
                return;
            }

            const created = await this.projectService.CreateProject(data);
            res.status(201).json(created);
        } catch (err) {
            if (req.file) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {
                    console.error('Error deleting uploaded file:', e);
                }
            }
            console.error('Create project error:', err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const data: ProjectUpdateDTO = {};

            if (req.body.project_name !== undefined) {
                data.project_name = req.body.project_name;
            }
            if (req.body.project_description !== undefined) {
                data.project_description = req.body.project_description;
            }
            if (req.body.total_weekly_hours_required !== undefined) {
                data.total_weekly_hours_required = parseInt(req.body.total_weekly_hours_required, 10);
            }
            if (req.body.allowed_budget !== undefined) {
                data.allowed_budget = parseFloat(req.body.allowed_budget);
            }

            if (req.file) {
                try {
                    const oldProject = await this.projectService.getProjectById(id);
                    if (oldProject.image_file_uuid) {
                        const oldFilePath = path.join(uploadsDir, oldProject.image_file_uuid);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                        }
                    }
                } catch (e) {
                    console.error('Error deleting old image:', e);
                }
                data.image_file_uuid = req.file.filename;
            }

            const validation = validateUpdateProject(data);
            if (!validation.success) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(400).json({ message: validation.message });
                return;
            }

            const updated = await this.projectService.updateProject(id, data);
            res.status(200).json(updated);
        } catch (err) {
            if (req.file) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {
                    console.error('Error deleting uploaded file:', e);
                }
            }
            console.error('Update project error:', err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            try {
                const project = await this.projectService.getProjectById(id);
                if (project.image_file_uuid) {
                    const filePath = path.join(uploadsDir, project.image_file_uuid);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            } catch (e) {
                console.error('Error deleting project image:', e);
            }

            const ok = await this.projectService.deleteProject(id);
            if (!ok) {
                res.status(404).json({ message: `Project with id ${id} not found` });
                return;
            }
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async projectExists(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid project ID" });
                return;
            }

            const exists = await this.projectService.projectExists(id);
            res.status(200).json({ exists });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}