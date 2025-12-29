export const TASK_ROUTES = Object.freeze({
    GET_BY_ID: (taskId: number) => `/tasks/${taskId}`,
    GET_BY_SPRINT_ID: (sprintId: number) => `/tasks/sprints/${sprintId}`,
    ADD_TASK_BY_SPRINT_ID: (sprintId: number) => `/tasks/sprints/${sprintId}`,
    ADD_COMMENT_BY_TASK_ID: (taskId: number) => `/tasks/${taskId}/comments`
} as const);