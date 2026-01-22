import { Result } from "../../types/common/Result";
import { ReviewDTO} from "../../DTOs/version-control/ReviewDTO";
import { ReviewCommentDTO } from "../../DTOs/version-control/ReviewCommentDTO";
import { TaskTemplateDTO } from "../../DTOs/version-control/TaskTemplateDTO";
import { CreateTemplateDTO } from "../../DTOs/version-control/CreateTemplateDTO";
import { TaskResponseDTO } from "../../DTOs/version-control/TaskResponseDTO";

export interface IGatewayVersionControlService {
    sendToReview(taskId : number,authorId : number) : Promise<Result<ReviewDTO>>;
    acceptReview(taskId : number,reviewedBy : number) : Promise<Result<ReviewDTO>>;
    rejectReview(taskId : number,reviewedBy : number,rejectComment : string) : Promise<Result<ReviewCommentDTO>>;
    getReviews() : Promise<Result<ReviewDTO[]>>;

    getTemplateById(template_id: number): Promise<Result<TaskTemplateDTO>>;
    getAllTemplates(): Promise<Result<TaskTemplateDTO[]>>;
    createTemplate(data: CreateTemplateDTO, pm_id: number): Promise<Result<TaskTemplateDTO>>;
    createTaskFromTemplate(template_id: number, sprint_id: number,worker_id: number, pm_id: number): Promise<Result<TaskResponseDTO>>;
    addDependency(template_id: number, depends_on_id: number, pm_id: number): Promise<Result<void>>;
}
