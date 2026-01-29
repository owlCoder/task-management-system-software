import { CreateTaskDTO } from "../../Domain/DTOs/CreateTaskDTO";
import { UpdateTaskDTO } from "../../Domain/DTOs/UpdateTaskDTO";
import { UpdateTaskStatusDTO } from "../../Domain/DTOs/UpdateTaskStatusDTO";
import { TaskStatus } from "../../Domain/enums/TaskStatus";
import { ValidationError } from "./ValidationError";

export function validateTaskId(taskId: unknown): ValidationError {
    if(typeof taskId !== "number" || isNaN(taskId)){
        return { isValid: false, message: "Invalid task ID" };
    }

    if(taskId <= 0){
        return { isValid: false, message: "Task ID must be a positive number" };
    }

    return { isValid: true };
}

export function validateCreateTask(createTaskDTO: CreateTaskDTO): ValidationError {
    const isValidWorkerId = validateWorkerId(createTaskDTO.assignedTo);
    if (!isValidWorkerId.isValid) {
        return isValidWorkerId;
    }

    const isValidTitle = validateTitle(createTaskDTO.title);
    if (!isValidTitle.isValid) {
        return isValidTitle;
    }

    const isValidDescription = validateDescription(createTaskDTO.description);
    if (!isValidDescription.isValid) {
        return isValidDescription;
    }

    if(createTaskDTO.estimatedCost !== undefined) {
        const isValidEstimatedCost = validateEstimatedCost(createTaskDTO.estimatedCost);
        if (!isValidEstimatedCost.isValid) {
            return isValidEstimatedCost;
        }
    }

    return { isValid: true };
}

export function validateUpdateTask(updateTaskDTO: UpdateTaskDTO): ValidationError {
    if (!updateTaskDTO || Object.keys(updateTaskDTO).length === 0) {
        return { isValid: false, message: "No fields provided for update" };
    }

    if (updateTaskDTO.title !== undefined) {
        const isValidTitle = validateTitle(updateTaskDTO.title);
        if (!isValidTitle.isValid) {
            return isValidTitle;
        }
    }

    if (updateTaskDTO.description !== undefined) {
        const isValidDescription = validateDescription(updateTaskDTO.description);
        if (!isValidDescription.isValid) {
            return isValidDescription;
        }
    }

    if (updateTaskDTO.estimatedCost !== undefined) {
        const isValidEstimatedCost = validateEstimatedCost(updateTaskDTO.estimatedCost);
        if (!isValidEstimatedCost.isValid) {
            return isValidEstimatedCost;
        }
    }

    if (updateTaskDTO.status !== undefined) {
        const isValidStatus = validateStatus(updateTaskDTO.status);
        if (!isValidStatus.isValid) {
            return isValidStatus;
        }
    }

    if(updateTaskDTO.assignedTo !== undefined) {
        const isValidAssignedTo = validateAssignedTo(updateTaskDTO.assignedTo);
        if (!isValidAssignedTo.isValid) {
            return isValidAssignedTo;
        }
    }

    return { isValid: true };
}

export function validateUpdateTaskStatus(updateStatusDTO: UpdateTaskStatusDTO): ValidationError {
    const isValidStatus = validateStatus(updateStatusDTO.status);
    if(!isValidStatus.isValid){
        return isValidStatus;
    }

    if(updateStatusDTO.file_id !== undefined) {
        const isValidFile = validateFileId(updateStatusDTO.file_id);
        if(!isValidFile.isValid){
            return isValidFile;
        }
    }

    return { isValid: true };
}

function validateWorkerId(workerId: unknown): ValidationError {
    if (typeof workerId !== "number" || isNaN(workerId) || workerId <= 0) {
        return { isValid: false, message: "Worker ID must be a postitive number" }
    }
    return { isValid: true };
}

function validateTitle(title: unknown): ValidationError {
    if (typeof title !== "string") {
        return { isValid: false, message: "Title must be a string" };
    }

    if (title.trim().length === 0) {
        return { isValid: false, message: "Title cannot be empty" };
    }

    return { isValid: true };
}

function validateDescription(description: unknown): ValidationError {
    if (typeof description !== "string") {
        return { isValid: false, message: "Description must be a string" };
    }

    if (description.trim().length === 0) {
        return { isValid: false, message: "Description cannot be empty" };
    }

    return { isValid: true };
}

function validateEstimatedCost(estimatedCost: unknown): ValidationError {
    if (typeof estimatedCost !== "number" || isNaN(estimatedCost) || estimatedCost < 0) {
        return { isValid: false, message: "Estimated cost must be a non-negative number" };
    }

    return { isValid: true };
}

function validateStatus(status: unknown): ValidationError {
    if (typeof status !== "string") {
        return { isValid: false, message: "Status must be a string" };
    }

    const validStatuses = Object.values(TaskStatus); 
    if (!validStatuses.includes(status as TaskStatus)) {
        return { isValid: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` };
    }

    return { isValid: true };
}

function validateAssignedTo(assignedTo: unknown): ValidationError {
    if (typeof assignedTo !== "number" || isNaN(assignedTo) || assignedTo <= 0) {
        return { isValid: false, message: "Assigned to must be a positive number" };
    }

    return { isValid: true };
}

function validateFileId(fileId: unknown): ValidationError {
    if (typeof fileId !== "number" || isNaN(fileId)) {
        return { isValid: false, message: "File ID must be a number" };
    }

    return { isValid: true };
}