export const TASK_ROUTES = Object.freeze({
    GET_TASK: (taskId: number) => `/tasks/${taskId}`,
    GET_TASKS_FROM_SPRINT: (sprintId: number) => `/tasks/sprints/${sprintId}`,
    ADD_TASK_TO_SPRINT: (sprintId: number) => `/tasks/sprints/${sprintId}`,
    ADD_COMMENT_TO_TASK: (taskId: number) => `/tasks/${taskId}/comments`
} as const);