import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { User } from "../Domain/models/User";
import { IAuthService } from "../Domain/services/IAuthService";
import { LoginUserDTO } from "../Domain/DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { AuthResponseType } from "../Domain/types/AuthResponse";
import { LoginData } from "../Domain/models/LoginData";
import { BrowserData } from "../Domain/models/BrowserData";
import { v4 as uuidv4 } from 'uuid';
import { randomInt } from "crypto";
import { LoginResponseType } from "../Domain/types/LoginResponse";
import { UserRole } from "../Domain/models/UserRole";
import { validateOtpVerificationData } from "../WebAPI/validators/OtpValidator"; 

export class AuthService implements IAuthService {
  private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS || "10", 10);
  private readonly loginSessionExpirationMinutes: number = parseInt(process.env.LOGIN_SESSION_EXPIRATION_MINUTES || "5", 10);

  /**
   * In-memory session store, mapping session IDs to LoginData;
   * Stored in <session_id, LoginData> format
   */
  private SessionStore: Map<string, LoginData> = new Map(); 
  
  /**
   * Cache for user roles (contents are readonly);
   * Stored in <role_id, UserRole> format
   */
  private userRoles: ReadonlyMap<number, UserRole> = new Map();

  constructor(private userRepository: Repository<User>, private userRoleRepository: Repository<UserRole>) {
    // Start a background task to clear expired sessions every minute
    setInterval(() => this.clearExpiredSessions(), 60000);   
    
    // Start a background task to refresh user roles every x minutes (e.g., 5 minutes)
    const refreshIntervalMinutes = parseInt(process.env.USER_ROLES_REFRESH_INTERVAL_MINUTES || "5", 10);
    setInterval(() => this.refreshUserRoles(), refreshIntervalMinutes * 60000);
 
  }
  
  /**
   * Refreshes the userRoles cache from the database
   */
  private async refreshUserRoles(): Promise<void> {
    try {
      const roles = await this.userRoleRepository.find();
      const newMap = new Map<number, UserRole>();
      roles.forEach(role => newMap.set(role.role_id, role));
      this.userRoles = newMap;  // Reassign to new ReadonlyMap
    } catch (error) {
      console.error('Error refreshing user roles:', error);
    }
  }
  /**
   * Login user
   */
  async login(data: LoginUserDTO): Promise<LoginResponseType> {
    const user = await this.userRepository.findOne({ where: { username: data.username } });
    if (!user) return { authenticated: false };

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) return { authenticated: false };

    const otpCode = randomInt(0, 100000000).toString().padStart(8, '0'); // Generate 8-digit OTP
    
    const dateCreated = new Date();
    const sessionData: LoginData = { user_id: user.id, otp_code: otpCode, date_created: dateCreated };
    const sessionId = uuidv4();
    this.SessionStore.set(sessionId, sessionData);
    
      // Here i will call the mailing service to send the OTP to user's email
      // But for now, just log it to the console, until the email service is live
      console.log(`Generated OTP for user ${user.username} on browser id ${sessionId} \nOTP code for this session: ${otpCode}`); 
    
    
    return {
      authenticated: true,
      userData: {
        user_id: user.id,
        session_id: sessionId,
        iat: Math.floor(dateCreated.getTime() / 1000),
        exp: Math.floor(dateCreated.getTime() / 1000) + this.loginSessionExpirationMinutes * 60,
      },
    };
  }

  /**
   * Register new user
   */
  async register(data: RegistrationUserDTO): Promise<AuthResponseType> {
    // Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    if (existingUser) return { authenticated: false };

    // Check if role exists in DB
    const validRole = await this.userRoleRepository.findOne({ where: { role_id: data.role } });
    if (!validRole) {
      return { authenticated: false }; // Add message if AuthResponseType supports it
    }
    console.log("existingUser", existingUser);

    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    const newUser = this.userRepository.create({
      username: data.username,
      email: data.email,
      role: data.role,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      authenticated: true,
      userData: {
        user_id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role,
      },
    };
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(browserData: BrowserData, otp: string): Promise<AuthResponseType> {
    const validation = validateOtpVerificationData(browserData, otp);
    
    if (!validation.success) {
      return { authenticated: false };
    }
    console.log("Verifying OTP for user ID:", browserData.user_id, "with session ID:", browserData.session_id);
    const user = await this.userRepository.findOne({ where: { id: browserData.user_id } });
    if (!user) return { authenticated: false };

    const sessionId = browserData.session_id;
    if (!sessionId) return { authenticated: false };
    const session = this.SessionStore.get(sessionId);
    if (!session) {
      return { authenticated: false };
    }
    const nowMs = Date.now();
    const expired = (nowMs - session.date_created.getTime()) > (this.loginSessionExpirationMinutes * 60 * 1000);

    if (expired) {
      this.SessionStore.delete(sessionId);
      return { authenticated: false };
    }

    if (session.user_id.toString() !== browserData.user_id.toString()) {
      this.SessionStore.delete(sessionId);
      return { authenticated: false };
    }

    if (session.otp_code !== otp) {
      return { authenticated: false };
    }

    this.SessionStore.delete(sessionId);

    return {
      authenticated: true,
      userData: {
        user_id: user.id,
        username: user.username,
        role: user.role,
      }
    };
  }

  /**
   * Clears expired sessions from SessionStore
   */
  private clearExpiredSessions(): void {
    const now = Date.now();
    const expirationMs = this.loginSessionExpirationMinutes * 60 * 1000;
    for (const [sessionId, sessionData] of this.SessionStore) {
      if ((now - sessionData.date_created.getTime()) > expirationMs) {
        this.SessionStore.delete(sessionId);
      }
    }
  }
}
