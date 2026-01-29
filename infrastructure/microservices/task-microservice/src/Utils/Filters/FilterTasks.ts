import { UserRole } from "../../Domain/enums/UserRole";
import { Task } from "../../Domain/models/Task";

export function filterTasksForRole(tasks: Task[], userId: number, roleName: string): Task[] {
    if (roleName === UserRole.ANIMATION_WORKER || roleName === UserRole.AUDIO_MUSIC_STAGIST) {
        return tasks.filter((task) => Number(task.worker_id) === Number(userId));
    }
    return tasks;
}