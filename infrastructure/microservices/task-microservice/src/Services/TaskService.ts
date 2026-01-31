import { In, Repository } from "typeorm";
import { ITaskService } from "../Domain/services/ITaskService";
import { Task } from "../Domain/models/Task";
import { TaskStatus } from "../Domain/enums/TaskStatus";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";
import { CreateTaskDTO } from "../Domain/DTOs/CreateTaskDTO";
import { UpdateTaskDTO } from "../Domain/DTOs/UpdateTaskDTO";
import { IProjectServiceClient } from "../Domain/services/external-services/IProjectServiceClient";
import { IUserServiceClient } from "../Domain/services/external-services/IUserServiceClient";
import { UserRole } from "../Domain/enums/UserRole";
import { ITaskVersionService } from "../Domain/services/ITaskVersionService";
import { IFileServiceClient } from "../Domain/services/external-services/IFileServiceClient";
import { INotifyService } from "../Domain/services/INotifyService";
import { NotificationType } from "../Domain/enums/NotificationType";
import { filterTasksForRole } from "../Utils/Filters/FilterTasks";
import { UpdateTaskStatusDTO } from "../Domain/DTOs/UpdateTaskStatusDTO";
import { canAttach } from "../Utils/Attachments/ValidateAttachment";

export class TaskService implements ITaskService {
    constructor(
        private readonly taskRepository: Repository<Task>,
        private readonly projectService: IProjectServiceClient,
        private readonly userService: IUserServiceClient,
        private readonly taskVersionService: ITaskVersionService,
        private readonly fileServiceClient : IFileServiceClient,
        private readonly notifyService: INotifyService
    ) {}

    async getAllTasksForSprint(sprint_id: number, user_id: number) : Promise<Result<Task[]>>{
        const sprintResult = await this.projectService.getSprintById(sprint_id);
        if (!sprintResult.success) {
            return sprintResult;
        }

        const workerResult = await this.userService.getUserById(user_id);
        if (!workerResult.success) {
            return workerResult;
        }

        const projectUsersResult = await this.projectService.getUsersForProject(sprintResult.data.project_id);
        if (!projectUsersResult.success) {
            return projectUsersResult;
        }

        if (!projectUsersResult.data.some((projectUser) => projectUser.user_id === user_id)) {
            return { success: false, errorCode: ErrorCode.USER_NOT_FOUND, message: "User is not assigned to this project" };
        }

        const tasks = await this.taskRepository.find({
            where: { sprint_id },
            relations: ["comments"]
        });
        const filteredTasks = filterTasksForRole(tasks, user_id, workerResult.data.role_name);
        return { success: true, data: filteredTasks }
    }

    async getTasksBySprintIds(sprint_ids: number[]): Promise<Result<Task[]>> {
        const tasks = await this.taskRepository.find({
            where: { sprint_id: In(sprint_ids) }
        });

        return { success: true, data: tasks };
    } 

    async addTaskForSprint(sprint_id: number, createTaskDTO: CreateTaskDTO, user_id: number): Promise<Result<Task>> {
        const sprintResult = await this.projectService.getSprintById(sprint_id);
        if (!sprintResult.success) {
            return sprintResult;
        }

        const projectWorkersResult = await this.projectService.getUsersForProject(sprintResult.data.project_id);
        if (!projectWorkersResult.success) {
            return projectWorkersResult;
        }

        if (!projectWorkersResult.data.some((u) => u.user_id === user_id)) {
            return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "You are not assigned to this project" };
        }

