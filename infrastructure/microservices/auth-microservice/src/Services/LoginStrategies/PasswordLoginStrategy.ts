import { ILoginStrategy } from "../../Domain/services/ILoginStrategy";
import { LoginResponseType } from "../../Domain/types/LoginResponse";
import { User } from "../../Domain/models/User";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";

export class PasswordLoginStrategy implements ILoginStrategy {
  constructor(private readonly logger: ILogerService) {}

  async authenticate(user: User): Promise<LoginResponseType> {
    this.logger.log(SeverityEnum.INFO, `Password authentication successful for user ${user.username} (email service unavailable)`);

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