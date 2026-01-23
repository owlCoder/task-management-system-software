export const VERSION_CONTROL_ROUTES = Object.freeze({
    SEND_REVIEW : (taskId : number) => `/reviews/${taskId}/send`,
    ACCEPT_REVIEW : (taskId : number) => `/reviews/${taskId}/accept`,
    REJECT_REVIEW : (taskId : number) => `/reviews/${taskId}/reject`,
    GET_REVIEWS: `/reviews`,
    GET_TEMPLATE: (templateId: number) => `/templates/${templateId}`,
    GET_ALL: `/templates`,
    CREATE_TEMPLATE: `/templates`,
    CREATE_TASK : (templateId: number) => `/templates/${templateId}/create`,
    CREATE_DEPENDENCY: (templateId: number, dependsOnId: number) => `/templates/${templateId}/dependencies/${dependsOnId}`,
    GET_REVIEW_COMMENT: (commentId: number) => `/reviewComments/${commentId}`,
} as const);