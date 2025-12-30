export const PROJECT_ROUTES = Object.freeze({
    GET_PROJECT: (projectId: number) => `/projects/${projectId}`,
    GET_PROJECTS_FROM_USER: (userId: number) => `/users/${userId}/projects`,
    CREATE_PROJECT: "/projects",
    UPDATE_PROJECT: (projectId: number) => `/projects/${projectId}`,
    DELETE_PROJECT: (projectId: number) => `/projects/${projectId}`,
    GET_SPRINTS_FROM_PROJECT: (projectId: number) => `/projects/${projectId}/sprints`,
    GET_SPRINT: (sprintId: number) => `/sprints/${sprintId}`,
    CREATE_SPRINT_FOR_PROJECT: (projectId: number) => `/projects/${projectId}/sprints`,
    UPDATE_SPRINT: (sprintId: number) => `/sprints/${sprintId}`,
    DELETE_SPRINT: (sprintId: number) => `/sprints/${sprintId}`,
    GET_USERS_FROM_PROJECT: (projectId: number) => `/projects/${projectId}/users`,
    ASSIGN_USER_TO_PROJECT: (projectId: number) => `/projects/${projectId}/users`,
    REMOVE_USER_FROM_PROJECT: (projectId: number, userId: number) => `/projects/${projectId}/users/${userId}`
} as const);