        if (!projectWorkersResult.data.some((projectUser) => projectUser.user_id === createTaskDTO.assignedTo)) {
            return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "User is not assigned to this project" };
        }

        const newTask = this.taskRepository.create({
            sprint_id,
            worker_id: createTaskDTO.assignedTo,
            title: createTaskDTO.title,
            task_description: createTaskDTO.description,
            estimated_cost: createTaskDTO.estimatedCost ?? 0,
            task_status: TaskStatus.CREATED,
            total_hours_spent: 0,
            project_manager_id: user_id,
        });

        const savedTask = await this.taskRepository.save(newTask);
        await this.taskVersionService.createVersionSnapshot(savedTask);
        this.notifyService.sendNotification(
            [createTaskDTO.assignedTo],
            "New task assigned",
            `A new task "${savedTask.title}" has been assigned to you.`,
            NotificationType.INFO
        );
        return { success: true, data: savedTask };
    }

    async getTaskById(task_id: number, user_id: number): Promise<Result<Task>> {
        const task = await this.taskRepository.findOne({
            where: { task_id },
            relations: ["comments"],
        });

        if (!task) {
            return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found" };
        }

        if (user_id === task.worker_id || user_id === task.project_manager_id) {
            return { success: true, data: task };
        }

        const workerResult = await this.userService.getUserById(user_id);
        if (!workerResult.success) {
            return workerResult;
        }

        const sprintResult = await this.projectService.getSprintById(task.sprint_id);
        if (!sprintResult.success) {
            return sprintResult;
        }

        const projectWorkersResult = await this.projectService.getUsersForProject(sprintResult.data.project_id);
        if (!projectWorkersResult.success) {
            return projectWorkersResult;
        }

        if (workerResult.data.role_name === UserRole.ANIMATION_WORKER || workerResult.data.role_name === UserRole.AUDIO_MUSIC_STAGIST) {
            return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "User is not assigned to this task" };
        }

        return { success: true, data: task };
    }
    
    async updateTask(task_id: number, updateTaskDTO: UpdateTaskDTO, user_id: number): Promise<Result<Task>> {
        const task = await this.taskRepository.findOne({
            where: { task_id },
            relations: ["comments"],
        });

        if (!task) {
            return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found" };
        }

        const sprintResult = await this.projectService.getSprintById(task.sprint_id);
        if (!sprintResult.success) {
            return { success: false, errorCode: ErrorCode.SPRINT_NOT_FOUND, message: "Sprint not found" };
        }

        const project_id = sprintResult.data.project_id;
        const projectWorkersResult = await this.projectService.getUsersForProject(project_id);
        if (!projectWorkersResult.success) {
            return projectWorkersResult;
        }

        const requestUser = projectWorkersResult.data.find(u => u.user_id === user_id);

        if (!requestUser || requestUser.role_name !== UserRole.PROJECT_MANAGER) {
            return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "Only project manager assigned to this project can edit task."};
        }

        if (updateTaskDTO.title !== undefined) task.title = updateTaskDTO.title;
        if (updateTaskDTO.description !== undefined) task.task_description = updateTaskDTO.description;
        if (updateTaskDTO.estimatedCost !== undefined) task.estimated_cost = updateTaskDTO.estimatedCost;

        const previousWorkerId = task.worker_id;
        if (updateTaskDTO.assignedTo !== undefined) {
            if (!projectWorkersResult.data.some((projectUser) => projectUser.user_id === updateTaskDTO.assignedTo)) {
                return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "Assignee is not assigned to this project" };
            }
            task.worker_id = updateTaskDTO.assignedTo;
        }

        const updatedTask = await this.taskRepository.save(task);

        await this.taskVersionService.createVersionSnapshot(updatedTask);

        if (updateTaskDTO.assignedTo !== undefined && updateTaskDTO.assignedTo !== previousWorkerId) {
            this.notifyService.sendNotification(
                [updateTaskDTO.assignedTo],
                "Task reassigned",
                `Task "${updatedTask.title}" has been assigned to you.`,
                NotificationType.INFO
            );

            if(previousWorkerId){
                this.notifyService.sendNotification(
                    [previousWorkerId],
                    "Task reassigned",
                    `Task "${updatedTask.title}" has been reassigned to another user.`,
                    NotificationType.INFO
                );
            }
        }

        return { success: true, data: updatedTask };
    }

    async updateTaskStatus(task_id: number, updateStatusDTO: UpdateTaskStatusDTO, user_id: number): Promise<Result<Task>> {
        const task = await this.taskRepository.findOne({where: {task_id}});

        if(!task) {
            return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found"};
        }

        if(user_id != task.worker_id && user_id) {
            return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "You are not authorized to change this task's status" };
        }

        if (updateStatusDTO.status === TaskStatus.COMPLETED) {
            if (!updateStatusDTO.file_id) {
                return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "File is required" };
            }

            const fileResult = await this.fileServiceClient.getFileMetaData(updateStatusDTO.file_id);
            if (!fileResult.success) {
                return fileResult;
            }

            const workerResult = await this.userService.getUserById(user_id);
            if (!workerResult.success) {
                return workerResult;
            } 

            const attached = canAttach(workerResult.data.role_name, fileResult.data.fileType.toLowerCase());
            if (!attached.success) {
                return { success: false, errorCode: ErrorCode.FORBIDDEN, message: attached.message! };
            }

            task.attachment_file_uuid = updateStatusDTO.file_id;
        }
        
        task.task_status = updateStatusDTO.status;
        const updatedTask = await this.taskRepository.save(task);
        return { success: true, data: updatedTask };
    }

    async deleteTask(task_id: number,user_id: number): Promise<Result<boolean>> {
        const task = await this.taskRepository.findOne({
            where: { task_id }
        });

        if (!task) {
            return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found" };
        }

        if(task.project_manager_id != user_id){
            return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "Only project manager that created a task can delete it" };
        }
        await this.taskRepository.remove(task);
        
        return { success: true, data: true };
    }
}
