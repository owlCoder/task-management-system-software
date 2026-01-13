import { ReviewStatus } from "../enums/ReviewStatus";

export interface TaskReviewDTO {
    taskId : number;
    authorId : number;
    status : ReviewStatus; 
    time : string;
}