export const TASK_ROUTES = Object.freeze({
    GET_TASK: (taskId: number) => `/tasks/${taskId}`,
    GET_TASKS_FROM_SPRINT: (sprintId: number) => `/tasks/sprints/${sprintId}`,
    ADD_TASK_TO_SPRINT: (sprintId: number) => `/tasks/sprints/${sprintId}`,
    UPDATE_TASK: (taskId: number) => `/tasks/${taskId}`,
    UPDATE_TASK_STATUS: (taskId: number) => `/tasks/${taskId}/status`,
    DELETE_TASK: (taskId: number) => `/tasks/${taskId}`,
    ADD_COMMENT_TO_TASK: (taskId: number) => `/tasks/${taskId}/comments`,
    DELETE_COMMENT: (commentId: number) => `/comments/${commentId}`,
    GET_TASK_VERSIONS: (taskId: number) => `/tasks/${taskId}/versions`,
    GET_TASK_VERSION: (taskId: number, versionId: number) => `/tasks/${taskId}/versions/${versionId}`,
} as const);