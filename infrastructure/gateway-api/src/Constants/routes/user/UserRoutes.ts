export const USER_ROUTES = Object.freeze({
    REGISTER_USER: "/users",
    GET_USER: (userId: number) => `/users/${userId}`,
    GET_MULTIPLE_USERS: "/users/ids",
    GET_ALL_USERS: "/users",
    UPDATE_USER: (userId: number) => `/users/${userId}`,
    DELETE_USER: (userId: number) => `/users/${userId}`,
    GET_ROLES_BY_IMPACT_LEVEL: (impactLevel: number) => `/user-roles/${impactLevel}`
} as const);