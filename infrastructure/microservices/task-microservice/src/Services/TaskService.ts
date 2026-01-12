import { Repository } from "typeorm";
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
export class TaskService implements ITaskService {

    constructor(
        private readonly taskRepository: Repository<Task>,
        private readonly projectService: IProjectServiceClient,
        private readonly userService: IUserServiceClient
    ) {
       
    }
//#region Dummy data for development

   private readonly dummyTasks: Task[] = [
    {
        task_id: 1,
        sprint_id: 100,
        worker_id: 5,
        project_manager_id: 10,
        title: "Dummy task 1",
        task_description: "Opis dummy taska 1",
        task_status: TaskStatus.IN_PROGRESS,
        attachment_file_uuid: 1,
        estimated_cost: 10,
        total_hours_spent: 15,
        created_at: new Date(),
        comments: [
            { comment_id: 1, user_id: 5, comment: "Pocetni komentar na task 1",created_at: new Date()},
            { comment_id: 2, user_id: 10, comment: "Project manager dodaje napomenu", created_at: new Date()}
        ]
    },
    {
        task_id: 2,
        sprint_id: 100,
        worker_id: 5,
        project_manager_id: 10,
        title: "Dummy task 2",
        task_description: "Opis dummy taska 2",
        task_status: TaskStatus.IN_PROGRESS,
        attachment_file_uuid: 1,
        estimated_cost: 10,
        total_hours_spent: 15,
        created_at: new Date(),
        comments: [
            { comment_id: 3, user_id: 5, comment: "Komentar radnika na task 2", created_at: new Date() }
        ]
    },
    {
        task_id: 3,
        sprint_id: 100,
        worker_id: 6,
        project_manager_id: 11,
        title: "Dummy task 3",
        task_description: "Opis dummy taska 3",
        task_status: TaskStatus.CREATED,
        attachment_file_uuid: 1,
        estimated_cost: 10,
        total_hours_spent: 15,
        created_at: new Date(),
        comments: [
            { comment_id: 4, user_id: 6, comment: "Prvi komentar na novi task", created_at: new Date()   },
            { comment_id: 5, user_id: 11, comment: "Project manager dodaje instrukcije", created_at: new Date() }
        ]
    }
];

