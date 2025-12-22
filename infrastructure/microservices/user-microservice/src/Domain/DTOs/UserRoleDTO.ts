export class UserRoleDTO {
  public constructor(
    public user_role_id: number = 0,
    public role_name: string = "",
    public impact_level: number = 0
  ) {}
}
