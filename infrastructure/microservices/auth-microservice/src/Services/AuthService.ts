import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { User } from "../Domain/models/User";
import { IAuthService } from "../Domain/services/IAuthService";
import { LoginUserDTO } from "../Domain/DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { AuthResponseType } from "../Domain/types/AuthResponse";
import { BrowserData } from "../Domain/models/BrowserData";
import { LoginResponseType } from "../Domain/types/LoginResponse";
import { UserRole } from "../Domain/models/UserRole";
import { EmailService } from "./EmailService";
import { SessionService } from "./SessionService";
import { RoleService } from "./RoleService";
import { ILogerService } from "../Domain/services/ILogerService";
import { SeverityEnum } from "../Domain/enums/SeverityEnum";

export class AuthService implements IAuthService {
  private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS || "10", 10);
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);
  private readonly logger: ILogerService;

  constructor(
    private userRepository: Repository<User>,
    private emailService: EmailService,
    private sessionService: SessionService,
    private roleService: RoleService,
    logger: ILogerService
  ) {
    this.logger = logger;
  }

  async login(data: LoginUserDTO): Promise<LoginResponseType> {
    const user = await this.userRepository.findOne({
      where: { username: data.username },
      relations: ["user_role"],
    });
    if (!user || user.is_deleted) return { authenticated: false };

    const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
    if (!passwordMatches) return { authenticated: false };

    if (this.emailService.isAvailable) {
      const [sessionData, sessionId, success] = await this.emailService.sendOTPCode(user);
      if (!success || !sessionData) return { authenticated: false };
      this.sessionService.setSession(sessionId, sessionData);
      return {
        authenticated: true,
        userData: {
          user_id: user.user_id,
          session_id: sessionId,
          otp_required: true,
          iat: Math.floor(sessionData.dateCreated.getTime() / 1000),
          exp: Math.floor(sessionData.dateCreated.getTime() / 1000) + this.loginSessionExpirationMinutes * 60,
        },
      };
    } else {
      return {
        authenticated: true,
        userData: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.user_role.role_name,
          otp_required: false
        }
      };
    }
  }

  async register(data: RegistrationUserDTO): Promise<AuthResponseType> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    if (existingUser) return { authenticated: false };

    const validRole: UserRole | undefined = this.roleService.getRole(data.role);
    //////////////////////////////////////////
    // Enable role restrictions in production
    //////////////////////////////////////////
    // if (!validRole || validRole.role_name === "Admin" || validRole.role_name === "SysAdmin"
    //   || validRole.role_name === "Project Manager" || validRole.role_name === "Analytics & Development Manager") {
    //   return { authenticated: false };
    // }

    // Temporary bypass for testing purposes
    if (!validRole) {
      return { authenticated: false };
    }

    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    const newUser = this.userRepository.create({
      username: data.username,
      email: data.email,
      user_role: validRole,
      password_hash: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      authenticated: true,
      userData: {
        user_id: savedUser.user_id,
        username: savedUser.username,
        email: savedUser.email,
        role: validRole.role_name,
      },
    };
  }

  async resendOtp(browserData: BrowserData): Promise<LoginResponseType> {
    const user = await this.userRepository.findOne({
      where: { user_id: browserData.user_id },
      relations: ["user_role"],
    });
    if (!user || user.is_deleted) return { authenticated: false };    
    const session = this.validateSession(browserData.session_id, browserData.user_id);
    if (!session) return { authenticated: false };
    if (this.emailService.isAvailable) {
      const [newSessionData, newSessionId, success] = await this.emailService.sendOTPCode(user);
      if (!success || !newSessionData) return { authenticated: false };
      this.sessionService.deleteSession(browserData.session_id); // Invalidate old session to prevent reuse
      this.sessionService.setSession(newSessionId, newSessionData);

      return {
        authenticated: true,
        userData: {
          user_id: user.user_id,
          session_id: newSessionId,
          otp_required: true,
          iat: Math.floor(newSessionData.dateCreated.getTime() / 1000),
          exp: Math.floor(newSessionData.dateCreated.getTime() / 1000) + this.loginSessionExpirationMinutes * 60,
        },
      };
    }
    else {
        return {
        authenticated: true,
        userData: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.user_role.role_name,
          otp_required: false
        }
      };
    }
  }

  async verifyOtp(browserData: BrowserData, otp: string): Promise<AuthResponseType> {
    const user = await this.userRepository.findOne({
      where: { user_id: browserData.user_id },
      relations: ["user_role"],
    });
    if (!user || user.is_deleted) return { authenticated: false };

    const session = this.validateSession(browserData.session_id, browserData.user_id);
    if (!session) return { authenticated: false };

    if (session.otpCode !== otp) {
      return { authenticated: false };
    }

    this.sessionService.deleteSession(browserData.session_id);

    return {
      authenticated: true,
      userData: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.user_role.role_name,
      }
    };
  }

  private validateSession(sessionId: string, userId: number): any {
    if (!sessionId) return null;
    const session = this.sessionService.getSession(sessionId);
    if (!session) return null;

    const nowMs = Date.now();
    const expired = (nowMs - session.dateCreated.getTime()) > (this.loginSessionExpirationMinutes * 60 * 1000);

    if (expired || session.userId !== userId) {
      this.sessionService.deleteSession(sessionId);
      return null;
    }

    return session;
  }
}
