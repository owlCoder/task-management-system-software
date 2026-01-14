import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import { initialize_database } from './Database/InitializeConnection';
import dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { User } from './Domain/models/User';
import { Db } from './Database/DbConnectionPool';
import { IAuthService } from './Domain/services/IAuthService';
import { AuthService } from './Services/AuthenticationServices/AuthService';
import { AuthController } from './WebAPI/controllers/AuthController';
import { ILogerService } from './Domain/services/ILogerService';
import { LogerService } from './Services/LogerServices/LogerService';
import { LoggingServiceEnum } from './Domain/enums/LoggingServiceEnum';
import { SeverityEnum } from './Domain/enums/SeverityEnum';
import { UserRole } from './Domain/models/UserRole';
import { SessionService } from './Services/SessionServices/SessionService';
import { EmailService } from './Services/EmailServices/EmailService';
import { OTPGenerator } from './Services/OTPServices/OTPGenerator';
import { EmailHealthChecker } from './Services/EmailServices/EmailHealthChecker';
import { OTPVerificationService } from './Services/OTPServices/OTPVerificationService';
import { IOTPVerificationService } from './Domain/services/IOTPVerificationService';
import { PasswordLoginStrategy } from './Services/LoginStrategies/PasswordLoginStrategy';
import { OtpLoginStrategy } from './Services/LoginStrategies/OtpLoginStrategy';
import { setLoggingLevel } from './helpers/loggingHelper';
import { ITokenNamingStrategy } from './Domain/strategies/ITokenNamingStrategy';
import { TokenNamingStrategyFactory } from './factories/TokenNamingStrategyFactory';
import { JWTTokenService } from './Services/JWTTokenServices/JWTTokenService';

dotenv.config({ quiet: true });

// Set logging level based on environment
setLoggingLevel();

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

// Create a temporary logger for initialization
const initLogger = new LogerService(LoggingServiceEnum.APP_SERVICE);

(async () => {
  initLogger.log(SeverityEnum.INFO, "Initializing auth microservice");
  initLogger.log(SeverityEnum.DEBUG, "Initializing database connection");

  await initialize_database();

  initLogger.log(SeverityEnum.DEBUG, "Database initialized, setting up repositories and services");

  // ORM Repositories
  const userRepository: Repository<User> = Db.getRepository(User);
  // const userRoleRepository: Repository<UserRole> = Db.getRepository(UserRole);

  // Services
  const authLogger = new LogerService(LoggingServiceEnum.AUTH_SERVICE);
  const emailLogger = new LogerService(LoggingServiceEnum.EMAIL_SERVICE);
  // const roleLogger = new LogerService(LoggingServiceEnum.ROLE_SERVICE);
  const sessionLogger = new LogerService(LoggingServiceEnum.SESSION_SERVICE);
  const otpVerificationLogger = new LogerService(LoggingServiceEnum.OTP_VERIFICATION_SERVICE);
  const emailHealthCheckerLogger = new LogerService(LoggingServiceEnum.EMAIL_HEALTH_CHECKER_SERVICE);

  initLogger.log(SeverityEnum.DEBUG, "Initializing OTP and email services");

  const otpGenerator = new OTPGenerator();
  const healthChecker = new EmailHealthChecker(emailHealthCheckerLogger);

  const emailService = new EmailService(emailLogger, healthChecker);
  const sessionService = new SessionService(sessionLogger);
  const passwordStrategy = new PasswordLoginStrategy(authLogger);
  const otpStrategy = new OtpLoginStrategy(emailService, sessionService, otpGenerator, authLogger);
  const authService: IAuthService = new AuthService(userRepository, passwordStrategy, otpStrategy, emailService, authLogger);
  const otpVerificationService: IOTPVerificationService = new OTPVerificationService(userRepository, emailService, sessionService, otpGenerator, otpVerificationLogger);
  const logerService: ILogerService = new LogerService(LoggingServiceEnum.APP_SERVICE);

  initLogger.log(SeverityEnum.DEBUG, "Initializing token naming strategy");

  const tokenNamingStrategy: ITokenNamingStrategy = TokenNamingStrategyFactory.createDefaultStrategy();
  const jwtTokenService = new JWTTokenService();

  initLogger.log(SeverityEnum.DEBUG, "Setting up WebAPI controllers");

  // WebAPI routes
  const authController = new AuthController(authService, otpVerificationService, logerService, tokenNamingStrategy, jwtTokenService);

  // Registering routes
  app.use('/api/v1', authController.getRouter());

  initLogger.log(SeverityEnum.INFO, "Auth microservice initialization completed successfully");
})();
export default app;
