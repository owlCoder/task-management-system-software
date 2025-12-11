import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import { initialize_database } from './Database/InitializeConnection';
import dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { User } from './Domain/models/User';
import { Db } from './Database/DbConnectionPool';
import { IAuthService } from './Domain/services/IAuthService';
import { AuthService } from './Services/AuthService';
import { AuthController } from './WebAPI/controllers/AuthController';
import { ILogerService } from './Domain/services/ILogerService';
import { LogerService } from './Services/LogerService';
import { LoggingServiceEnum } from './Domain/enums/LoggingServiceEnum';
import { UserRole } from './Domain/models/UserRole';
import { RoleService } from './Services/RoleService';
import { SessionService } from './Services/SessionService';
import { EmailService } from './Services/EmailService';

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

(async () => {
  await initialize_database();

  // ORM Repositories
  const userRepository: Repository<User> = Db.getRepository(User);
  const userRoleRepository: Repository<UserRole> = Db.getRepository(UserRole);

  // Services
  const authLogger = new LogerService(LoggingServiceEnum.AUTH_SERVICE);
  const emailLogger = new LogerService(LoggingServiceEnum.NOTIFICATION_SERVICE);
  const roleLogger = new LogerService(LoggingServiceEnum.ROLE_SERVICE);
  const sessionLogger = new LogerService(LoggingServiceEnum.SESSION_SERVICE);

  const emailService = new EmailService(emailLogger);
  const sessionService = new SessionService(sessionLogger);
  const roleService = new RoleService(userRoleRepository, roleLogger);
  const authService: IAuthService = new AuthService(userRepository, emailService, sessionService, roleService, authLogger);
  const logerService: ILogerService = new LogerService(LoggingServiceEnum.APP_SERVICE);

  // WebAPI routes
  const authController = new AuthController(authService, logerService);

  // Registering routes
  app.use('/api/v1', authController.getRouter());
})();
export default app;
