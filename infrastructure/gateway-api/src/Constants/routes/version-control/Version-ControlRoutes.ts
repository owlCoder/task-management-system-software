export const VERSION_CONTROL_ROUTES = Object.freeze({
    SEND_REVIEW : (taskId : number) => `/reviews/${taskId}/send`,
    ACCEPT_REVIEW : (taskId : number) => `/reviews/${taskId}/accept`,
    REJECT_REVIEW : (taskId : number) => `/reviews/${taskId}/reject`,
    GET_REVIEW : () => `/reviews`,

    GET_TEMPLATE: (template_id: number) => `/templates/${template_id}`,
    GET_ALL : () => `/templates`,
    CREATE_TEMPLATE: () => `/templates`,
    CREATE_TASK : (template_id: number) => `/templates/${template_id}/create`,
    CREATE_DEPENDENCY: (dependency_id: number, dependsOn: number) => `/templates/${dependency_id}/dependencies/${dependsOn}`,
})
