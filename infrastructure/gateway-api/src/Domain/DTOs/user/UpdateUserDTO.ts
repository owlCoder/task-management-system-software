import { UserRole } from "../../enums/UserRole"

export interface UpdateUserDTO {
    user_id: number,
    username: string,
    password: string,
    new_password?: string,
    role_name: UserRole,
    email: string
    is_deleted?: boolean,
    weekly_working_hour_sum?: number
}
