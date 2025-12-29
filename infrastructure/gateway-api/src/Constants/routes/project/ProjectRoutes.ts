export const PROJECT_ROUTES = Object.freeze({
    GET_BY_ID: (id: number) => `/projects/${id}`,
    CREATE: "/projects",
    UPDATE: (id: number) => `/projects/${id}`,
    DELETE: (id: number) => `/projects/${id}`
} as const);