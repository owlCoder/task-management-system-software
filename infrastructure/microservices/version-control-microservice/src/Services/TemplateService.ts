import { In, Not, Repository } from "typeorm";
import { ITemplateService } from "../Domain/services/ITemplateService";
import { TaskTemplate } from "../Domain/models/TaskTemplate";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";
import { CreateTemplateDTO } from "../Domain/DTOs/CreateTemplateDTO";
import { TaskTemplateDTO } from "../Domain/DTOs/TaskTemplateDTO";
import { toTemplateDTO } from "../Helpers/Converter/toTemplateDTO";
import { TemplateDependency } from "../Domain/models/TemplateDependency";
import { TaskResponseDTO } from "../Domain/DTOs/TaskResponseDTO";
import { CreateTaskFromTemplateDTO } from "../Domain/DTOs/TaskCreateDTO";
import { TaskServiceClient } from "./external-services/TaskServiceClient";
import { UserServiceClient } from "./external-services/UserServiceClient";
import { INotifyService } from "../Domain/services/INotifyService";
import { NotificationType } from "../Domain/enums/NotificationType";


export class TemplateService implements ITemplateService{
    constructor(
        private readonly templateRepository: Repository<TaskTemplate>,
        private readonly dependenciesRepository: Repository<TemplateDependency>,
        private readonly taskService: TaskServiceClient,
        private readonly userService: UserServiceClient,
        private readonly notifyService: INotifyService
    ) {

    }

    async getTemplateById(template_id: number): Promise<Result<TaskTemplateDTO>> {
        const template = await this.templateRepository.findOne({
            where: {template_id},
            relations: ["dependencies", "dependencies.dependsOn"],
        });

        if(!template) {
            return {success: false, code: ErrorCode.NOT_FOUND,error: `Template with ${template_id} not found`};
        }

        return { success: true, data: toTemplateDTO(template)};
    }

    async getAllTemplates(): Promise<Result<TaskTemplateDTO[]>> {
        const templates = await this.templateRepository.find({
            relations: ["dependencies", "dependencies.dependsOn"],
        });

        return { success: true, data: templates.map((t) => toTemplateDTO(t))};
    }

    async createTemplate(data: CreateTemplateDTO, pm_id: number): Promise<Result<TaskTemplateDTO>> {
        const pmResult = await this.userService.getUserById(pm_id);
        const normalizeRole = (role?: string | null) =>
            role ? role.trim().toUpperCase().replace(/[\s_-]+/g, "") : "";


        if (!pmResult.success) {
            return { success: false, code: ErrorCode.NOT_FOUND, error: "User from header not found" };
        }

        const pmRole = normalizeRole(pmResult.data.role_name);

        if (pmRole !== 'PROJECTMANAGER') {
            return { success: false, code: ErrorCode.FORBIDDEN, error: "Only PMs can create templates" };
        }

        if(!data.template_title || data.template_title.trim().length === 0) {
            return { success: false, code: ErrorCode.INVALID_INPUT, error: "Template title is required"};
        }

        if(!data.template_description || data.template_description.trim().length === 0) {
            return { success: false, code: ErrorCode.INVALID_INPUT, error: "Template description is required"};
        }
        
        if ((data.estimated_cost ?? 0) < 0) {
            return { success: false, code: ErrorCode.INVALID_INPUT, error: "Estimated cost cannot be negative" };
        }

        if(!data.attachment_type || data.attachment_type.trim().length === 0) {
            return { success: false, code: ErrorCode.INVALID_INPUT, error: "Attachment type is required" };
        }
        
        const newTemplate = this.templateRepository.create({
        template_title: data.template_title,
        template_description: data.template_description,
        estimated_cost: data.estimated_cost,
        attachment_type: data.attachment_type,
        dependencies: [] 
        });

        await this.templateRepository.save(newTemplate);
        
        return { success: true, data: toTemplateDTO(newTemplate)};
    
    }

    async createTaskFromTemplate(template_id: number, sprint_id: number,worker_id: number, pm_id: number): Promise<Result<TaskResponseDTO>> {
        const template = await this.templateRepository.findOne({
            where: { template_id },
            relations: ["dependencies", "dependencies.dependsOn"]
        });

        if (!template) {
            return { success: false, code: ErrorCode.NOT_FOUND, error: "Template not found" };
        }

        const pmResult = await this.userService.getUserById(pm_id);

        if (!pmResult.success) {
            return { success: false, code: ErrorCode.NOT_FOUND, error: "Project Manager not found" };
        }

        if (pmResult.data.role_name !== 'PROJECT_MANAGER') {
            return { success: false, code: ErrorCode.FORBIDDEN, error: "Only Project Managers can perform this action" };
        }

        const workerResult = await this.userService.verifyUserExists(worker_id);

        if(!workerResult) {
            return { success: false, code: ErrorCode.NOT_FOUND, error: "User not found"};
        }

        const taskDTO: CreateTaskFromTemplateDTO = {
            worker_id, 
            title: template.template_title,
            task_description: template.template_description,
            estimated_cost: template.estimated_cost,
            project_manager_id: pm_id
        };


        const result = await this.taskService.addTaskForSprint(
            Number(sprint_id), 
            taskDTO,
            Number(pm_id)
        );

        if (!result.success) {
            return { success: false, code: ErrorCode.INTERNAL_ERROR, error: result.error };
        }

        const taskResponse: TaskResponseDTO = {
            worker_id: result.data.worker_id,
            title: result.data.title,
            task_description: result.data.task_description,
            estimated_cost: result.data.estimated_cost,
            project_manager_id: result.data.project_manager_id
        };

        if (worker_id && worker_id > 0) {
            this.notifyService.sendNotification(
                [worker_id],
                "New task assigned",
                `A new task "${taskResponse.title}" has been assigned to you.`,
                NotificationType.INFO
            );
        }

        return { success: true, data: taskResponse };

    }

    async addDependency(template_id: number, depends_on_id: number, pm_id: number): Promise<Result<void>> {

        const pmResult = await this.userService.getUserById(pm_id);

        if (!pmResult.success) {
            return { success: false, code: ErrorCode.NOT_FOUND, error: "User from header not found" };
        }

        if (pmResult.data.role_name !== 'PROJECT_MANAGER') {
            return { success: false, code: ErrorCode.FORBIDDEN, error: "Only PMs can create templates" };
        }
    
        const template = await this.templateRepository.findOne({ where: { template_id } });
        if (!template) {
            return { success: false, code: ErrorCode.NOT_FOUND, error: "Template not found" };
        }

        const dependsOn = await this.templateRepository.findOne({ where: { template_id: depends_on_id } });
        if (!dependsOn) {
            return { success: false, code: ErrorCode.NOT_FOUND, error: "Dependent template not found" };
        }

        const existing = await this.dependenciesRepository.findOne({
            where: { template: { template_id }, dependsOn: { template_id: depends_on_id } }
        });
        
        if (existing) {
            return { success: false,code: ErrorCode.CONFLICT, error: "Dependency already exists" };
        }

        const dependency = this.dependenciesRepository.create({
            template,dependsOn
        });

        await this.dependenciesRepository.save(dependency);

       return { success: true, data: undefined };
    }

    

}


