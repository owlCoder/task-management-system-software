import bcrypt from "bcryptjs";
import { IAuthService } from "../../Domain/services/IAuthService";
import { LoginUserDTO } from "../../Domain/DTOs/LoginUserDTO";
import { LoginResponseType } from "../../Domain/types/LoginResponse";
import { IEmailService } from "../../Domain/services/IEmailService";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { IUserRepository } from "../../Domain/services/IUserRepository";
import { ILoginStrategy } from "../../Domain/services/ILoginStrategy";

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private passwordStrategy: ILoginStrategy,
    private otpStrategy: ILoginStrategy,
    private emailService: IEmailService,
    private readonly logger: ILogerService
  ) {}

  async login(data: LoginUserDTO): Promise<LoginResponseType> {
    // const hashedInputPassword = await bcrypt.hash(data.password, 10);
    // console.log("Hashed input password:", hashedInputPassword);

    const user = await this.userRepository.findOne({
      where: { username: data.username },
      relations: ["user_role"],
    });

    if (!user || user.is_deleted) {
      this.logger.log(SeverityEnum.WARN, `Login attempt failed: user not found or deleted for username ${data.username}`);
      return { authenticated: false };
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
    if (!passwordMatches) {
      this.logger.log(SeverityEnum.WARN, `Login attempt failed: invalid password for username ${data.username}`);
      return { authenticated: false };
    }

    this.logger.log(SeverityEnum.INFO, `Login successful for user ${data.username} with UID ${user.user_id}`);

    const strategy = this.emailService.isAvailable ? this.otpStrategy : this.passwordStrategy;
    const result = await strategy.authenticate(user);

    return result;
  }
}
