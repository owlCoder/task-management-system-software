import { Repository } from "typeorm";
import { ICommentService } from "../Domain/services/ICommentService";
import { Task } from "../Domain/models/Task";
import { TaskStatus } from "../Domain/enums/TaskStatus";
import { Comment } from "../Domain/models/Comment";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";
import { CreateCommentDTO } from "../Domain/DTOs/CreateCommentDTO";
import { IProjectServiceClient } from "../Domain/services/external-services/IProjectServiceClient";

export class CommentService implements ICommentService {
   constructor(
        private readonly taskRepository: Repository<Task>,
        private readonly commentRepository: Repository<Comment>,
        private readonly projectServiceClient: IProjectServiceClient,
    ) {} 

    async addComment(task_id: number, createCommentDTO: CreateCommentDTO, user_id: number): Promise<Result<Comment>> {
        const task = await this.taskRepository.findOne({ where: { task_id } });
        
        if (!task) {
            return { success: false, errorCode: ErrorCode.TASK_NOT_FOUND, message: "Task not found" };
        }

        if (task.task_status === TaskStatus.COMPLETED || task.task_status === TaskStatus.NOT_COMPLETED) {
            return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "Cannot add comment to completed/not completed task" };
        }

        if (task.project_manager_id != user_id) {
            const sprintResult = await this.projectServiceClient.getSprintById(task.sprint_id);
            if (!sprintResult.success) {
                return sprintResult;
            }

            const projectUsersResult = await this.projectServiceClient.getUsersForProject(sprintResult.data.project_id);
            if (!projectUsersResult.success) {
                return projectUsersResult;
            }

            if (!projectUsersResult.data.some((projectUser) => projectUser.user_id === user_id)) {
                return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "Only managers assigned to project can comment" };
            }
        }

        const comment = this.commentRepository.create({
            user_id: user_id,
            comment: createCommentDTO.comment,
            task: task
        });

        await this.commentRepository.save(comment);

        return { success: true, data: comment };
    }

    async deleteComment(comment_id: number,user_id: number): Promise<Result<boolean>> {
        const comment = await this.commentRepository.findOne({
            where: { comment_id }
        });

        if (!comment) {
            return { success: false, errorCode: ErrorCode.COMMENT_NOT_FOUND, message: "Comment not found" };
        }

        if(comment.user_id != user_id){
            return { success: false, errorCode: ErrorCode.FORBIDDEN, message: "Only creator of comment can delete it" };
        }

        await this.commentRepository.remove(comment);
        return { success: true, data: true };
    }
}
