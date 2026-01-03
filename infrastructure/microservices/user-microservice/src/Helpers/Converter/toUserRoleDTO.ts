import { UserRoleDTO } from "../../Domain/DTOs/UserRoleDTO";
import { UserRole } from "../../Domain/models/UserRole";

export function toUserRoleDTO(userRole:UserRole) : UserRoleDTO{
    return {
        user_role_id:userRole.user_role_id,
        role_name:userRole.role_name,
        impact_level:userRole.impact_level,
    }
}