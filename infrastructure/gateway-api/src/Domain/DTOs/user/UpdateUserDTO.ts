import { UserRole } from "../../enums/user/UserRole"

export interface UpdateUserDTO {
    username: string,
    email: string,
    role_name: UserRole,
    password?: string
}
