export const PROJECT_ROUTES = {
    GET_BY_ID: (id: number) => `/projects/${id}`,
    CREATE: "/projects",
    UPDATE: (id: number) => `/projects/${id}`,
    DELETE: (id: number) => `/projects/${id}`
}