import { Repository } from "typeorm";
import { TaskDTO } from "../../Domain/DTOs/TaskDTO";
import { ICommentService } from "../../Domain/services/ICommentService";
import { Task } from "../../Domain/models/Task";   
import { TaskResponse } from "../../Domain/types/TaskResponse";
import { TaskStatus } from "../../Domain/enums/task_status";
import { CommentDTO } from "../../Domain/DTOs/CommentDTO";
import { Comment } from "../../Domain/models/Comment";
import { taskToDTO,commentToDTO } from "../Mappers/dtoMappers"
   export class CommentService implements ICommentService {
   
       constructor(
           private readonly taskRepository: Repository<Task>,
           private readonly commentRepository: Repository<Comment>
       ) {} 
    async addComment(task_id: number, user_id: number, commentText: string): Promise<TaskResponse<CommentDTO>> {
        try {
            const task = await this.taskRepository.findOne({ where: { task_id } });
            if (!task) {
                return { success: false, statusCode: 404, message: "Task not found" };
            }

            if (task.task_status === TaskStatus.COMPLETED || task.task_status === TaskStatus.NOT_COMPLETED) {
                return { success: false, statusCode: 400, message: "Cannot add comment to completed/not completed task" };
            }

            const comment : Comment = this.commentRepository.create({
                user_id,
                comment: commentText,
                task: task
            });

            await this.commentRepository.save(comment);

            return { success: true, statusCode: 201, data: commentToDTO(comment) };
        } catch (error) {
            return { success: false, statusCode: 500, message: "Internal server error" };
        }
    }
}
