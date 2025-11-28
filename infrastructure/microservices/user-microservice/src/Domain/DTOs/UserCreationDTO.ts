export class UserCreationDTO {
  public constructor(
    public username: string = "",
    public role_name: string = "",
    public password: string = "",
    public email: string = ""
  ) {}
}
