import { Repository } from "typeorm";
import { ICommentService } from "../Domain/services/ICommentService";
import { Task } from "../Domain/models/Task";
import { TaskStatus } from "../Domain/enums/TaskStatus";
import { Comment } from "../Domain/models/Comment";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";
import { CreateCommentDTO } from "../Domain/DTOs/CreateCommentDTO";
import { IProjectServiceClient } from "../Domain/services/external-services/IProjectServiceClient";
import { IUserServiceClient } from "../Domain/services/external-services/IUserServiceClient";
   export class CommentService implements ICommentService {
   
       constructor(
           private readonly taskRepository: Repository<Task>,
           private readonly commentRepository: Repository<Comment>,
       ) {} 
    async addComment(task_id: number, createCommentDTO: CreateCommentDTO,user_id: number): Promise<Result<Comment>> {
        try {
            const task = await this.taskRepository.findOne({ where: { task_id } });
            
            if (!task) {
                return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found" };
            }
            if(task.worker_id != user_id && task.project_manager_id != user_id)
            {
                return { success: false, errorCode:ErrorCode.FORBIDDEN, message: "Only those assigned to task can comment" };
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

    async deleteComment(comment_id: number,user_id: number): Promise<Result<boolean>> {
        try {
            const comment = await this.commentRepository.findOne({
                where: { comment_id }
            });

            if (!comment) {
                return { success: false, errorCode: ErrorCode.INVALID_INPUT, message: "Comment not found" };
            }
            if(comment.user_id != user_id)
                 return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "Only creator of comment can delete it" };
            await this.commentRepository.remove(comment);
            return { success: true, data: true };

        } catch (error) {
            console.log(error);
            return { success: false, errorCode: ErrorCode.INTERNAL_ERROR, message: "Failed to delete comment" };
        }
    }
}
