export const USER_ROUTES = Object.freeze({
    CREATE: "/users",
    GET_BY_ID: (id: number) => `/users/${id}`,
    GET_BY_IDS: "/users/ids",
    GET_ALL: "/users",
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    CREATION_ROLES: "/user-roles/userCreation"
} as const);