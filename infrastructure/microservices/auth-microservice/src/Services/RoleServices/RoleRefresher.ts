import { UserRole } from "../../Domain/models/UserRole";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { IRoleRepository } from "../../Domain/services/IRoleRepository";

export interface IRoleRefresher {
  refreshRoles(): Promise<Map<string, UserRole>>;
}

export class RoleRefresher implements IRoleRefresher {
  constructor(
    private roleRepository: IRoleRepository,
    private logger: ILogerService
  ) {}

  async refreshRoles(): Promise<Map<string, UserRole>> {
    try {
      const roles = await this.roleRepository.find();
      const newMap = new Map<string, UserRole>();
      roles.forEach(role => newMap.set(role.role_name, role));
      this.logger.log(SeverityEnum.INFO, `Successfully refreshed ${roles.length} user roles`);
      return newMap;
    } catch (error) {
      this.logger.log(SeverityEnum.ERROR, `Error refreshing user roles: ${error}`);
      return new Map(); // Return empty map on error
    }
  }
}