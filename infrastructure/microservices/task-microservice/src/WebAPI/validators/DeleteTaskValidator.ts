import { ValidationError } from "./ValidationError";

export class DeleteTaskValidator {

    static validateTaskId(taskId: any): ValidationError {
        if (typeof taskId !== "number" || isNaN(taskId)) {
            return {
                isValid: false,
                message: "Invalid task ID"
            };
        }

        if (taskId <= 0) {
            return {
                isValid: false,
                message: "Task ID must be a positive number"
            };
        }

        return { isValid: true };
    }
}
