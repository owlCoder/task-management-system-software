import { Repository } from "typeorm";
import { TaskDTO } from "../Domain/DTOs/TaskDTO";
import { ITaskService } from "../Domain/services/ITaskService";
import { Task } from "../Domain/models/Task";   
import { TaskResponse } from "../Domain/types/TaskResponse";
import { TaskStatus } from "../Domain/enums/task_status";
import { CommentDTO } from "../Domain/DTOs/CommentDTO";
import { Comment } from "../Domain/models/Comment";
export class TaskService implements ITaskService {

    constructor(
        private readonly taskRepository: Repository<Task>,
        private readonly commentRepository: Repository<Comment>
    ) {}
//#region Dummy data for development

   private readonly dummyTasks: TaskDTO[] = [
    {
        task_id: 1,
        project_id: 100,
        worker_id: 5,
        project_manager_id: 10,
        title: "Dummy task 1",
        task_description: "Opis dummy taska 1",
        task_status: TaskStatus.IN_PROGRESS,
        comments: [
            { comment_id: 1,task_id: 1, user_id: 5, comment: "Pocetni komentar na task 1",created_at: new Date() },
            { comment_id: 2, task_id: 1, user_id: 10, comment: "Project manager dodaje napomenu", created_at: new Date() }
        ]
    },
    {
        task_id: 2,
        project_id: 100,
        worker_id: 5,
        project_manager_id: 10,
        title: "Dummy task 2",
        task_description: "Opis dummy taska 2",
        task_status: TaskStatus.IN_PROGRESS,
        comments: [
            { comment_id: 3, task_id: 2, user_id: 5, comment: "Komentar radnika na task 2", created_at: new Date() }
        ]
    },
    {
        task_id: 3,
        project_id: 100,
        worker_id: 6,
        project_manager_id: 11,
        title: "Dummy task 3",
        task_description: "Opis dummy taska 3",
        task_status: TaskStatus.CREATED,
        comments: [
            { comment_id: 4, task_id: 3, user_id: 6, comment: "Prvi komentar na novi task", created_at: new Date()   },
            { comment_id: 5, task_id: 3, user_id: 11, comment: "Project manager dodaje instrukcije", created_at: new Date() }
        ]
    }
];


//#endregion
    //#region  TASK METHODS
    async getAllTasksForProject(project_id: number) : Promise<TaskResponse<TaskDTO[]>>{
        try{
            const tasks = await this.taskRepository.find({ where: { project_id } ,relations: ["comments"] });
            const result: TaskDTO[] = tasks.map(t => this.taskToDTO(t));
            if(tasks.length === 0) {
                //Vracamo dummy podatke ako nema zadataka u bazi dok smo u developmentu
                return {
                    success: true,
                    statusCode: 200,
                    data: this.dummyTasks.filter(t => t.project_id === 1)
                };
            }
            return {success: true, data: result, statusCode: 200};
    }catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: "Internal server error"
            };
        }
    }
    async getAllDummyTasksForProject() : Promise<TaskResponse<TaskDTO[]>>{
              //Vracamo dummy podatke ako nema zadataka u bazi dok smo u developmentu
                return {
                    success: true,
                    statusCode: 200,
                    data: this.dummyTasks
                };
    }

    async getTaskById(task_id: number): Promise<TaskResponse<TaskDTO>> {
        try{
            const task = await this.taskRepository.findOne({ where: { task_id } });
            if(!task ) {
                return {
                    success: false,
                    statusCode: 404,
                    message: `Task with id ${task_id} not found`
                };
            }
                    const result: TaskDTO = this.taskToDTO(task);
            return {success: true, data: result, statusCode: 200};
    }
    catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: "Internal server error"
            };
        }
    }
    taskToDTO(task: Task): TaskDTO {
        return {
            task_id: task.task_id,
            project_id: task.project_id,
            worker_id: task.worker_id,
            project_manager_id: task.project_manager_id,
            title: task.title,
            task_description: task.task_description,
            task_status: task.task_status,
            attachment_file_uuid: task.attachment_file_uuid,
            estimated_cost: task.estimated_cost,
            total_hours_spent: task.total_hours_spent
        };
    }
    //#endregion
//#region comment methods

    async addComment(task_id: number, user_id: number, commentText: string): Promise<TaskResponse<CommentDTO>> {
        try {
            const task = await this.taskRepository.findOne({ where: { task_id } });
            if (!task) {
                return { success: false, statusCode: 404, message: "Task not found" };
            }

            if (task.task_status === TaskStatus.COMPLETED || task.task_status === TaskStatus.NOT_COMPLETED) {
                return { success: false, statusCode: 400, message: "Cannot add comment to completed/not completed task" };
            }

            const comment = this.commentRepository.create({
                user_id,
                comment: commentText,
                task
            });

            await this.commentRepository.save(comment);

            return { success: true, statusCode: 201, data: this.commentToDTO(comment) };
        } catch (error) {
            return { success: false, statusCode: 500, message: "Internal server error" };
        }
    }

    private commentToDTO(comment: Comment): CommentDTO {
        return {
            comment_id: comment.comment_id,
            user_id: comment.user_id,
            comment: comment.comment,
            task_id: comment.task.task_id,
            created_at: comment.created_at
        };
    }
//#endregion
}

