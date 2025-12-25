export class CreateTaskRequestDTO {
    worker_id!: number;

    project_manager_id!: number;

    title!: string;

    task_description!: string;

    estimated_cost?: number;
}