import { Repository } from "typeorm";
import { ICommentService } from "../Domain/services/ICommentService";
import { Task } from "../Domain/models/Task";
import { TaskStatus } from "../Domain/enums/TaskStatus";
import { Comment } from "../Domain/models/Comment";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";
import { CreateCommentDTO } from "../Domain/DTOs/CreateCommentDTO";
   export class CommentService implements ICommentService {
   
       constructor(
           private readonly taskRepository: Repository<Task>,
           private readonly commentRepository: Repository<Comment>
       ) {} 
    async addComment(task_id: number, createCommentDTO: CreateCommentDTO): Promise<Result<Comment>> {
        try {
            const task = await this.taskRepository.findOne({ where: { task_id } });
            if (!task) {
                return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found" };
            }

            if (task.task_status === TaskStatus.COMPLETED || task.task_status === TaskStatus.NOT_COMPLETED) {
                return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Cannot add comment to completed/not completed task" };
            }

            const comment : Comment = this.commentRepository.create({
                user_id : createCommentDTO.user_id,
                comment: createCommentDTO.comment,
                task: task
            });

            await this.commentRepository.save(comment);

            return { success: true, data: comment };
        } catch (error) {
            return { success: false, errorCode:ErrorCode.INTERNAL_ERROR, message: "Internal server error" };
        }
    }
}
