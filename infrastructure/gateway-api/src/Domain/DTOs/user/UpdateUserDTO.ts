import { UserRole } from "../../enums/UserRole"

export interface UpdateUserDTO {
    username: string,
    email: string,
    role_name: UserRole,
    password?: string
}
