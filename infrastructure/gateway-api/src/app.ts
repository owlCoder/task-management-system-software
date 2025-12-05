import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { IGatewayAuthService } from './Domain/services/auth/IGatewayAuthService';
import { GatewayAuthService } from './Services/auth/GatewayAuthService';
import { GatewayAuthController } from './WebAPI/auth/GatewayAuthController';
import { GatewayUserController } from './WebAPI/user/GatewayUserController';
import { IGatewayUserService } from './Domain/services/user/IGatewayUserService';
import { GatewayUserService } from './Services/user/GatewayUserService';
import { IGatewayFileService } from './Domain/services/file/IGatewayFileService';
import { GatewayFileService } from './Services/file/GatewayFileService';
import { GatewayFileController } from './WebAPI/file/GatewayFileController';
import { logTraffic } from './Middlewares/logger/LoggingMiddleware';
import { IErrorHandlingService } from './Domain/services/common/IErrorHandlingService';
import { ErrorHandlingService } from './Services/common/ErrorHandlingService';
import { ILoggerService } from './Domain/services/common/ILoggerService';
import { LoggerService } from './Services/common/LoggerService';
import { logger } from './Utils/Logger/Logger';

dotenv.config({ quiet: true });

const app = express();

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["POST"];

// Protected microservice from unauthorized access
app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
}));

app.use(express.json());

app.use(logTraffic);

// Services
const loggerService: ILoggerService = new LoggerService(logger);
const errorHandlingService: IErrorHandlingService = new ErrorHandlingService(loggerService);
const gatewayAuthService: IGatewayAuthService = new GatewayAuthService(errorHandlingService, loggerService);
const gatewayUserService: IGatewayUserService = new GatewayUserService(errorHandlingService, loggerService);
const gatewayFileService: IGatewayFileService = new GatewayFileService(errorHandlingService, loggerService);

// WebAPI routes
const gatewayAuthController = new GatewayAuthController(gatewayAuthService);
const gatewayUserController = new GatewayUserController(gatewayUserService);
const gatewayFileController = new GatewayFileController(gatewayFileService);

// Registering routes
app.use('/api/v1', gatewayAuthController.getRouter());
app.use('/api/v1', gatewayUserController.getRouter());
app.use('/api/v1', gatewayFileController.getRouter());

export default app;
