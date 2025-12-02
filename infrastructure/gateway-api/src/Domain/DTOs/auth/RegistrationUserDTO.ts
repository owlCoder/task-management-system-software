import { UserRole } from "../../enums/UserRole";

export interface RegistrationUserDTO {
    username: string;
    role_name: UserRole;
    password: string;
    email: string;
}