    async getAllDummyTasksForSprint() : Promise<Result<Task[]>>{
        //Vracamo dummy podatke ako nema zadataka u bazi dok smo u developmentu
            return {success:true,data:this.dummyTasks};
    }
//#endregion
    //#region  TASK METHODS
    async getAllTasksForSprint(sprint_id: number,user_id: number) : Promise<Result<Task[]>>{
        try {
            // Proveri da li sprint postoji
            const sprintResult = await this.projectService.getSprintById(sprint_id);
            if (!sprintResult.success) {
                return { success: false, errorCode: ErrorCode.SPRINT_NOT_FOUND, message: "Sprint not found" };
            }

            const project_id = sprintResult.data.project_id;

            const usersResult = await this.projectService.getUsersForProject(project_id);
            if (!usersResult.success) {
                return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Failed to get project users" };
            }
            
            const userExists = usersResult.data.some((user: any) => user.user_id === user_id);
            if (!userExists) {
                return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "User is not assigned to this project" };
            }

            const tasks = await this.taskRepository.find({
                where: { sprint_id },
                relations: ["comments"]
            });
            return {success: true,data : tasks}
        } catch (error) {
            return {success: false,errorCode:ErrorCode.NONE}
        }
    }
    
    
    async addTaskForSprint(sprint_id: number, createTaskDTO: CreateTaskDTO,user_id: number): Promise<Result<Task>> {
        
        //provera da li je user-id projectManager
        const managerResult = await this.userService.getUserById(user_id);
        if (!managerResult.success) {
            return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "User not found" };
        }

        
        const role_name = managerResult.data.role_name;

        if (role_name !== UserRole.PROJECT_MANAGER) {
            return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Only project managers can add tasks" };
        }

        //TODO: Proveriti da li sprint postoji
        const sprintResult = await this.projectService.getSprintById(sprint_id);
        if (!sprintResult.success) {
            return { success: false, errorCode: ErrorCode.SPRINT_NOT_FOUND, message: "Sprint not found" };
            }

        const project_id = sprintResult.data.project_id;

        const usersResult = await this.projectService.getUsersForProject(project_id);
        if (!usersResult.success) {
            return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Failed to get project users" };
        }
        //provera da li se workerid nalazi u projects-user tabeli
        const userExists = usersResult.data.some((user: any) => user.user_id === createTaskDTO.worker_id);
        if (!userExists) {
            return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "User is not assigned to this project" };
        }
        if (!createTaskDTO.title || createTaskDTO.title.trim().length === 0) {
            return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Title is required" };
        }
        if (!createTaskDTO.task_description || createTaskDTO.task_description.trim().length === 0) {
            return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Task description is required" };
        }
        //Treba videti sa ostalima kako ovo da se izracuna,da li moj servis ili da to dodje kao parametar
        if ((createTaskDTO.estimated_cost ?? 0) < 0) {
            return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Estimated cost cannot be negative" };
        }

        const newTask = this.taskRepository.create({
            sprint_id,
            worker_id: createTaskDTO.worker_id,
            title: createTaskDTO.title,
            task_description: createTaskDTO.task_description,
            estimated_cost: createTaskDTO.estimated_cost,
            task_status: TaskStatus.CREATED,
            total_hours_spent: 0,
            project_manager_id: createTaskDTO.project_manager_id
        });

        const savedTask = await this.taskRepository.save(newTask);
        return { success: true, data: savedTask };
    }


    async getTaskById(task_id: number,user_id: number): Promise<Result<Task>> {
        try {
            const task = await this.taskRepository.findOne({
                where: { task_id },
                relations: ["comments"]
            });
            if (!task) {
                return {success:false,errorCode: ErrorCode.TASK_NOT_FOUND};
            }
            if(user_id == task.worker_id || user_id == task.project_manager_id)
                return {success: true,data: task}
            else
                return { success:false,errorCode: ErrorCode.FORBIDDEN};
        } catch (error) {
            return {success:false,errorCode: ErrorCode.INTERNAL_ERROR};
        }
    }
    
    async updateTask(task_id: number, updateTaskDTO: UpdateTaskDTO,user_id: number
    ): Promise<Result<Task>> {
        try {
            const task = await this.taskRepository.findOne({
                where: { task_id },
                relations: ["comments"]
            });

            if (!task) {
                return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found" };
            }
            console.log(task);
            if(user_id == task.project_manager_id)
            {
                if (updateTaskDTO.title !== undefined && updateTaskDTO.title.trim().length > 0) {
                    task.title = updateTaskDTO.title;
                }

                if (updateTaskDTO.description !== undefined && updateTaskDTO.description.trim().length > 0) {
                    task.task_description = updateTaskDTO.description;
                }

                if (updateTaskDTO.estimatedCost !== undefined && updateTaskDTO.estimatedCost >= 0) {
                    task.estimated_cost = updateTaskDTO.estimatedCost;
                }
                if (updateTaskDTO.assignedTo !== undefined && updateTaskDTO.assignedTo > 0) {
                task.worker_id = updateTaskDTO.assignedTo;
                }
            }
            else
            {
                return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "Failed to update task" };
            }

            const updatedTask = await this.taskRepository.save(task);
            return { success: true, data: updatedTask };

        } catch (error) {
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to update task" };
        }
    }

    async updateTaskStatus(task_id: number, newStatus: TaskStatus, user_id: number): Promise<Result<Task>> {
        try {
            const task = await this.taskRepository.findOne({where: {task_id}});

            if(!task) {
                return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found"};
            }

            if(user_id != task.worker_id && user_id != task.project_manager_id) {
                return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "You are not authorized to change this task's status" };
            }

            if (!Object.values(TaskStatus).includes(newStatus)) {
                return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Invalid task status" };
            }

            task.task_status = newStatus;
            const updatedTask = await this.taskRepository.save(task);
            return { success: true, data: updatedTask };
        } catch (error) {
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to update status" };
        }
        
    }

    async deleteTask(task_id: number,user_id: number): Promise<Result<boolean>> {
        try {
            const task = await this.taskRepository.findOne({
                where: { task_id }
            });

            if (!task) {
                return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found" };
            }
       
        const managerResult = await this.userService.getUserById(user_id);
        if (!managerResult.success) {
            return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "User not found" };
        }

        
        const role_name = managerResult.data.role_name;

        if (role_name !== UserRole.PROJECT_MANAGER) {
            return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Only project managers can add tasks" };
        }
         //samo projekt manager koji je kreirao task moze da ga obrise
        if(task.project_manager_id != user_id)
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Only project manager that created a task can delete it" };
        await this.taskRepository.remove(task);
        
        return { success: true, data: true };

        } catch (error) {
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to delete task" };
        }
    }

    //#endregion
}

