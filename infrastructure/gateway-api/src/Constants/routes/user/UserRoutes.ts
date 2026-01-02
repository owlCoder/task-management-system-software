export const USER_ROUTES = Object.freeze({
    REGISTER_USER: "/users",
    GET_USER: (id: number) => `/users/${id}`,
    GET_MULTIPLE_USERS: "/users/ids",
    GET_ALL_USERS: "/users",
    UPDATE_USER: (id: number) => `/users/${id}`,
    DELETE_USER: (id: number) => `/users/${id}`,
    GET_REGISTRATION_ROLES: "/user-roles/userCreation"
} as const);