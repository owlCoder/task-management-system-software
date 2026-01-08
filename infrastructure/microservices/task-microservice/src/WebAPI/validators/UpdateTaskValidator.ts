import { UpdateTaskDTO } from "../../Domain/DTOs/UpdateTaskDTO";
import { TaskStatus } from "../../Domain/enums/TaskStatus";
import { ValidationError } from "./ValidationError";


export class UpdateTaskValidator {

    static validateUpdateTaskDTO(updateTaskDTO: UpdateTaskDTO): ValidationError {
        if (!updateTaskDTO || Object.keys(updateTaskDTO).length === 0) {
            return {
                isValid: false,
                message: "No fields provided for update"
            };
        }

        if (updateTaskDTO.title !== undefined) {
            const titleValidation = this.validateTitle(updateTaskDTO.title);
            if (!titleValidation.isValid) {
                return titleValidation;
            }
        }

        if (updateTaskDTO.description !== undefined) {
            const descriptionValidation = this.validateDescription(updateTaskDTO.description);
            if (!descriptionValidation.isValid) {
                return descriptionValidation;
            }
        }

        if (updateTaskDTO.estimatedCost !== undefined) {
            const costValidation = this.validateEstimatedCost(updateTaskDTO.estimatedCost);
            if (!costValidation.isValid) {
                return costValidation;
            }
        }

        if (updateTaskDTO.status !== undefined) {
            const statusValidation = this.validateStatus(updateTaskDTO.status);
            if (!statusValidation.isValid) {
                return statusValidation;
            }
        }

        if (updateTaskDTO.assignedTo !== undefined) {
            const assignedValidation = this.validateAssignedTo(updateTaskDTO.assignedTo);
            if (!assignedValidation.isValid) {
                return assignedValidation;
            }
        }

        return { isValid: true };
    }


    private static validateTitle(title: any): ValidationError {
        if (typeof title !== "string") {
            return {
                isValid: false,
                message: "Title must be a string"
            };
        }

        if (title.trim().length === 0) {
            return {
                isValid: false,
                message: "Title cannot be empty"
            };
        }

        return { isValid: true };
    }

    private static validateDescription(description: any): ValidationError {
        if (typeof description !== "string") {
            return {
                isValid: false,
                message: "Description must be a string"
            };
        }

        if (description.trim().length === 0) {
            return {
                isValid: false,
                message: "Description cannot be empty"
            };
        }

        return { isValid: true };
    }


    private static validateEstimatedCost(estimatedCost: any): ValidationError {
        if (typeof estimatedCost !== "number") {
            return {
                isValid: false,
                message: "Estimated cost must be a number"
            };
        }

        if (estimatedCost < 0) {
            return {
                isValid: false,
                message: "Estimated cost must be a non-negative number"
            };
        }

        return { isValid: true };
    }


    private static validateStatus(status: any): ValidationError {
        const validStatuses = Object.values(TaskStatus);

        if (typeof status !== "string") {
            return {
                isValid: false,
                message: "Status must be a string"
            };
        }

        if (!validStatuses.includes(status as TaskStatus)) {
            return {
                isValid: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            };
        }

        return { isValid: true };
    }

    private static validateAssignedTo(assignedTo: any): ValidationError {
        if (typeof assignedTo !== "number") {
            return {
                isValid: false,
                message: "Assigned to must be a number"
            };
        }

        if (assignedTo <= 0) {
            return {
                isValid: false,
                message: "Assigned to must be a positive number"
            };
        }

        return { isValid: true };
    }
}
