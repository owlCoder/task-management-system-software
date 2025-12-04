import { UserRole } from "../models/UserRole";

export class UserUpdateDTO {
  public constructor(
    public username: string,
    public email: string,
    public role_name: string,
    public password?: string
  ) {}
}
