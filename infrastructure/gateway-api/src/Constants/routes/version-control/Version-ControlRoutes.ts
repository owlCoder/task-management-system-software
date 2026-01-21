export const VERSION_CONTROL_ROUTES = Object.freeze({
    SEND_REVIEW : (taskId : number) => `/reviews/${taskId}/send`,
    ACCEPT_REVIEW : (taskId : number) => `/reviews/${taskId}/accept`,
    REJECT_REVIEW : (taskId : number) => `/reviews/${taskId}/reject`,
    GET_REVIEW : () => `/reviews`,
})
