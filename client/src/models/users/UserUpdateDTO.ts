import { UserRoleDTO } from "./UserRoleDTO";

export class UserUpdateDTO {
  public constructor(
    public user_id: number,
    public username: string,
    public password: string,
    public email: string,
    public role_name: UserRoleDTO,
    public new_password?: string,
    public weekly_working_hour_sum?: number
  ) {}
}
