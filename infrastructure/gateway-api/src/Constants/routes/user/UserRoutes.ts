export const USER_ROUTES = Object.freeze({
    REGISTER_USER: "/users",
    GET_USER: (id: number) => `/users/${id}`,
    GET_MULTIPLE_USERS: "/users/ids",
    GET_ALL_USERS: "/users",
    UPDATE_USER: (id: number) => `/users/${id}`,
    DELETE_USER: (id: number) => `/users/${id}`,
    GET_ROLES_BY_IMPACT_LEVEL: (impactLevel: number) => `/user-roles/${impactLevel}`
} as const);