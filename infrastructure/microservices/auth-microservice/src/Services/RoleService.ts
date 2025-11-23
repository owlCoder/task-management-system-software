import { Repository } from "typeorm";
import { UserRole } from "../Domain/models/UserRole";

export class RoleService {
  private userRoles: ReadonlyMap<number, UserRole> = new Map();
  private readonly userRoleRepository: Repository<UserRole>;

  constructor(userRoleRepository: Repository<UserRole>) {
    this.userRoleRepository = userRoleRepository;
    // Start background task to refresh roles
    const refreshIntervalMinutes = parseInt(process.env.USER_ROLES_REFRESH_INTERVAL_MINUTES || "5", 10);
    const refreshIntervalMs = refreshIntervalMinutes * 60000;
    setTimeout(() => {
      this.refreshUserRoles();
      setInterval(() => this.refreshUserRoles(), refreshIntervalMs);
    }, 2000);
  }

  getRole(roleId: number): UserRole | undefined {
    return this.userRoles.get(roleId);
  }

  private async refreshUserRoles(): Promise<void> {
    try {
      const roles = await this.userRoleRepository.find();
      const newMap = new Map<number, UserRole>();
      roles.forEach(role => newMap.set(role.role_id, role));
      this.userRoles = newMap;
    } catch (error) {
      console.error('Error refreshing user roles:', error);
    }
  }
}