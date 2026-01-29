// External libraries
import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import dotenv from 'dotenv';
import { Repository } from 'typeorm';

// Database
import { Db } from './Database/DbConnectionPool';
import { initialize_database } from './Database/InitializeConnection';

// Domain models
import { User } from './Domain/models/User';
import { UserRole } from './Domain/models/UserRole';

// Enums
import { LoggingServiceEnum } from './Domain/enums/LoggingServiceEnum';
import { SeverityEnum } from './Domain/enums/SeverityEnum';

// Interfaces
import { IAuthService } from './Domain/services/IAuthService';
import { ILogerService } from './Domain/services/ILogerService';
import { IOTPVerificationService } from './Domain/services/IOTPVerificationService';
import { ITokenNamingStrategy } from './Domain/strategies/ITokenNamingStrategy';
import { ISIEMService } from './siem/Domen/services/ISIEMService';
// Helpers
import { PasswordLoginStrategy } from './Services/LoginStrategies/PasswordLoginStrategy';
import { OtpLoginStrategy } from './Services/LoginStrategies/OtpLoginStrategy';
import { JWTTokenService } from './Services/JWTTokenServices/JWTTokenService';
import { EmailHealthChecker } from './Services/EmailServices/EmailHealthChecker';
import { OTPGenerator } from './Services/OTPServices/OTPGenerator';
import { setLoggingLevel } from './helpers/loggingHelper';
import { TokenNamingStrategyFactory } from './factories/TokenNamingStrategyFactory';


// Services
import { AuthService } from './Services/AuthenticationServices/AuthService';
import { LogerService } from './Services/LogerServices/LogerService';
import { SessionService } from './Services/SessionServices/SessionService';
import { EmailService } from './Services/EmailServices/EmailService';
import { OTPVerificationService } from './Services/OTPServices/OTPVerificationService';
import { SIEMService } from './siem/Services/SIEMService';
// Controllers
import { AuthController } from './WebAPI/controllers/AuthController';
import { IEmailService } from './Domain/services/IEmailService';

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
  const userRoleRepository: Repository<UserRole> = Db.getRepository(UserRole);

  // Services
  const authLogger = new LogerService(LoggingServiceEnum.AUTH_SERVICE);
  const emailLogger = new LogerService(LoggingServiceEnum.EMAIL_SERVICE);
  // const roleLogger = new LogerService(LoggingServiceEnum.ROLE_SERVICE);
  const sessionLogger = new LogerService(LoggingServiceEnum.SESSION_SERVICE);
  const otpVerificationLogger = new LogerService(LoggingServiceEnum.OTP_VERIFICATION_SERVICE);
  const emailHealthCheckerLogger = new LogerService(LoggingServiceEnum.EMAIL_HEALTH_CHECKER_SERVICE);
  const siemLogger = new LogerService(LoggingServiceEnum.SIEM);

  initLogger.log(SeverityEnum.DEBUG, "Initializing OTP and email services");

  const otpGenerator = new OTPGenerator();
  const healthChecker = new EmailHealthChecker(emailHealthCheckerLogger);

  const emailService : IEmailService = new EmailService(emailLogger, healthChecker);
  const sessionService = new SessionService(sessionLogger);
  const passwordStrategy = new PasswordLoginStrategy(authLogger);
  const otpStrategy = new OtpLoginStrategy(emailService, sessionService, otpGenerator, authLogger);
  const authService: IAuthService = new AuthService(userRepository, passwordStrategy, otpStrategy, emailService, authLogger, userRoleRepository);
  const otpVerificationService: IOTPVerificationService = new OTPVerificationService(userRepository, emailService, sessionService, otpGenerator, otpVerificationLogger);
  const logerService: ILogerService = new LogerService(LoggingServiceEnum.APP_SERVICE);
  const siemService : ISIEMService = new SIEMService(siemLogger);

  initLogger.log(SeverityEnum.DEBUG, "Initializing token naming strategy");

  const tokenNamingStrategy: ITokenNamingStrategy = TokenNamingStrategyFactory.createDefaultStrategy();
  const jwtTokenService = new JWTTokenService();

  initLogger.log(SeverityEnum.DEBUG, "Setting up WebAPI controllers");

  // WebAPI routes
  const authController = new AuthController(authService, otpVerificationService, logerService, tokenNamingStrategy, jwtTokenService,siemService);

  // Registering routes
  app.use('/api/v1', authController.getRouter());

  initLogger.log(SeverityEnum.INFO, "Auth microservice initialization completed successfully");
})();
export default app;
