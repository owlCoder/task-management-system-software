import { ILoginStrategy } from "../../Domain/services/ILoginStrategy";
import { LoginResponseType } from "../../Domain/types/LoginResponse";
import { User } from "../../Domain/models/User";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { UserDTO } from "../../Domain/DTOs/UserDTO";

export class PasswordLoginStrategy implements ILoginStrategy {
  constructor(private readonly logger: ILogerService) {}

  async authenticate(user: UserDTO): Promise<LoginResponseType> {
    this.logger.log(SeverityEnum.INFO, `Password authentication successful for user ${user.username} (email service unavailable)`);

    return {
      authenticated: true,
      userData: {
        user_id: user.user_id,
        google_id_required : false,
        username: user.username,
        email: user.email,
        role: user.user_role.role_name,
        image_url: user.image_url !== null ? user.image_url : undefined,
        otp_required: false
      }
    };
  }
}