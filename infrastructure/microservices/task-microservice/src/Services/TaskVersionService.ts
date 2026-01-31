import { Repository } from "typeorm";
import { TaskVersion } from "../Domain/models/TaskVersion";
import { Task } from "../Domain/models/Task";
import { ITaskVersionService } from "../Domain/services/ITaskVersionService";
import { TaskVersionDTO } from "../Domain/DTOs/TaskVersionDTO";
import { taskVersionToDTO } from "../Utils/Converters/TaskVersionConverter";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";

export class TaskVersionService implements ITaskVersionService {
  constructor(
    private readonly taskVersionRepository: Repository<TaskVersion>
  ) {}

  async createVersionSnapshot(task: Task): Promise<Result<TaskVersionDTO>> {
    const last = await this.taskVersionRepository.findOne({
      where: { task_id: task.task_id },
      order: { version_number: "DESC" },
    });

    const nextVersion = (last?.version_number ?? 0) + 1;

    const version = this.taskVersionRepository.create({
      task,
      task_id: task.task_id,
      version_number: nextVersion,
      title: task.title,
      task_description: task.task_description,
      task_status: task.task_status,
      attachment_file_uuid: task.attachment_file_uuid ?? null,
      estimated_cost: task.estimated_cost ?? null,
      total_hours_spent: task.total_hours_spent ?? null,
      worker_id: task.worker_id ?? null,
      due_date: (task as any).due_date ?? null,
    });

    const saved = await this.taskVersionRepository.save(version);
    return { success: true, data: taskVersionToDTO(saved)};
  }

  async getVersionsForTask(task_id: number): Promise<Result<TaskVersionDTO[]>> {
    const versions = await this.taskVersionRepository.find({
      where: { task_id },
      order: { version_number: "ASC" },
    });
    return { success: true, data: versions.map(taskVersionToDTO)};
  }

  async getVersionById(version_id: number): Promise<Result<TaskVersionDTO>> {
    const version = await this.taskVersionRepository.findOne({
      where: { version_id },
    });
    if (!version) {
      return { success: false, errorCode: ErrorCode.VERSION_NOT_FOUND, message: `Task version with id ${version_id} not found`};
    }
    return { success: true, data: taskVersionToDTO(version)};
  }
}