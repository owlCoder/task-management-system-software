export const USER_ROUTES = {
    CREATE: "/users",
    GET_BY_ID: (id: number) => `/users/${id}`,
    GET_ALL: "/users",
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`
}