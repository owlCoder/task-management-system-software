import { UserRole } from "../../Domain/models/UserRole";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { IRoleRepository } from "../../Domain/services/IRoleRepository";
import { IRoleRefresher, RoleRefresher } from "./RoleRefresher";

export class RoleService {
  private userRoles: ReadonlyMap<string, UserRole> = new Map();
  private readonly roleRefresher: IRoleRefresher;
  private readonly logger: ILogerService;

  constructor(roleRepository: IRoleRepository, logger: ILogerService) {
    this.logger = logger;
    this.roleRefresher = new RoleRefresher(roleRepository, logger);
    // Initialize and schedule refresh
    this.refreshUserRoles().then(() => {
      const refreshIntervalMinutes = parseInt(process.env.USER_ROLES_REFRESH_INTERVAL_MINUTES || "5", 10);
      setInterval(() => this.refreshUserRoles(), refreshIntervalMinutes * 60000);
    });
  }

  getRole(user_role_name: string): UserRole | undefined {
    const role = this.userRoles.get(user_role_name);
    if (!role) {
      this.logger.log(SeverityEnum.WARN, `Role not found: ${user_role_name}`);
    }
    return role;
  }

  private async refreshUserRoles(): Promise<void> {
    this.userRoles = await this.roleRefresher.refreshRoles();
  }
}