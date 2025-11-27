import { Repository } from "typeorm";
import { UserRole } from "../Domain/models/UserRole";

export class RoleService {
  private userRoles: ReadonlyMap<number, UserRole> = new Map();
  private readonly userRoleRepository: Repository<UserRole>;

  constructor(userRoleRepository: Repository<UserRole>) {
    this.userRoleRepository = userRoleRepository;
    // Initialize roles synchronously
    this.refreshUserRoles().then(() => {
      // And then, start background refresh task for user roles
      const refreshIntervalMinutes = parseInt(process.env.USER_ROLES_REFRESH_INTERVAL_MINUTES || "5", 10);
      const refreshIntervalMs = refreshIntervalMinutes * 60000;
      setInterval(() => this.refreshUserRoles(), refreshIntervalMs);
    });
  }

  getRole(user_role_id: number): UserRole | undefined {
    return this.userRoles.get(user_role_id);
  }

  private async refreshUserRoles(): Promise<void> {
    try {
      const roles = await this.userRoleRepository.find();
      const newMap = new Map<number, UserRole>();
      roles.forEach(role => newMap.set(role.user_role_id, role));
      this.userRoles = newMap;
    } catch (error) {
      console.error('Error refreshing user roles:', error);
    }
  }
}