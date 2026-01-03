export interface UserRoleDTO {
  user_role_id: number;
  role_name: string;
  impact_level: number;
}

export const DefaultUserRoleDTO: UserRoleDTO = {
  user_role_id: 0,
  role_name: "",
  impact_level: 0,
};
