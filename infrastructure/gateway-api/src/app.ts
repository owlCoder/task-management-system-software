// Framework and Config
import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

// Domain interfaces
import { ILoggerService } from './Domain/services/common/ILoggerService';
import { IErrorHandlingService } from './Domain/services/common/IErrorHandlingService';
import { IGatewayAuthService } from './Domain/services/auth/IGatewayAuthService';
import { IGatewayUserService } from './Domain/services/user/IGatewayUserService';
import { IGatewayProjectService } from './Domain/services/project/IGatewayProjectService';
import { IGatewayTaskService } from './Domain/services/task/IGatewayTaskService';
import { IGatewayFileService } from './Domain/services/file/IGatewayFileService';
import { IGatewayNotificationService } from './Domain/services/notification/IGatewayNotificationService';
import { IGatewayAnalyticsService } from './Domain/services/analytics/IGatewayAnalyticsService';

// Service implementations
import { ErrorHandlingService } from './Services/common/ErrorHandlingService';
import { LoggerService } from './Services/common/LoggerService';
import { GatewayAuthService } from './Services/auth/GatewayAuthService';
import { GatewayUserService } from './Services/user/GatewayUserService';
import { GatewayProjectService } from './Services/project/GatewayProjectService';
import { GatewayTaskService } from './Services/task/GatewayTaskService';
import { GatewayFileService } from './Services/file/GatewayFileService';
import { GatewayNotificationService } from './Services/notification/GatewayNotificationService';
import { GatewayAnalyticsService } from './Services/analytics/GatewayAnalyticsService';

// Controllers
import { HealthController } from './WebAPI/Controllers/health/HealthController';
import { GatewayAuthController } from './WebAPI/Controllers/auth/GatewayAuthController';
import { GatewayUserController } from './WebAPI/Controllers/user/GatewayUserController';
import { GatewayProjectController } from './WebAPI/Controllers/project/GatewayProjectController';
import { GatewayTaskController } from './WebAPI/Controllers/task/GatewayTaskController';
import { GatewayFileController } from './WebAPI/Controllers/file/GatewayFileController';
import { GatewayNotificationController } from './WebAPI/Controllers/notification/GatewayNotificationController';
import { GatewayAnalyticsController } from './WebAPI/Controllers/analytics/GatewayAnalyticsController';

// Middlewares
import { logTraffic } from './Middlewares/logger/LoggingMiddleware';
import { corsPolicy } from './Middlewares/cors/CorsMiddleware';
import { bodyParserErrorHandler } from './Middlewares/parser/ParserMiddleware';
import { invalidRouteHandler } from './Middlewares/router/RoutingErrorMiddleware';
import { globalErrorHandler } from './Middlewares/recovery/GlobalErrorMiddleware';

// Infrastructure
import { logger } from './Infrastructure/logging/Logger';

const app = express();

/**
 * corsPolicy - Protects microservice from unauthorized access.
 * logTraffic - Middleware that logs incoming requests and outgoing responses.
 * express.json() - JSON parsing middleware.
 * bodyParserErrorHandler - Prevents invalid JSON formats.
 */
app.use(corsPolicy, logTraffic, express.json(), bodyParserErrorHandler);

// Core infrastructure
const loggerService: ILoggerService = new LoggerService(logger);
const errorHandlingService: IErrorHandlingService = new ErrorHandlingService(loggerService);

// Domain services
const gatewayAuthService: IGatewayAuthService = new GatewayAuthService(errorHandlingService);
const gatewayUserService: IGatewayUserService = new GatewayUserService(errorHandlingService);
const gatewayProjectService: IGatewayProjectService = new GatewayProjectService(errorHandlingService);
const gatewayTaskService: IGatewayTaskService = new GatewayTaskService(errorHandlingService);
const gatewayFileService: IGatewayFileService = new GatewayFileService(errorHandlingService);
const gatewayNotificationService: IGatewayNotificationService = new GatewayNotificationService(errorHandlingService);
const gatewayAnalyticsService: IGatewayAnalyticsService = new GatewayAnalyticsService(errorHandlingService);

// Controllers
const healthController = new HealthController();
const gatewayAuthController = new GatewayAuthController(gatewayAuthService);
const gatewayUserController = new GatewayUserController(gatewayUserService);
const gatewayProjectController = new GatewayProjectController(gatewayProjectService);
const gatewayTaskController = new GatewayTaskController(gatewayTaskService);
const gatewayFileController = new GatewayFileController(gatewayFileService);
const gatewayNotificationController = new GatewayNotificationController(gatewayNotificationService);
const gatewayAnalyticsController = new GatewayAnalyticsController(gatewayAnalyticsService);

// Register routes
app.use('/', healthController.getRouter());
app.use('/api/v1', gatewayAuthController.getRouter());
app.use('/api/v1', gatewayUserController.getRouter());
app.use('/api/v1', gatewayProjectController.getRouter());
app.use('/api/v1', gatewayTaskController.getRouter());
app.use('/api/v1', gatewayFileController.getRouter());
app.use('/api/v1', gatewayNotificationController.getRouter());
app.use('/api/v1', gatewayAnalyticsController.getRouter());

// Handles calling invalid routes.
app.use(invalidRouteHandler);

// Protects the server from unexpected errors.
app.use(globalErrorHandler);

export default app;
