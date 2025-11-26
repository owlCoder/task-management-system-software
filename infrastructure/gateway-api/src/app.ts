import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { IGatewayAuthService } from './Domain/services/IGatewayAuthService';
import { GatewayAuthService } from './Services/GatewayAuthService';
import { GatewayAuthController } from './WebAPI/GatewayAuthController';
import { GatewayUserController } from './WebAPI/GatewayUserController';
import { IGatewayUserService } from './Domain/services/IGatewayUserService';
import { GatewayUserService } from './Services/GatewayUserService';

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

// Services
const gatewayAuthService: IGatewayAuthService = new GatewayAuthService();
const gatewayUserService: IGatewayUserService = new GatewayUserService();

// WebAPI routes
const gatewayAuthController = new GatewayAuthController(gatewayAuthService);
const gatewayUserController = new GatewayUserController(gatewayUserService);

// Registering routes
app.use('/api/v1', gatewayAuthController.getRouter());
app.use('/api/v1', gatewayUserController.getRouter())

export default app;
