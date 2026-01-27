import { SIEMLogLevel } from "../configs/routes/SIEMLogLevel";
import { SIEMRouteConfig } from "../configs/routes/SIEMRouteConfig";

/**
 * Maps routes to the level of SIEM logging 
 */
export const ROUTE_CONFIG: Record<string, SIEMRouteConfig> = {
    // auth-microservice routes
    'POST /login': { level: SIEMLogLevel.CRITICAL },
    'POST /siem/login': { level: SIEMLogLevel.CRITICAL },
    'POST /verify-otp': { level: SIEMLogLevel.CRITICAL },
    'POST /resend-otp': { level: SIEMLogLevel.CRITICAL },
    'POST /google-login': { level: SIEMLogLevel.CRITICAL },

    // file-microservice routes
    'GET /files/download/:fileId': { level: SIEMLogLevel.CRITICAL },
    'GET /files/author/:authorId': { level: SIEMLogLevel.ERROR },
    'GET /files/metadata/:fileId': { level: SIEMLogLevel.ERROR },
    'POST /files/upload': { level: SIEMLogLevel.CRITICAL },
    'DELETE /files/:fileId': { level: SIEMLogLevel.CRITICAL },

    // notification-microservice routes
    'GET /notifications/:notificationId': { level: SIEMLogLevel.ERROR },
    'GET /notifications/user/:userId': { level: SIEMLogLevel.ERROR },
    'GET /notifications/user/:userId/unread-count': { level: SIEMLogLevel.ERROR },
    'POST /notifications': { level: SIEMLogLevel.ERROR },
    'PATCH /notifications/bulk/unread': { level: SIEMLogLevel.ERROR },
    'PATCH /notifications/bulk/read': { level: SIEMLogLevel.ERROR },
    'PATCH /notifications/:notificationId/read': { level: SIEMLogLevel.ERROR },
    'PATCH /notifications/:notificationId/unread': { level: SIEMLogLevel.ERROR },
    'DELETE /notifications/bulk': { level: SIEMLogLevel.CRITICAL },
    'DELETE /notifications/:notificationId': { level: SIEMLogLevel.CRITICAL },

    // project-microservice routes
    'GET /projects': {level: SIEMLogLevel.ERROR },
    'GET /project-ids': {level: SIEMLogLevel.ERROR },
    'GET /projects/:projectId': { level: SIEMLogLevel.ERROR },
    'GET /users/:userId/projects': { level: SIEMLogLevel.ERROR },
    'POST /projects': { level: SIEMLogLevel.CRITICAL },
    'PUT /projects/:projectId': { level: SIEMLogLevel.CRITICAL },
    'DELETE /projects/:projectId': { level: SIEMLogLevel.CRITICAL },
    'GET /projects/:projectId/sprints': { level: SIEMLogLevel.ERROR },
    'GET /sprints/:sprintId': { level: SIEMLogLevel.ERROR },
    'POST /projects/:projectId/sprints': { level: SIEMLogLevel.CRITICAL },
    'PUT /sprints/:sprintId': { level: SIEMLogLevel.CRITICAL },
    'DELETE /sprints/:sprintId': { level: SIEMLogLevel.CRITICAL },
    'GET /projects/:projectId/users': { level: SIEMLogLevel.ERROR },
    'POST /projects/:projectId/users': { level: SIEMLogLevel.CRITICAL },
    'DELETE /projects/:projectId/users/:userId': { level: SIEMLogLevel.CRITICAL },

    // analytics-microservice routes
    'GET /analytics/burndown/:sprintId': { level: SIEMLogLevel.ERROR },
    'GET /analytics/burnup/:sprintId': { level: SIEMLogLevel.ERROR },
    'GET /analytics/velocity/:projectId': { level: SIEMLogLevel.ERROR },
    'GET /analytics/budget/:projectId': { level: SIEMLogLevel.ERROR },
    'GET /analytics/resource-cost/:projectId': { level: SIEMLogLevel.ERROR },
    'GET /analytics/profit-margin/:projectId': { level: SIEMLogLevel.ERROR },
    'GET /analytics/projects-last-30-days': { level: SIEMLogLevel.ERROR },
    'GET /analytics/workers-last-30-days': { level: SIEMLogLevel.ERROR },

    // service-status-microservice routes
    'GET /measurements': { level: SIEMLogLevel.ERROR },
    'GET /measurements/average-response-time/:days': { level: SIEMLogLevel.ERROR },
    'GET /measurements/down': { level: SIEMLogLevel.ERROR },
    'GET /measurements/service-status': { level: SIEMLogLevel.ERROR },

    // task-microservice routes
    'GET /tasks/:taskId': { level: SIEMLogLevel.ERROR },
    'GET /tasks/sprints/:sprintId': { level: SIEMLogLevel.ERROR },
    'POST /tasks/sprints/:sprintId': { level: SIEMLogLevel.CRITICAL },
    'PUT /tasks/:taskId': { level: SIEMLogLevel.CRITICAL },
    'PATCH /tasks/:taskId/status': { level: SIEMLogLevel.CRITICAL },
    'DELETE /tasks/:taskId': { level: SIEMLogLevel.CRITICAL },
    'POST /tasks/:taskId/comments': { level: SIEMLogLevel.CRITICAL },
    'DELETE /comments/:commentId': { level: SIEMLogLevel.CRITICAL },
    'GET /tasks/:taskId/versions': { level: SIEMLogLevel.ERROR },
    'GET /tasks/:taskId/versions/:versionId': { level: SIEMLogLevel.ERROR},
    
    // user-microservice routes
    'POST /users': { level: SIEMLogLevel.CRITICAL },
    'GET /users/ids': { level: SIEMLogLevel.CRITICAL },
    'GET /users/:userId': { level: SIEMLogLevel.CRITICAL },
    'GET /users': { level: SIEMLogLevel.CRITICAL },
    'PUT /users/:userId': { level: SIEMLogLevel.CRITICAL },
    'DELETE /users/:userId': { level: SIEMLogLevel.CRITICAL },
    'GET /user-roles/:impactLevel': { level: SIEMLogLevel.ERROR },

    // version-control-microservice routes
    'GET /reviews': { level: SIEMLogLevel.ERROR },
    'GET /reviews/:taskId/history': { level: SIEMLogLevel.ERROR },
    'POST /reviews/:taskId/accept': { level: SIEMLogLevel.CRITICAL },
    'POST /reviews/:taskId/reject': { level: SIEMLogLevel.CRITICAL },
    'POST /reviews/:taskId/send': { level: SIEMLogLevel.CRITICAL },
    'GET /templates/:templateId': { level: SIEMLogLevel.ERROR },
    'GET /templates': { level: SIEMLogLevel.ERROR },
    'POST /templates': { level: SIEMLogLevel.CRITICAL },
    'POST /templates/:templateId/create': { level: SIEMLogLevel.CRITICAL },
    'POST /templates/:templateId/dependencies/:dependsOnId': { level: SIEMLogLevel.CRITICAL },
    'GET /reviewComments/:commentId': { level: SIEMLogLevel.ERROR },

    // self health route
    'GET /health': { level: SIEMLogLevel.NEVER },

    // unmatched routes
    '*': { level: SIEMLogLevel.ERROR }
}
